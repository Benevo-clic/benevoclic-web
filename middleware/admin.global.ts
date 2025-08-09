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


  if (!isConnected) {
    if (!isPublicAdminRoute) {
      if (to.path !== '/admin/login') {
        return navigateTo('/admin/login')
      }
    }
    return
  }


  if (!userStore.user) {
    try {
      await userStore.fetchUser()
    } catch (error) {
      if (to.path !== '/admin/login') {
        return navigateTo('/admin/login')
      }
      return
    }
  }

  const userRole = userStore.getRole
  if (userRole !== RoleUser.ADMIN) {
    if (to.path !== '/admin/login') {
      return navigateTo('/admin/login')
    }
    return
  }

  try {
    const isApproved = await userStore.checkAdminApprovalStatus()
    if (!isApproved) {
      if (to.path !== '/admin/verification') {
        return navigateTo('/admin/verification')
      }
      return
    }
  } catch (error) {
    if (to.path !== '/admin/verification') {
      return navigateTo('/admin/verification')
    }
    return
  }

  if (isPublicAdminRoute) {
    if (to.path !== '/admin') {
      return navigateTo('/admin')
    }
    return
  }

  return
})