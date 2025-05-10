import {useUserStore} from "~/stores/user/user.store";
import {defineNuxtRouteMiddleware} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const  authStore= useUserStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})