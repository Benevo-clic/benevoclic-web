import type {ApiResponseSubset, AssociationInfo} from "~/common/interface/association.interface";
import type {CreateAssociationDto} from "~/common/interface/register.interface";
import {useUserStore} from "~/stores/user/user.store";
import { defineStore } from 'pinia'


export const useAssociationAuthStore = defineStore('associationAuth', {
    state: () => ({
        association: null as AssociationInfo | null,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getAssociation: (state) => state.association,
        isExist: (state) => state.association !== null,
    },

    actions:{

        async getAssociationInfoBySiret(siret: string) {
            this.loading = true
            this.error = null
            try {
                const response = await $fetch<ApiResponseSubset>('/api/association/associationSiret', {
                    method: 'GET',
                    query: {
                        siretNum : siret
                    },
                })

                return response as ApiResponseSubset

            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération des informations'
                throw err
            } finally {
                this.loading = false
            }
        },
        async getAssociationInfo() {
            const user = useUserStore().getUser
            this.loading = true
            this.error = null
            try {
                const response = await $fetch<AssociationInfo>('/api/association/associationInfo', {
                    method: 'GET',
                    query: { userId: user?.userId },
                })

                if(response) {
                    this.association = response
                }

                return response as AssociationInfo
            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération des informations'
                throw err
            } finally {
                this.loading = false
            }

        },
        async registerAssociation(payload: CreateAssociationDto) {
            this.loading = true
            this.error = null
            try {
                const response = await $fetch<AssociationInfo>('/api/association/create', {
                    method: 'POST',
                    body: payload,
                })

                if(response) {
                    this.association = response
                }

            } catch (err: any) {
                this.error = err?.message || 'Erreur d\'inscription'
                throw err
            } finally {
                this.loading = false
            }

        },
        async updateAssociation(payload: Partial<AssociationInfo>, id: string | null = null) {
            this.loading = true
            this.error = null
            try {
                const response = await $fetch<AssociationInfo>('/api/association/update', {
                    method: 'PATCH',
                    query: { id},
                    body: payload,
                })

                if(response) {
                    this.association = response
                }

                return response as AssociationInfo
            } catch (err: any) {
                this.error = err?.message || 'Erreur de mise à jour des informations'
                throw err
            } finally {
                this.loading = false
            }
        },

        async removeAssociation() {
            this.loading = true
            this.error = null
            try {
                await $fetch<{ message: string }>('/api/association/remove', {
                    method: 'DELETE',
                    query: { id: this.association?.associationId },
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
        }

    }
})