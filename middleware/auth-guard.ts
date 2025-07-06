import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useUserStore } from '~/stores/user/user.store'
import { RoleUser } from '~/common/enums/role.enum'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore()
  
  try {
    // Utiliser le cache du middleware global si disponible
    let user = userStore.user
    
    // Si pas d'utilisateur en cache, le récupérer
    if (!user || !userStore.isUserCacheValid) {
      const fetchedUser = await userStore.fetchUser()
      if (fetchedUser) {
        user = fetchedUser
      }
    }
    
    // Vérifier que fetchUser a bien retourné des données
    if (!user || !user.userId) {
      console.log('Middleware auth-guard: utilisateur non connecté')
      return navigateTo('/auth/login')
    }

    console.log('Middleware auth-guard: utilisateur connecté:', user)

    // Vérifier si l'utilisateur a un rôle défini
    if (!user.role) {
      return navigateTo('/auth/register')
    }

    const role = user.role as RoleUser
    
    // Vérifier si le profil est complété
    if (!user.isCompleted) {
      switch (role) {
        case RoleUser.VOLUNTEER:
          return navigateTo('/auth/registerVolunteer')
        case RoleUser.ASSOCIATION:
          return navigateTo('/auth/registerAssociation')
        default:
          return navigateTo('/auth/register')
      }
    }

    // Gérer les redirections selon le rôle
    switch (role) {
      case RoleUser.VOLUNTEER:
        if (to.path.startsWith('/association/')) {
          return navigateTo('/volunteer')
        }
        if (to.path === '/auth/registerVolunteer') {
          return navigateTo('/volunteer')
        }
        break
        
      case RoleUser.ASSOCIATION:
        if (to.path.startsWith('/volunteer/')) {
          return navigateTo('/association/dashboard')
        }
        if (to.path === '/auth/registerAssociation') {
          return navigateTo('/association/dashboard')
        }
        break
        
      case RoleUser.ADMIN:
        break
        
      default:
        return navigateTo('/auth/register')
    }

  } catch (error) {
    console.error('Erreur dans le middleware auth-guard:', error)
    await userStore.logout()
    return navigateTo('/auth/login')
  }
}) 