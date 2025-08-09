import { defineStore } from 'pinia'
import type {
  Announcement,
  FavoritesAnnouncement
} from '~/common/interface/event.interface'

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface Cache {
  [key: string]: CacheItem<any>;
}

export const useFavoriteAnnouncement = defineStore('favoriteAnnouncement', {
  state: () => ({
    favorites: [] as FavoritesAnnouncement[],
    favoritesAnnouncementsVolunteer: [] as Announcement[],
    favoriteVolunteers: [] as Announcement[],
    loading: false,
    error: null as string | null,
    cache: {} as Cache,
    cacheTTL: 5 * 60 * 1000 // 5 minutes par défaut
  }),

  getters: {
    getFavorites: state => state.favorites,
    getFavoritesAnnouncementsVolunteer: state =>
      state.favoritesAnnouncementsVolunteer,
    getFavoriteVolunteers: state => state.favoriteVolunteers,
    isLoading: state => state.loading,
    getError: state => state.error,

    // Cache getters
    getCache: state => state.cache,
    isCacheValid: state => (key: string) => {
      const item = state.cache[key]
      if (!item) {
        return false
      }
      return Date.now() - item.timestamp < item.ttl
    }
  },

  actions: {
    // Cache management
    setCache<T> (key: string, data: T, ttl?: number): void {
      this.cache[key] = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.cacheTTL
      }
    },

    getCacheState<T> (key: string): T | null {
      if (this.isCacheValid(key)) {
        return this.cache[key].data as T
      }
      // Remove expired cache
      delete this.cache[key]
      return null
    },

    clearCache (pattern?: string): void {
      if (pattern) {
        Object.keys(this.cache).forEach((key) => {
          if (key.includes(pattern)) {
            delete this.cache[key]
          }
        })
      } else {
        this.cache = {}
      }
    },

    invalidateCache (pattern?: string): void {
      this.clearCache(pattern)
    },

    // API calls with cache
    async fetchFavorites (volunteerId: string, announcementId: string) {
      const cacheKey = `favorites_${volunteerId}_${announcementId}`
      const cached = this.getCacheState<FavoritesAnnouncement[]>(cacheKey)

      if (cached) {
        this.favorites = cached
        return this.favorites
      }

      this.loading = true
      this.error = null
      try {
        this.favorites = await $fetch<FavoritesAnnouncement[]>(
          `/api/favorites-announcement/volunteer/${volunteerId}/announcement/${announcementId}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )

        if (!this.favorites || this.favorites.length === 0) {
          this.error = 'Aucun favori trouvé'
        } else {
          this.setCache(cacheKey, this.favorites)
        }

        return this.favorites
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des favoris'
        throw err
      } finally {
        this.loading = false
      }
    },
    async findAllFavoritesAnnouncementsByVolunteerId (volunteerId: string) {
      this.loading = true
      this.error = null
      try {
        this.favoriteVolunteers = await $fetch<Announcement[]>(
          `/api/favorites-announcement/volunteer/announcements/${volunteerId}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )

        if (!this.favoriteVolunteers || this.favoriteVolunteers.length === 0) {
          this.error = 'Aucun favori trouvé'
        }

        return this.favoriteVolunteers
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des favoris'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchAllFavoritesOfVolunteer (volunteerId: string) {
      this.loading = true
      this.error = null
      try {
        this.favorites = await $fetch<FavoritesAnnouncement[]>(
          `/api/favorites-announcement/volunteer/${volunteerId}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )

        if (!this.favorites || this.favorites.length === 0) {
          this.error = 'Aucun favori trouvé'
        }

        return this.favorites
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des favoris'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchFavoriteVolunteerByVolunteerId (volunteerId: string) {
      const cacheKey = `favorites_announcements_volunteer_${volunteerId}`
      const cached = this.getCacheState<Announcement[]>(cacheKey)

      if (cached) {
        this.favoritesAnnouncementsVolunteer = cached
        return this.favoritesAnnouncementsVolunteer
      }

      this.loading = true
      this.error = null
      try {
        this.favoritesAnnouncementsVolunteer = await $fetch<Announcement[]>(
          `/api/favorites-announcement/volunteer/${volunteerId}/favorites`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )

        if (
          !this.favoritesAnnouncementsVolunteer ||
          this.favoritesAnnouncementsVolunteer.length === 0
        ) {
          this.error = 'Aucun favori trouvé'
        } else {
          this.setCache(cacheKey, this.favoritesAnnouncementsVolunteer)
        }

        return this.favoritesAnnouncementsVolunteer
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération du favori'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchAllFavorites () {
      const cacheKey = 'favorites_all'
      const cached = this.getCacheState<FavoritesAnnouncement[]>(cacheKey)

      if (cached) {
        this.favorites = cached
        return this.favorites
      }

      this.loading = true
      this.error = null
      try {
        this.favorites = await $fetch<FavoritesAnnouncement[]>(
          '/api/favorites-announcement/all',
          {
            method: 'GET',
            credentials: 'include'
          }
        )

        if (!this.favorites || this.favorites.length === 0) {
          this.error = 'Aucun favori trouvé'
        } else {
          this.setCache(cacheKey, this.favorites)
        }

        return this.favorites
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des favoris'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchFavoritesByAnnouncementId (announcementId: string) {
      const cacheKey = `favorites_announcement_${announcementId}`
      const cached = this.getCacheState<FavoritesAnnouncement[]>(cacheKey)

      if (cached) {
        this.favorites = cached
        return this.favorites
      }

      this.loading = true
      this.error = null
      try {
        this.favorites = await $fetch<FavoritesAnnouncement[]>(
          `/api/favorites-announcement/announcement/${announcementId}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        )

        if (!this.favorites || this.favorites.length === 0) {
          this.error = 'Aucun favori trouvé'
        } else {
          this.setCache(cacheKey, this.favorites)
        }

        return this.favorites
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des favoris'
        throw err
      } finally {
        this.loading = false
      }
    },

    async addFavorite (announcementId: string, volunteerId: string) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<FavoritesAnnouncement>(
          '/api/favorites-announcement',
          {
            method: 'POST',
            credentials: 'include',
            body: { announcementId, volunteerId }
          }
        )

        this.favorites.push(response)

        this.invalidateCache('favorites_')
        this.invalidateCache(`volunteer_${volunteerId}`)
        this.invalidateCache(`announcement_${announcementId}`)

        return response
      } catch (err: any) {
        this.error = err?.message || "Erreur d'ajout au favoris"
        throw err
      } finally {
        this.loading = false
      }
    },

    async removeByVolunteerIdAndAnnouncementId (
      volunteerId: string,
      announcementId: string
    ) {
      this.loading = true
      this.error = null
      try {
        await $fetch(
          `/api/favorites-announcement/volunteer/${volunteerId}/announcement/${announcementId}`,
          {
            method: 'DELETE',
            credentials: 'include'
          }
        )

        this.favorites = this.favorites.filter(
          fav =>
            fav.volunteerId !== volunteerId ||
            fav.announcementId !== announcementId
        )
        this.favoriteVolunteers = this.favoriteVolunteers.filter(
          fav => fav._id !== announcementId
        )

        this.invalidateCache('favorites_')
        this.invalidateCache(`volunteer_${volunteerId}`)
        this.invalidateCache(`announcement_${announcementId}`)
      } catch (err: any) {
        this.error = err?.message || 'Erreur de suppression du favori'
        throw err
      } finally {
        this.loading = false
      }
    },

    async removeAllByVolunteerId (volunteerId: string) {
      this.loading = true
      this.error = null
      try {
        await $fetch(`/api/favorites-announcement/volunteer/${volunteerId}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        // Remove from local state
        this.favorites = this.favorites.filter(
          fav => fav.volunteerId !== volunteerId
        )

        // Invalidate related caches
        this.invalidateCache('favorites_')
        this.invalidateCache(`volunteer_${volunteerId}`)
      } catch (err: any) {
        this.error =
          err?.message || 'Erreur de suppression des favoris du volontaire'
        throw err
      } finally {
        this.loading = false
      }
    },

    async removeAllByAnnouncementId (announcementId: string) {
      this.loading = true
      this.error = null
      try {
        await $fetch(
          `/api/favorites-announcement/announcement/${announcementId}`,
          {
            method: 'DELETE',
            credentials: 'include'
          }
        )

        // Remove from local state
        this.favorites = this.favorites.filter(
          fav => fav.announcementId !== announcementId
        )

        this.invalidateCache('favorites_')
        this.invalidateCache(`announcement_${announcementId}`)
      } catch (err: any) {
        this.error =
          err?.message || "Erreur de suppression des favoris de l'annonce"
        throw err
      } finally {
        this.loading = false
      }
    },

    // Utility methods
    clearError (): void {
      this.error = null
    },

    resetState (): void {
      this.favorites = []
      this.favoritesAnnouncementsVolunteer = []
      this.error = null
      this.clearCache()
    }
  }
})
