import type {VolunteerInfo} from "~/common/interface/volunteer.interface";
import type {CreateVolunteerDto} from "~/common/interface/register.interface";


export const useVolunteerAuthStore = defineStore('volunteerAuth', {
    state: () => ({
        volunteer: null as VolunteerInfo | null,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getVolunteer: (state) => state.volunteer,
    },

    actions:{

        async registerVolunteer(payload: CreateVolunteerDto) {
            this.loading = true
            this.error = null
            try {
                const response = await $fetch<VolunteerInfo>('/api/volunteer/create', {
                    method: 'POST',
                    body: payload,
                })

                if(response) {
                    this.volunteer = response
                }
                await navigateTo({
                    path: '/dashboard',
                    query: {
                        status: 'created',
                        message: 'success',
                        role: "false"
                    }
                })
            } catch (err: any) {
                this.error = err?.message || 'Erreur d\'inscription'
                throw err
            } finally {
                this.loading = false
            }

        }

    }
})