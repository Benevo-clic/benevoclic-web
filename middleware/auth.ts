import {defineNuxtRouteMiddleware} from "#app";
import {useUserStore} from "~/stores/user/user.store";
import {onMounted} from "vue";
import {useUser} from "~/composables/auth/useUser";
import {useVolunteerAuth} from "~/composables/auth/volunteerAuth";

export default defineNuxtRouteMiddleware((to, from) => {
   const  authStore= useUserStore()

    const auth = useUser()
    const volunteer = useVolunteerAuth()

    onMounted(async () => {

        await auth.fetchUser()

        const userRole = auth.userRole
        const isVolunteer = await volunteer.getVolunteerInfo()
        const isAuthenticated = auth.isAuthenticated.value

        const response2 = !isAuthenticated && !isVolunteer

        if (authStore.isAuthenticated) {
            return navigateTo('/auth/login')
        }

        if(response2 && userRole.value === 'VOLUNTEER') {
            return navigateTo(
                {
                    path: '/auth/registerVolunteer',
                }
            )
        }

        if(response2 && userRole.value === 'ASSOCIATION'){
            return navigateTo(
                {
                    path: '/auth/registerAssociation',
                }
            )
        }
    })


})
