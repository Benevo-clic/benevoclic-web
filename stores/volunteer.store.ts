import type {AssociationVolunteerFollow, VolunteerInfo} from "~/common/interface/volunteer.interface";
import type {CreateVolunteerDto} from "~/common/interface/register.interface";
import {useUserStore} from "~/stores/user/user.store";
import {defineStore} from 'pinia'


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
        async getAssociationToWaitingList() {
            const user = useUserStore().getUser

            this.loading = true
            this.error = null
            try {
                const response = await $fetch('/api/volunteer/getAssociationWaiting', {
                    method: 'GET',
                    query: { volunteerId: user?.userId },
                })
                // Rafraîchir le cache du bénévole après récupération
                await this.getVolunteerInfo();
                return response as VolunteerInfo[]
            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération des associations'
                throw err
            } finally {
                this.loading = false
            }
        },
        async removeVolunteerFromWaitingListAssociation(associationId: string) {
            const user = useUserStore().getUser

            this.loading = true
            this.error = null
            try {
                const response = await $fetch('/api/association/removeAssociationVolunteerWaiting', {
                    method: 'PATCH',
                    body: { associationId, volunteerId: user?.userId },
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                // Rafraîchir le cache du bénévole après modification
                await this.getVolunteerInfo();
                return response as { message: string }
            } catch (err: any) {
                this.error = err?.message || 'Erreur de suppression de la liste d\'attente'
                throw err
            } finally {
                this.loading = false
            }
        },
        async  addVolunteerToWaitingListAssociation(associationId: string,volunteer: {id: string, name: string}) {
            this.loading = true
            this.error = null
            try {
                console.log('Adding volunteer to waiting list for association:', associationId, volunteer);
                const response = await $fetch('/api/volunteer/addVolunteerWaiting', {
                    method: 'PATCH',
                    body: { associationId, volunteerId: volunteer.id, volunteerName: volunteer.name },
                    headers: {
                        "Content-Type": "application/json"
                    },
                })

                await this.getVolunteerInfo();
                return response
            } catch (err: any) {
                this.error = err?.message || 'Erreur d\'ajout à la liste d\'attente'
                throw err
            } finally {
                this.loading = false
            }
        },
        async getAllAssociationsToWaitingList(volunteerId: string) {
            this.loading = true
            this.error = null
            try {
                return await $fetch<AssociationVolunteerFollow[]>('/api/volunteer/getAllAssociationsToWaitingList', {
                    method: 'GET',
                    query: {volunteerId},
                });
            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération des associations en attente'
                throw err
            } finally {
                this.loading = false
            }

        },

        async getAllAssociationsFollowingList(volunteerId: string) {
            this.loading = true
            this.error = null
            try {
                return await $fetch<AssociationVolunteerFollow[]>('/api/volunteer/getAllAssociationsFollowingList', {
                    method: 'GET',
                    query: {volunteerId},
                });
            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération des associations suivies'
                throw err
            } finally {
                this.loading = false
            }
        },
        async getAssociations() {
            const user = useUserStore().getUser

            this.loading = true
            this.error = null
            try {
                const response = await $fetch('/api/volunteer/getAssociations', {
                    method: 'GET',
                    query: { volunteerId: user?.userId },
                })
                // Rafraîchir le cache du bénévole après récupération
                await this.getVolunteerInfo();
                return response as VolunteerInfo[]
            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération des bénévoles'
                throw err
            } finally {
                this.loading = false
            }
        },
        async removeVolunteer() {
            this.loading = true
            this.error = null
            try {
                 await $fetch('/api/volunteer/remove', {
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