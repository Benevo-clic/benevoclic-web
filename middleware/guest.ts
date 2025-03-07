import {useAuthStore} from "~/stores/auth";
import {defineNuxtRouteMiddleware} from "#app";
import {useCookie} from "#app/composables/cookie";
export default defineNuxtRouteMiddleware((to, from) => {

  if (!!useCookie('isConnected').value) {
    return navigateTo('/dashboard')
  }
})