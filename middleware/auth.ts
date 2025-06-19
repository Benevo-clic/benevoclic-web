import {defineNuxtRouteMiddleware} from "#app";
import {useUserStore} from "~/stores/user/user.store";
import {onMounted} from "vue";
import {useUser} from "~/composables/auth/useUser";
import {useVolunteerAuth} from "~/composables/auth/volunteerAuth";

export default defineNuxtRouteMiddleware((to, from) => {
   const  authStore= useUserStore()

    const auth = useUser()

    onMounted(async () => {

        await auth.fetchUser()

        const userRole = auth.userRole


        if (authStore.isAuthenticated) {
            return navigateTo('/auth/login')
        }

        if(userRole.value === 'VOLUNTEER') {
            return navigateTo(
                {
                    path: '/auth/registerVolunteer',
                }
            )
        }

        if(userRole.value === 'ASSOCIATION'){
            return navigateTo(
                {
                    path: '/auth/registerAssociation',
                }
            )
        }
    })


})
