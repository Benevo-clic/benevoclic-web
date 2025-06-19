import {useUserStore} from "~/stores/user/user.store";
import {defineNuxtRouteMiddleware} from "#app";
import {useVolunteerAuthStore} from "~/stores/volunteer.store";

export default defineNuxtRouteMiddleware((to, from) => {
  const  authStore= useUserStore()



  if (!authStore.isAuthenticated) {
    const userRole = authStore.getUserRule;
    if(userRole === 'VOLUNTEER') {
      return navigateTo('/volunteer/dashboard')
    } else if(userRole === 'ASSOCIATION') {
      return navigateTo('/association/dashboard')
    } else {
      return navigateTo('/dashboard')
    }
  }
})
