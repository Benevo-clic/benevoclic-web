import { defineStore } from 'pinia'
import { $fetch } from 'ofetch'
import type {
  Announcement,
  CreateAnnouncementDto,
  InfoVolunteer
} from '~/common/interface/event.interface'
import type {
  FilterAnnouncement,
  FilterAnnouncementResponse,
  FilterAssociationAnnouncement
} from '~/common/interface/filter.interface'
import { useUserStore } from '~/stores/user/user.store'

export const useAnnouncementStore = defineStore('announcement', {
  state: () => ({
    announcements: [] as Announcement[],
    currentAnnouncement: null as Announcement | null,
    currentFilter: null as FilterAnnouncement | null,
    isCreateModalVisible: false,
    loading: false,
    error: null as string | null,
    _announcementsCache: new Map<string, Announcement>(),
    _lastFetch: 0,
    _cacheExpiry: 5 * 60 * 1000,
    lastFilter: null as FilterAnnouncement | null,
    cachedResponse: null as FilterAnnouncementResponse | null
  }),

  getters: {
    getAnnouncements: state => {
      return state.announcements
    },
    getCurrentAnnouncement: state => state.currentAnnouncement,
    getLoading: state => state.loading,
    getError: state => state.error,
    getAnnouncementById: state => (id: string) => {
      return state._announcementsCache.get(id) || state.announcements.find(a => a._id === id)
    },
    getCurrentFilter: state => state.currentFilter,
    isCacheValid: state => {
      return Date.now() - state._lastFetch < state._cacheExpiry
    }
  },

  actions: {
    _updateCache() {
      this._announcementsCache.clear()
      this.announcements.forEach(announcement => {
        if (announcement._id) {
          this._announcementsCache.set(announcement._id, announcement)
        }
      })
      this._lastFetch = Date.now()
    },
    setCurrentFilter(filter: Partial<FilterAnnouncement>) {
      this.currentFilter = filter
    },
    updateAnnouncements(announcements: Announcement[]) {
      this.announcements = announcements
      this._updateCache()
    },
    patchCurrentFilter(partial: Partial<FilterAnnouncement>) {
      if (!this.currentFilter) {
        this.currentFilter = { ...partial } as FilterAnnouncement
      } else {
        this.currentFilter = { ...this.currentFilter, ...partial }
      }
    },

    async fetchAnnouncements(id?: string) {
      if (this.isCacheValid && this.announcements.length > 0) {
        return this.announcements
      }

      this.loading = true
      this.error = null
      try {
        this.announcements = await $fetch<Announcement[]>(`/api/announcements/association/${id}`, {
          method: 'GET',
          credentials: 'include'
        })

        if (!this.announcements || this.announcements.length === 0) {
          this.error = 'Aucune annonce trouvée'
          if (process.dev) {
            console.log(`Aucune annonce trouvée pour associationId: ${id}`)
          }
        }
        this._updateCache()
        return this.announcements
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des annonces'
      } finally {
        this.loading = false
      }
    },

    async fetchAllAnnouncements() {
      // if (this.isCacheValid && this.announcements.length > 0) {
      //   return this.announcements;
      // }

      this.loading = true
      this.error = null
      try {
        this.announcements = await $fetch<Announcement[]>('/api/announcements/allAnnouncements', {
          method: 'GET',
          credentials: 'include'
        })
        if (!this.announcements || this.announcements.length === 0) {
          this.error = 'Aucune annonce trouvée'
        }

        this._updateCache()
        return this.announcements
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des annonces'
      } finally {
        this.loading = false
      }
    },

    async fetchAnnouncementById(id: string) {
      const cached = this._announcementsCache.get(id)

      if (cached && this.isCacheValid) {
        this.currentAnnouncement = cached
        return cached
      }

      this.loading = true
      this.error = null
      try {
        this.currentAnnouncement = await $fetch<Announcement>(`/api/announcements/${id}`, {
          method: 'GET',
          credentials: 'include'
        })

        if (this.currentAnnouncement?._id) {
          this._announcementsCache.set(this.currentAnnouncement._id, this.currentAnnouncement)
        }

        return this.currentAnnouncement
      } catch (err: any) {
        this.error = err?.message || "Erreur de récupération de l'annonce"
      } finally {
        this.loading = false
      }
    },

    async createAnnouncement(payload: CreateAnnouncementDto) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('/api/announcements/createAnnouncement', {
          method: 'POST',
          credentials: 'include',
          body: payload
        })
        if (!response) {
          throw new Error("Erreur lors de la création de l'annonce")
        }

        await this.fetchAnnouncementById(response)

        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || "Erreur de création de l'annonce"
        throw err
      } finally {
        this.loading = false
      }
    },

    async uploadImageCover(file: File) {
      this.loading = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await $fetch(
          `/api/announcements/coverAnnouncement/${this.currentAnnouncement?._id}`,
          {
            method: 'PATCH',
            credentials: 'include',
            body: formData
          }
        )

        if (!response) {
          this.error = "Erreur lors de l'upload de l'image"
          throw new Error(this.error)
        }

        if (this.currentAnnouncement) {
          await this.fetchAnnouncementById(this.currentAnnouncement._id)
        }

        this._lastFetch = 0
      } catch (error: any) {
        this.error = error?.message || "Erreur lors de l'upload de l'image"
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateAnnouncement(id: string, payload: Partial<Announcement>) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<Announcement>(`/api/announcements/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          body: payload
        })

        const index = this.announcements.findIndex(a => a._id === id)
        if (index !== -1) {
          this.announcements[index] = { ...response, _id: id }
        }

        if (this.currentAnnouncement?._id === id) {
          this.currentAnnouncement = { ...response, _id: id }
        }

        this._announcementsCache.set(id, { ...response, _id: id })

        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || "Erreur de mise à jour de l'annonce"
        throw err
      } finally {
        this.loading = false
      }
    },

    async removeAnnouncement(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch(`/api/announcements/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        this.announcements = this.announcements.filter(a => a._id !== id)
        if (this.currentAnnouncement?._id === id) {
          this.currentAnnouncement = null
        }

        this._announcementsCache.delete(id)

        return response
      } catch (err: any) {
        this.error = err?.message || "Erreur de suppression de l'annonce"
        throw err
      } finally {
        this.loading = false
      }
    },

    setCurrentAnnouncement(announcement: Announcement | null) {
      this.currentAnnouncement = announcement
    },

    clearCache() {
      this._announcementsCache.clear()
      this._lastFetch = 0
    },

    invalidateCache() {
      this._lastFetch = 0
    },

    async addParticipant(id: string, participant: { id: string; name: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch(`/api/announcements/participant/register/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          body: {
            ...participant
          }
        })

        if (this.currentAnnouncement?._id === id) {
          await this.fetchAnnouncementById(id)
        }
        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || "Erreur d'enregistrement du participant"
        throw err
      } finally {
        this.loading = false
      }
    },
    async addVolunteerWaiting(id: string, volunteer: { id: string; name: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch(`/api/announcements/volunteerWaiting/register/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          body: {
            ...volunteer
          }
        })

        if (this.currentAnnouncement?._id === id) {
          await this.fetchAnnouncementById(id)
        }

        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || "Erreur d'enregistrement du volontaire en attente"
        throw err
      } finally {
        this.loading = false
      }
    },
    async addVolunteer(id: string, volunteer: { id: string; name: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch(`/api/announcements/volunteer/register/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          body: {
            ...volunteer
          }
        })

        if (this.currentAnnouncement?._id === id) {
          await this.fetchAnnouncementById(id)
        }

        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || "Erreur d'enregistrement du volontaire"
        throw err
      } finally {
        this.loading = false
      }
    },

    async removeParticipant(announcementId: string, participant: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch(
          `/api/announcements/participant/unregister/${participant}/${announcementId}`,
          {
            method: 'PATCH',
            credentials: 'include'
          }
        )

        if (this.currentAnnouncement?._id === announcementId) {
          await this.fetchAnnouncementById(announcementId)
        }

        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || 'Erreur de suppression du participant'
        throw err
      } finally {
        this.loading = false
      }
    },
    async removeVolunteer(announcementId: string, volunteer: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch(
          `/api/announcements/volunteer/unregister/${volunteer}/${announcementId}`,
          {
            method: 'PATCH',
            credentials: 'include'
          }
        )

        if (this.currentAnnouncement?._id === announcementId) {
          await this.fetchAnnouncementById(announcementId)
        }

        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || 'Erreur de suppression du volontaire'
        throw err
      } finally {
        this.loading = false
      }
    },
    async removeVolunteerWaiting(announcementId: string, volunteer: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch(
          `/api/announcements/volunteerWaiting/unregister/${volunteer}/${announcementId}`,
          {
            method: 'PATCH',
            credentials: 'include'
          }
        )

        if (this.currentAnnouncement?._id === announcementId) {
          await this.fetchAnnouncementById(announcementId)
        }

        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || 'Erreur de suppression du volontaire en attente'
        throw err
      } finally {
        this.loading = false
      }
    },
    async updateStatus(announcementId: string, status: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch(`/api/announcements/updateStatus/${announcementId}`, {
          method: 'PATCH',
          credentials: 'include',
          body: { status }
        })

        if (this.currentAnnouncement?._id === announcementId) {
          await this.fetchAnnouncementById(announcementId)
        }

        this._lastFetch = 0
        this.validateFilterResponse(response)
        this.updateAnnouncements(response?.annonces || [])

        return response
      } catch (err: any) {
        this.error = err?.message || "Erreur de mise à jour du statut de l'annonce"
        throw err
      } finally {
        this.loading = false
      }
    },

    async filterAssociationAnnouncements(
      filter: FilterAssociationAnnouncement
    ): Promise<FilterAnnouncementResponse | undefined> {
      const url = '/api/announcements/filter/association'
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<FilterAnnouncementResponse>(url, {
          method: 'POST',
          credentials: 'include',
          body: filter
        })

        this.validateFilterResponse(response)
        this.updateAnnouncements(response?.annonces || [])
        return response
      } catch (err: any) {
        this.error = err?.message || 'Erreur de filtrage des annonces'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updatePresenceParticipant(id: string, participant: InfoVolunteer) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<Announcement>(
          `/api/announcements/participant/presence/${id}`,
          {
            method: 'PATCH',
            credentials: 'include',
            body: participant
          }
        )

        if (this.currentAnnouncement?._id === id) {
          await this.fetchAnnouncementById(id)
        }

        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || 'Erreur de mise à jour du participant présent'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updatePresenceVolunteer(id: string, volunteer: InfoVolunteer) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<Announcement>(`/api/announcements/volunteer/presence/${id}`, {
          method: 'PATCH',
          credentials: 'include',
          body: volunteer
        })

        if (this.currentAnnouncement?._id === id) {
          await this.fetchAnnouncementById(id)
        }

        this._lastFetch = 0

        return response
      } catch (err: any) {
        this.error = err?.message || 'Erreur de mise à jour du volontaire présent'
        throw err
      } finally {
        this.loading = false
      }
    },

    async filterAnnouncement(
      filterAnnouncement: FilterAnnouncement
    ): Promise<FilterAnnouncementResponse | undefined> {
      const user = useUserStore().getUser
      if (user?.role === 'ASSOCIATION' && user) {
        return {
          annonces: [],
          meta: {
            total: 0,
            page: 1,
            limit: 9,
            pages: 1
          }
        }
      }

      if (
        this.lastFilter &&
        this.cachedResponse &&
        this.isSameFilter(this.lastFilter, filterAnnouncement)
      ) {
        this.updateAnnouncements(this.cachedResponse.annonces)
        return this.cachedResponse
      }

      this.loading = true
      this.error = null
      this.lastFilter = { ...filterAnnouncement }

      try {
        const response = await $fetch<FilterAnnouncementResponse>(
          '/api/announcements/filter/announcements',
          {
            method: 'POST',
            credentials: 'include',
            body: filterAnnouncement
          }
        )

        this.validateFilterResponse(response)

        this.cachedResponse = response
        this.lastFilter = { ...filterAnnouncement }

        this.updateAnnouncements(response.annonces)
        return response
      } catch (err: any) {
        this.error = err?.message || 'Erreur de filtrage des annonces'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Méthode pour comparer deux filtres
    isSameFilter(filter1: FilterAnnouncement, filter2: FilterAnnouncement): boolean {
      // Normalise les objets avant comparaison
      const normalizeFilter = (filter: FilterAnnouncement) => {
        const normalized = { ...filter }
        if (normalized.tags) {
          normalized.tags = [...normalized.tags].sort()
        }
        return normalized
      }

      return JSON.stringify(normalizeFilter(filter1)) === JSON.stringify(normalizeFilter(filter2))
    },

    // Méthode pour vider le cache (optionnel)
    clearFilterCache(): void {
      this.lastFilter = null
      this.cachedResponse = null
    },
    validateFilterResponse(response: FilterAnnouncementResponse | undefined): void {
      if (!response || response.annonces.length === 0) {
        this.error = 'Aucune annonce trouvée pour les critères spécifiés'
      }
    }
  }
})
