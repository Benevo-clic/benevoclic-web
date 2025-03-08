import {defineNuxtRouteMiddleware} from "#app";
import {useAuthStore} from "~/stores/auth";
import {useCookie} from "#app/composables/cookie";

export default defineNuxtRouteMiddleware((to, from) => {
   const  authStore= useAuthStore()
  if (authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
