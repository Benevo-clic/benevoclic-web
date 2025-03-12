import {useAuthStore} from "~/stores/auth/auth";
import {defineNuxtRouteMiddleware} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const  authStore= useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})