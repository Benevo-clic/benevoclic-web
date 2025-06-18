import type {VolunteerInfo} from "~/common/interface/volunteer.interface";
import type {CreateVolunteerDto} from "~/common/interface/register.interface";
import {useUserStore} from "~/stores/user/user.store";
import { defineStore } from 'pinia'


export const useVolunteerAuthStore = defineStore('volunteerAuth', {
    state: () => ({
        volunteer: null as VolunteerInfo | null,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getVolunteer: (state) => state.volunteer,
        isExist: (state) => state.volunteer !== null,
    },

    actions:{

        async getVolunteerInfo() {
            const user = useUserStore().getUser
            this.loading = true
            this.error = null
            try {
                const response = await $fetch<VolunteerInfo>('/api/volunteer/volunteerInfo', {
                    method: 'GET',
                    query: { userId: user?.userId },
                })

                if(response) {
                    this.volunteer = response
                }

                return response as VolunteerInfo
            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération des informations'
                throw err
            } finally {
                this.loading = false
            }

        },
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

            } catch (err: any) {
                this.error = err?.message || 'Erreur d\'inscription'
                throw err
            } finally {
                this.loading = false
            }

        },

        async updateVolunteer(payload: Partial<VolunteerInfo>, id: string | null = null) {
            this.loading = true
            this.error = null
            try {
                const response = await $fetch<VolunteerInfo>('/api/volunteer/update', {
                    method: 'PATCH',
                    query: { id},
                    body: payload,
                })

                if(response) {
                    this.volunteer = response
                }

                return response as VolunteerInfo
            } catch (err: any) {
                this.error = err?.message || 'Erreur de mise à jour des informations'
                throw err
            } finally {
                this.loading = false
            }
        },
        async removeVolunteer() {
            this.loading = true
            this.error = null
            try {
                 await $fetch<{ message: string }>('/api/volunteer/remove', {
                    method: 'DELETE',
                    query: { id: this.volunteer?.volunteerId },
                    headers: {
                        "Content-Type": "application/json"
                    },
                })

            } catch (err: any) {
                this.error = err?.message || 'Erreur de suppression du bénévole'
                throw err
            } finally {
                this.loading = false
            }
        },

    }
})