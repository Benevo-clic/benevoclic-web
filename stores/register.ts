import type {RegisterPayload} from "~/common/types/register.type";

import type { RegisterDone } from "~/common/interface/register.interface";
import {useAuthStore} from "~/stores/auth";
import {useCookie} from "#app/composables/cookie";

export const useRegisterStore = defineStore('register', {

    state: () => ({
        loading: false,
        idUser: null as string | null,
        error: null as string | null,
    }),
    getters:{
        getIdUser: (state)  => state.idUser,
        isRegisted: (state) => !!useCookie('auth_token').value
    },
    actions: {
        async register(payload: RegisterPayload) {
            this.error = null
            this.loading = true

            const userAuthStore = useAuthStore();

            try {
                const response: RegisterDone = await $fetch<RegisterDone>(`api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })

                // await userAuthStore.setCookies(response.loginResponse.idToken, payload.email, response.loginResponse.refreshToken)
                this.idUser = response.registerResponse.uid
                navigateTo('/registerVolunteer')
            } catch (error) {
                this.error = "Une erreur est survenue lors de l'inscription"
            } finally {
                this.loading = false
            }
        }
    }


})