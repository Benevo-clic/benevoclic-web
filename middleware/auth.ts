import {defineNuxtRouteMiddleware} from "#app";
import {useUserStore} from "~/stores/user/user.store";

export default defineNuxtRouteMiddleware((to, from) => {
   const  authStore= useUserStore()
  if (authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
