import {useUserStore} from "~/stores/user/user.store";
import {defineNuxtRouteMiddleware} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const  authStore= useUserStore()



  if (!authStore.isAuthenticated) {
    const userRole = authStore.getUserRule;
    if(userRole === 'VOLUNTEER') {
      return navigateTo('/volunteer')
    } else if(userRole === 'ASSOCIATION') {
      return navigateTo('/association/dashboard')
    } else {
      return navigateTo('/dashboard')
    }
  }
})
