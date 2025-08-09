import {defineNuxtRouteMiddleware, navigateTo, useCookie} from '#app'
import { RoleUser } from '~/common/enums/role.enum'
import {useUserStore} from "~/stores/user/user.store";
import {useAuthStore} from "~/stores/auth/auth.store";


const BASE_ROUTE_CONFIG = {
  public: [
    '/admin/login',
    '/admin/register',
    '/admin/verification',
  ],

  admin: [
    '/admin',
    '/admin/support',
    '/admin/users',
    '/admin/associations',
    '/admin/volunteers',
    '/admin/events',
    '/admin/analytics',
  ],
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) {
    return
  }

  const authStore = useAuthStore()
  const userStore = useUserStore()

  if (!useCookie('isConnected').value) {
    await authStore.initAuth()
  }

  const isConnectedRaw = useCookie<any>('isConnected').value
  const isConnected = (isConnectedRaw === 'true') || (isConnectedRaw === true) || authStore.isConnected === true
  const isPublicAdminRoute = BASE_ROUTE_CONFIG.public.includes(to.path)

  // Logs détaillés
  if (process.client) {
    console.log('[ADMIN GUARD] client document.cookie:', document.cookie)
  }
  console.log('[ADMIN GUARD] state', {
    path: to.path,
    isConnectedCookie: isConnectedRaw,
    isConnectedCookieType: typeof isConnectedRaw,
    authStoreIsConnected: authStore.isConnected,
    computedIsConnected: isConnected,
    isPublicAdminRoute,
  })

  if (!isConnected) {
    if (!isPublicAdminRoute) {
      if (to.path !== '/admin/login') {
        console.log('[ADMIN GUARD] redirect to /admin/login because not connected')
        return navigateTo('/admin/login')
      }
    }
    return
  }

  console.log('[ADMIN GUARD] connected, checking user + approval')

  if (!userStore.user) {
    try {
      await userStore.fetchUser()
      console.log('[ADMIN GUARD] user fetched', { hasUser: !!userStore.user, role: userStore.getRole })
    } catch (error) {
      if (to.path !== '/admin/login') {
        console.log('[ADMIN GUARD] fetchUser failed, redirect /admin/login')
        return navigateTo('/admin/login')
      }
      return
    }
  }

  const userRole = userStore.getRole
  if (userRole !== RoleUser.ADMIN) {
    if (to.path !== '/admin/login') {
      console.log('[ADMIN GUARD] role not admin, redirect /admin/login')
      return navigateTo('/admin/login')
    }
    return
  }

  try {
    console.log('[ADMIN GUARD] approval check start')
    const isApproved = await userStore.checkAdminApprovalStatus()
    console.log('[ADMIN GUARD] approval check result', { isApproved })
    if (!isApproved) {
      if (to.path !== '/admin/verification') {
        console.log('[ADMIN GUARD] not approved, redirect /admin/verification')
        return navigateTo('/admin/verification')
      }
      return
    }
    console.log(`[ADMIN GUARD] approved, proceed to ${to.path}`)
  } catch (error) {
    if (to.path !== '/admin/verification') {
      console.log('[ADMIN GUARD] approval check error, redirect /admin/verification')
      return navigateTo('/admin/verification')
    }
    return
  }

  if (isPublicAdminRoute) {
    if (to.path !== '/admin') {
      console.log(`[ADMIN GUARD] was public route ${to.path}, redirect to /admin`)
      return navigateTo('/admin')
    }
    return
  }

  return
})