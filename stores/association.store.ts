import { defineStore } from 'pinia'
import type {
  ApiResponseSubset,
  AssociationInfo
} from '~/common/interface/association.interface'
import type { CreateAssociationDto } from '~/common/interface/register.interface'
import { useUserStore } from '~/stores/user/user.store'
import { useAuthStore } from '@/stores/auth/auth.store'

export const useAssociationAuthStore = defineStore('associationAuth', {
  state: () => ({
    association: null as AssociationInfo | null,
    loading: false,
    error: null as string | null,
    _associationCache: new Map<string, AssociationInfo>(),
    _lastFetch: 0,
    _cacheExpiry: 5 * 60 * 1000 // 5 minutes
  }),

  getters: {
    getAssociation: state => state.association,
    isExist: state => state.association !== null,
    isCacheValid: (state) => {
      return Date.now() - state._lastFetch < state._cacheExpiry
    }
  },

  actions: {
    _updateCache (association: AssociationInfo) {
      if (association?.associationId) {
        this._associationCache.set(association.associationId, association)
      }
      this._lastFetch = Date.now()
    },

    clearCache () {
      this._associationCache.clear()
      this._lastFetch = 0
    },

    async getAssociationInfoBySiret (siret: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<ApiResponseSubset>(
          `/api/association/siret/${siret}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )

        return response as ApiResponseSubset
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des informations'
        throw err
      } finally {
        this.loading = false
      }
    },
    async getAssociationInfo (associationId?: string) {
      await useUserStore().fetchUser()
      const user = useUserStore().getUser

      if (this.isCacheValid && this.association) {
        return this.association
      }

      this.loading = true
      this.error = null
      try {
        const response = await $fetch<AssociationInfo>(
          `/api/association/by-id/${user?.userId || associationId}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )

        if (response) {
          this.association = response
          this._updateCache(response)
        }

        return response as AssociationInfo
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des informations'
        throw err
      } finally {
        this.loading = false
      }
    },
    async registerAssociation (payload: CreateAssociationDto) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<AssociationInfo>(
          '/api/association/createAssociation',
          {
            method: 'POST',
            credentials: 'include',
            body: payload
          }
        )

        if (response) {
          this.association = response
          this._updateCache(response)
        }
        useAuthStore().resetCookies()
      } catch (err: any) {
        this.error = err?.message || "Erreur d'inscription"
        throw err
      } finally {
        this.loading = false
      }
    },

    async getNumberOfAssociations () {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<{ nbAssociation: number }>(
          '/api/association/nb-association',
          {
            method: 'GET',
            credentials: 'include'
          }
        )

        return response.nbAssociation
      } catch (err: any) {
        this.error =
          err?.message || "Erreur de récupération du nombre d'associations"
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateAssociation (
      payload: Partial<AssociationInfo>,
      id: string | null = null
    ) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<AssociationInfo>(
          `/api/association/update/${id || this.association?.associationId}`,
          {
            method: 'PATCH',
            credentials: 'include',
            body: payload
          }
        )

        if (response) {
          this.association = response
          this._updateCache(response)
        }

        return response as AssociationInfo
      } catch (err: any) {
        this.error = err?.message || 'Erreur de mise à jour des informations'
        throw err
      } finally {
        this.loading = false
      }
    },
    async addVolunteerToAssociation (
      associationId: string,
      payload: { volunteerId: string; volunteerName: string }
    ) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<AssociationInfo>(
          `/api/association/volunteer/add/${associationId}`,
          {
            method: 'PATCH',
            credentials: 'include',
            body: payload,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (response) {
          this.clearCache()
          await this.getAssociationInfo(associationId)
        }

        return response as AssociationInfo
      } catch (err: any) {
        this.error =
          err?.message || "Erreur d'ajout du bénévole à l'association"
        throw err
      } finally {
        this.loading = false
      }
    },
    async removeVolunteerFromAssociation (
      associationId: string,
      volunteerId: string
    ) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<AssociationInfo>(
          `/api/association/volunteer/remove/${associationId}/${volunteerId}`,
          {
            method: 'PATCH',
            credentials: 'include'
          }
        )

        if (response) {
          this.clearCache()
          await this.getAssociationInfo(associationId)
        }

        return response as AssociationInfo
      } catch (err: any) {
        this.error =
          err?.message || "Erreur de suppression du bénévole de l'association"
        throw err
      } finally {
        this.loading = false
      }
    },
    async removeAssociationVolunteerWaiting (
      associationId: string,
      volunteerId: string
    ) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<AssociationInfo>(
          `/api/association/volunteer-waiting/remove/${associationId}/${volunteerId}`,
          {
            method: 'PATCH',
            credentials: 'include'
          }
        )

        if (response) {
          this.clearCache()
          await this.getAssociationInfo(associationId)
        }

        return response as AssociationInfo
      } catch (err: any) {
        this.error =
          err?.message ||
          "Erreur de suppression du bénévole de l'attente de l'association"
        throw err
      } finally {
        this.loading = false
      }
    },
    async removeAssociation () {
      this.loading = true
      this.error = null
      try {
        await $fetch<{ message: string }>(
          `/api/association/delete/${this.association?.associationId}`,
          {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (this.association?.associationId) {
          this._associationCache.delete(this.association.associationId)
        }
        this.association = null
      } catch (err: any) {
        this.error = err?.message || 'Erreur de suppression du bénévole'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
