import {defineNuxtRouteMiddleware} from "#app";
import {useUserStore} from "~/stores/user/user.store";


export default defineNuxtRouteMiddleware((to, from) => {
   const  authStore = useUserStore()

    // Redirect unauthenticated users to the login page
    if (!authStore.isAuthenticated) {
        return navigateTo('/auth/login')
    }

})
