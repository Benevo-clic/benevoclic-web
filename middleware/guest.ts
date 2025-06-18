import {useUserStore} from "~/stores/user/user.store";
import {defineNuxtRouteMiddleware} from "#app";
import {useVolunteerAuthStore} from "~/stores/volunteer.store";

export default defineNuxtRouteMiddleware((to, from) => {
  const  authStore= useUserStore()



  if (!authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})