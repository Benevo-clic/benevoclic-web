import { defineStore } from 'pinia'
import { $fetch } from 'ofetch'
import type {
  AssociationDashboardResponseDto,
  AssociationStatsFilterDto,
  AnnouncementStatsDto,
  ParticipantStatsDto,
  VolunteerStatsDto,
  EngagementStatsDto,
  TimeSeriesDataDto,
  EventTypeStatsDto
} from '~/common/interface/dashboard.interface'

export const useAssociationDashboardStore = defineStore('associationDashboard', {
  state: () => ({
    dashboardData: null as AssociationDashboardResponseDto | null,

    announcementStats: null as AnnouncementStatsDto | null,
    participantStats: null as ParticipantStatsDto | null,
    volunteerStats: null as VolunteerStatsDto | null,
    engagementStats: null as EngagementStatsDto | null,
    timeSeriesData: [] as TimeSeriesDataDto[],
    eventTypeStats: [] as EventTypeStatsDto[],

    loading: false,
    loadingDashboard: false,
    loadingAnnouncements: false,
    loadingParticipants: false,
    loadingVolunteers: false,
    loadingEngagement: false,
    loadingTimeline: false,
    loadingEventTypes: false,

    error: null as string | null,

    currentAssociationId: null as string | null,
    currentFilter: null as AssociationStatsFilterDto | null,
    _lastFetch: 0,
    _cacheExpiry: 5 * 60 * 1000 // 5 minutes
  }),

  getters: {
    getDashboardData: state => state.dashboardData,
    getLoadingDashboard: state => state.loadingDashboard,

    getAnnouncementStats: state => state.announcementStats,
    getParticipantStats: state => state.participantStats,
    getVolunteerStats: state => state.volunteerStats,
    getEngagementStats: state => state.engagementStats,
    getTimeSeriesData: state => state.timeSeriesData,
    getEventTypeStats: state => state.eventTypeStats,

    getLoading: state => state.loading,
    getLoadingAnnouncements: state => state.loadingAnnouncements,
    getLoadingParticipants: state => state.loadingParticipants,
    getLoadingVolunteers: state => state.loadingVolunteers,
    getLoadingEngagement: state => state.loadingEngagement,
    getLoadingTimeline: state => state.loadingTimeline,
    getLoadingEventTypes: state => state.loadingEventTypes,

    getError: state => state.error,

    getCurrentFilter: state => state.currentFilter,
    getCurrentAssociationId: state => state.currentAssociationId,

    isCacheValid: state => {
      return Date.now() - state._lastFetch < state._cacheExpiry
    },

    getTimeSeriesChartData: state => {
      if (!state.timeSeriesData.length) return null

      return {
        labels: state.timeSeriesData.map(item => item.date),
        datasets: [
          {
            label: 'Annonces',
            data: state.timeSeriesData.map(item => item.announcements),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 2
          },
          {
            label: 'Participants',
            data: state.timeSeriesData.map(item => item.participants),
            borderColor: '#f59e42',
            backgroundColor: 'rgba(245, 158, 66, 0.1)',
            borderWidth: 2
          },
          {
            label: 'Bénévoles',
            data: state.timeSeriesData.map(item => item.volunteers),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2
          }
        ]
      }
    },

    getPieChartData: state => {
      if (!state.eventTypeStats.length) return null

      return {
        labels: state.eventTypeStats.map(item => item.eventType),
        data: state.eventTypeStats.map(item => item.count),
        colors: [
          '#2563eb',
          '#f59e42',
          '#10b981',
          '#ef4444',
          '#8b5cf6',
          '#06b6d4',
          '#84cc16',
          '#f97316',
          '#ec4899',
          '#6366f1'
        ]
      }
    }
  },

  actions: {
    // Mise à jour du cache
    _updateCache() {
      this._lastFetch = Date.now()
    },

    // Réinitialisation des données
    clearData() {
      this.dashboardData = null
      this.announcementStats = null
      this.participantStats = null
      this.volunteerStats = null
      this.engagementStats = null
      this.timeSeriesData = []
      this.eventTypeStats = []
      this.error = null
    },

    // Définition du filtre actuel
    setCurrentFilter(filter: AssociationStatsFilterDto) {
      this.currentFilter = filter
    },

    // Définition de l'ID d'association actuel
    setCurrentAssociationId(associationId: string) {
      this.currentAssociationId = associationId
    },

    // Récupération du dashboard complet
    async fetchDashboard(associationId: string, filter: AssociationStatsFilterDto = {}) {
      this.loadingDashboard = true
      this.error = null
      this.setCurrentAssociationId(associationId)
      this.setCurrentFilter(filter)

      try {
        const queryParams = new URLSearchParams()

        if (filter.startDate) queryParams.append('startDate', filter.startDate)
        if (filter.endDate) queryParams.append('endDate', filter.endDate)
        if (filter.eventType) queryParams.append('eventType', filter.eventType)
        if (filter.status) queryParams.append('status', filter.status)

        const url = `/api/association-dashboard/${associationId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        this.dashboardData = await $fetch<AssociationDashboardResponseDto>(url, {
          method: 'GET',
          credentials: 'include'
        })

        // Mettre à jour les données individuelles
        this.announcementStats = this.dashboardData.announcementStats
        this.participantStats = this.dashboardData.participantStats
        this.volunteerStats = this.dashboardData.volunteerStats
        this.engagementStats = this.dashboardData.engagementStats
        this.timeSeriesData = this.dashboardData.timeSeriesData
        this.eventTypeStats = this.dashboardData.eventTypeStats

        this._updateCache()
        return this.dashboardData
      } catch (err: any) {
        this.error = err?.message || 'Erreur lors de la récupération du dashboard'
        throw err
      } finally {
        this.loadingDashboard = false
      }
    },

    // Récupération des statistiques des annonces
    async fetchAnnouncementStats(associationId: string, filter: AssociationStatsFilterDto = {}) {
      this.loadingAnnouncements = true
      this.error = null

      try {
        const queryParams = new URLSearchParams()

        if (filter.startDate) queryParams.append('startDate', filter.startDate)
        if (filter.endDate) queryParams.append('endDate', filter.endDate)
        if (filter.eventType) queryParams.append('eventType', filter.eventType)
        if (filter.status) queryParams.append('status', filter.status)

        const url = `/api/association-dashboard/${associationId}/announcements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        this.announcementStats = await $fetch<AnnouncementStatsDto>(url, {
          method: 'GET',
          credentials: 'include'
        })

        this._updateCache()
        return this.announcementStats
      } catch (err: any) {
        this.error = err?.message || "Erreur lors de la récupération des statistiques d'annonces"
        throw err
      } finally {
        this.loadingAnnouncements = false
      }
    },

    // Récupération des statistiques des participants
    async fetchParticipantStats(associationId: string, filter: AssociationStatsFilterDto = {}) {
      this.loadingParticipants = true
      this.error = null

      try {
        const queryParams = new URLSearchParams()

        if (filter.startDate) queryParams.append('startDate', filter.startDate)
        if (filter.endDate) queryParams.append('endDate', filter.endDate)
        if (filter.eventType) queryParams.append('eventType', filter.eventType)
        if (filter.status) queryParams.append('status', filter.status)

        const url = `/api/association-dashboard/${associationId}/participants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        this.participantStats = await $fetch<ParticipantStatsDto>(url, {
          method: 'GET',
          credentials: 'include'
        })

        this._updateCache()
        return this.participantStats
      } catch (err: any) {
        this.error =
          err?.message || 'Erreur lors de la récupération des statistiques de participants'
        throw err
      } finally {
        this.loadingParticipants = false
      }
    },

    // Récupération des statistiques des bénévoles
    async fetchVolunteerStats(associationId: string, filter: AssociationStatsFilterDto = {}) {
      this.loadingVolunteers = true
      this.error = null

      try {
        const queryParams = new URLSearchParams()

        if (filter.startDate) queryParams.append('startDate', filter.startDate)
        if (filter.endDate) queryParams.append('endDate', filter.endDate)
        if (filter.eventType) queryParams.append('eventType', filter.eventType)
        if (filter.status) queryParams.append('status', filter.status)

        const url = `/api/association-dashboard/${associationId}/volunteers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        this.volunteerStats = await $fetch<VolunteerStatsDto>(url, {
          method: 'GET',
          credentials: 'include'
        })

        this._updateCache()
        return this.volunteerStats
      } catch (err: any) {
        this.error = err?.message || 'Erreur lors de la récupération des statistiques de bénévoles'
        throw err
      } finally {
        this.loadingVolunteers = false
      }
    },

    // Récupération des statistiques d'engagement
    async fetchEngagementStats(associationId: string, filter: AssociationStatsFilterDto = {}) {
      this.loadingEngagement = true
      this.error = null

      try {
        const queryParams = new URLSearchParams()

        if (filter.startDate) queryParams.append('startDate', filter.startDate)
        if (filter.endDate) queryParams.append('endDate', filter.endDate)
        if (filter.eventType) queryParams.append('eventType', filter.eventType)
        if (filter.status) queryParams.append('status', filter.status)

        const url = `/api/association-dashboard/${associationId}/engagement${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        this.engagementStats = await $fetch<EngagementStatsDto>(url, {
          method: 'GET',
          credentials: 'include'
        })

        this._updateCache()
        return this.engagementStats
      } catch (err: any) {
        this.error = err?.message || "Erreur lors de la récupération des statistiques d'engagement"
        throw err
      } finally {
        this.loadingEngagement = false
      }
    },

    // Récupération des données temporelles
    async fetchTimeSeriesData(associationId: string, filter: AssociationStatsFilterDto = {}) {
      this.loadingTimeline = true
      this.error = null

      try {
        const queryParams = new URLSearchParams()

        if (filter.startDate) queryParams.append('startDate', filter.startDate)
        if (filter.endDate) queryParams.append('endDate', filter.endDate)
        if (filter.eventType) queryParams.append('eventType', filter.eventType)
        if (filter.status) queryParams.append('status', filter.status)

        const url = `/api/association-dashboard/${associationId}/timeline${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        this.timeSeriesData = await $fetch<TimeSeriesDataDto[]>(url, {
          method: 'GET',
          credentials: 'include'
        })

        this._updateCache()
        return this.timeSeriesData
      } catch (err: any) {
        this.error = err?.message || 'Erreur lors de la récupération des données temporelles'
        throw err
      } finally {
        this.loadingTimeline = false
      }
    },

    // Récupération des statistiques par type d'événement
    async fetchEventTypeStats(associationId: string, filter: AssociationStatsFilterDto = {}) {
      this.loadingEventTypes = true
      this.error = null

      try {
        const queryParams = new URLSearchParams()

        if (filter.startDate) queryParams.append('startDate', filter.startDate)
        if (filter.endDate) queryParams.append('endDate', filter.endDate)
        if (filter.eventType) queryParams.append('eventType', filter.eventType)
        if (filter.status) queryParams.append('status', filter.status)

        const url = `/api/association-dashboard/${associationId}/event-types${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        this.eventTypeStats = await $fetch<EventTypeStatsDto[]>(url, {
          method: 'GET',
          credentials: 'include'
        })

        this._updateCache()
        return this.eventTypeStats
      } catch (err: any) {
        this.error =
          err?.message || "Erreur lors de la récupération des statistiques par type d'événement"
        throw err
      } finally {
        this.loadingEventTypes = false
      }
    },

    // Réinitialisation du cache
    invalidateCache() {
      this._lastFetch = 0
    },

    // Nettoyage complet
    reset() {
      this.clearData()
      this.invalidateCache()
      this.currentAssociationId = null
      this.currentFilter = null
    }
  }
})
