import {defineNuxtRouteMiddleware} from "#app";
import {useAuthStore} from "~/stores/auth";
import {useCookie} from "#app/composables/cookie";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const  token = useCookie('auth_token')

  if (!useCookie('auth_token') || !useCookie('isConnected').value) {
    return navigateTo('/login')
  }
})
