import type {VolunteerInfo} from "~/common/interface/volunteer.interface";
import type {CreateVolunteerDto} from "~/common/interface/register.interface";
import {useUserStore} from "~/stores/user/user.store";
import { defineStore } from 'pinia'


export const useVolunteerAuthStore = defineStore('volunteerAuth', {
    state: () => ({
        volunteer: null as VolunteerInfo | null,
        loading: false,
        error: null as string | null,
        // Cache pour éviter les recalculs
        _volunteerCache: new Map<string, VolunteerInfo>(),
        _lastFetch: 0,
        _cacheExpiry: 5 * 60 * 1000, // 5 minutes
    }),

    getters: {
        getVolunteer: (state) => state.volunteer,
        isExist: (state) => state.volunteer !== null,
        // Vérifier si le cache est valide
        isCacheValid: (state) => {
            return Date.now() - state._lastFetch < state._cacheExpiry;
        }
    },

    actions:{

        // Optimisation du cache
        _updateCache(volunteer: VolunteerInfo) {
            if (volunteer?.volunteerId) {
                this._volunteerCache.set(volunteer.volunteerId, volunteer);
            }
            this._lastFetch = Date.now();
        },

        // Méthode pour nettoyer le cache
        clearCache() {
            this._volunteerCache.clear();
            this._lastFetch = 0;
        },

        async getVolunteerInfo() {
            const user = useUserStore().getUser
            
            // Vérifier le cache d'abord
            if (this.isCacheValid && this.volunteer) {
                return this.volunteer;
            }

            this.loading = true
            this.error = null
            try {
                const response = await $fetch<VolunteerInfo>('/api/volunteer/volunteerInfo', {
                    method: 'GET',
                    query: { userId: user?.userId },
                })
                if(response) {
                    this.volunteer = response
                    // Mettre à jour le cache
                    this._updateCache(response);
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
                    // Mettre à jour le cache
                    this._updateCache(response);
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
                    // Mettre à jour le cache
                    this._updateCache(response);
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

                // Nettoyer le cache après suppression
                if (this.volunteer?.volunteerId) {
                    this._volunteerCache.delete(this.volunteer.volunteerId);
                }
                this.volunteer = null;

            } catch (err: any) {
                this.error = err?.message || 'Erreur de suppression du bénévole'
                throw err
            } finally {
                this.loading = false
            }
        },

    }
})