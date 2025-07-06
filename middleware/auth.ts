import {defineNuxtRouteMiddleware} from "#app";
import {useUserStore} from "~/stores/user/user.store";


export default defineNuxtRouteMiddleware((to, from) => {
   const  authStore = useUserStore()

    if (!authStore.isAuthenticated) {
        return navigateTo('/auth/login')
    }

    // if (authStore.isAuthenticated) {
    //     const userRole = authStore.getUserRule;
    //     if(userRole === 'VOLUNTEER') {
    //         return navigateTo('/volunteer')
    //     } else if(userRole === 'ASSOCIATION') {
    //         return navigateTo('/association/dashboard')
    //     } else {
    //         return navigateTo('/dashboard')
    //     }
    // }

})
