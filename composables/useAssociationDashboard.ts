import { useAssociationDashboardStore } from '~/stores/association-dashboard.store'
import type { AssociationStatsFilterDto } from '~/common/interface/dashboard.interface'

export const useAssociationDashboard = () => {
  const dashboardStore = useAssociationDashboardStore()

  return {
    // Actions principales
    fetchDashboard: dashboardStore.fetchDashboard,
    fetchAnnouncementStats: dashboardStore.fetchAnnouncementStats,
    fetchParticipantStats: dashboardStore.fetchParticipantStats,
    fetchVolunteerStats: dashboardStore.fetchVolunteerStats,
    fetchEngagementStats: dashboardStore.fetchEngagementStats,
    fetchTimeSeriesData: dashboardStore.fetchTimeSeriesData,
    fetchEventTypeStats: dashboardStore.fetchEventTypeStats,

    // Actions de gestion
    setCurrentFilter: dashboardStore.setCurrentFilter,
    setCurrentAssociationId: dashboardStore.setCurrentAssociationId,
    clearData: dashboardStore.clearData,
    invalidateCache: dashboardStore.invalidateCache,
    reset: dashboardStore.reset,

    // Getters réactifs pour le dashboard complet
    dashboardData: computed(() => dashboardStore.getDashboardData),
    loadingDashboard: computed(() => dashboardStore.getLoadingDashboard),

    // Getters réactifs pour les données individuelles
    announcementStats: computed(() => dashboardStore.getAnnouncementStats),
    participantStats: computed(() => dashboardStore.getParticipantStats),
    volunteerStats: computed(() => dashboardStore.getVolunteerStats),
    engagementStats: computed(() => dashboardStore.getEngagementStats),
    timeSeriesData: computed(() => dashboardStore.getTimeSeriesData),
    eventTypeStats: computed(() => dashboardStore.getEventTypeStats),

    // Getters réactifs pour l'état de chargement
    loading: computed(() => dashboardStore.getLoading),
    loadingAnnouncements: computed(() => dashboardStore.getLoadingAnnouncements),
    loadingParticipants: computed(() => dashboardStore.getLoadingParticipants),
    loadingVolunteers: computed(() => dashboardStore.getLoadingVolunteers),
    loadingEngagement: computed(() => dashboardStore.getLoadingEngagement),
    loadingTimeline: computed(() => dashboardStore.getLoadingTimeline),
    loadingEventTypes: computed(() => dashboardStore.getLoadingEventTypes),

    // Getters réactifs pour les erreurs et filtres
    error: computed(() => dashboardStore.getError),
    currentFilter: computed(() => dashboardStore.getCurrentFilter),
    currentAssociationId: computed(() => dashboardStore.getCurrentAssociationId),
    isCacheValid: computed(() => dashboardStore.isCacheValid),

    // Getters réactifs pour les données de graphiques
    timeSeriesChartData: computed(() => dashboardStore.getTimeSeriesChartData),
    pieChartData: computed(() => dashboardStore.getPieChartData),

    // Méthodes utilitaires
    /**
     * Récupère le dashboard complet avec gestion automatique des erreurs
     */
    async loadDashboard(associationId: string, filter: AssociationStatsFilterDto = {}) {
      try {
        return await dashboardStore.fetchDashboard(associationId, filter)
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error)
        throw error
      }
    },

    /**
     * Récupère toutes les données du dashboard en parallèle
     */
    async loadAllDashboardData(associationId: string, filter: AssociationStatsFilterDto = {}) {
      try {
        const [
          dashboardData,
          announcementStats,
          participantStats,
          volunteerStats,
          engagementStats,
          timeSeriesData,
          eventTypeStats
        ] = await Promise.all([
          dashboardStore.fetchDashboard(associationId, filter),
          dashboardStore.fetchAnnouncementStats(associationId, filter),
          dashboardStore.fetchParticipantStats(associationId, filter),
          dashboardStore.fetchVolunteerStats(associationId, filter),
          dashboardStore.fetchEngagementStats(associationId, filter),
          dashboardStore.fetchTimeSeriesData(associationId, filter),
          dashboardStore.fetchEventTypeStats(associationId, filter)
        ])

        return {
          dashboardData,
          announcementStats,
          participantStats,
          volunteerStats,
          engagementStats,
          timeSeriesData,
          eventTypeStats
        }
      } catch (error) {
        console.error('Erreur lors du chargement de toutes les données:', error)
        throw error
      }
    },

    /**
     * Vérifie si les données sont disponibles
     */
    hasData: computed(() => {
      return !!(
        dashboardStore.getDashboardData ||
        dashboardStore.getAnnouncementStats ||
        dashboardStore.getParticipantStats ||
        dashboardStore.getVolunteerStats ||
        dashboardStore.getEngagementStats ||
        dashboardStore.getTimeSeriesData.length > 0 ||
        dashboardStore.getEventTypeStats.length > 0
      )
    }),

    /**
     * Vérifie si au moins une requête est en cours
     */
    isLoadingAny: computed(() => {
      return (
        dashboardStore.getLoadingDashboard ||
        dashboardStore.getLoadingAnnouncements ||
        dashboardStore.getLoadingParticipants ||
        dashboardStore.getLoadingVolunteers ||
        dashboardStore.getLoadingEngagement ||
        dashboardStore.getLoadingTimeline ||
        dashboardStore.getLoadingEventTypes
      )
    }),

    /**
     * Récupère les métriques principales pour les cartes de statistiques
     */
    mainMetrics: computed(() => {
      const stats = dashboardStore.getAnnouncementStats
      const participantStats = dashboardStore.getParticipantStats
      const volunteerStats = dashboardStore.getVolunteerStats
      const engagementStats = dashboardStore.getEngagementStats

      return {
        totalAnnouncements: stats?.totalAnnouncements || 0,
        totalParticipants: participantStats?.totalUniqueParticipants || 0,
        totalVolunteers: volunteerStats?.totalUniqueVolunteers || 0,
        engagementRate: engagementStats?.overallEngagementRate || 0,
        completionRate: stats?.completionRate || 0,
        retentionRate: volunteerStats?.retentionRate || 0
      }
    }),

    /**
     * Récupère les données pour les graphiques de performance
     */
    performanceData: computed(() => {
      const stats = dashboardStore.getAnnouncementStats
      const engagementStats = dashboardStore.getEngagementStats

      return {
        completionRate: stats?.completionRate || 0,
        averageEventFillRate: engagementStats?.averageEventFillRate || 0,
        averageParticipantsPerEvent: stats?.averageParticipantsPerAnnouncement || 0,
        averageVolunteersPerEvent: stats?.averageVolunteersPerAnnouncement || 0
      }
    }),

    /**
     * Récupère les données pour les recommandations
     */
    recommendations: computed(() => {
      const stats = dashboardStore.getAnnouncementStats
      const participantStats = dashboardStore.getParticipantStats
      const volunteerStats = dashboardStore.getVolunteerStats
      const engagementStats = dashboardStore.getEngagementStats

      const recommendations = []

      // Recommandations basées sur le taux de completion
      if (stats?.completionRate && stats.completionRate < 70) {
        recommendations.push({
          type: 'completion',
          title: 'Améliorer le taux de completion',
          description: `Votre taux de completion est de ${stats.completionRate}%. Pensez à mieux planifier vos événements.`,
          priority: 'high'
        })
      }

      // Recommandations basées sur l'engagement
      if (engagementStats?.overallEngagementRate && engagementStats.overallEngagementRate < 50) {
        recommendations.push({
          type: 'engagement',
          title: "Augmenter l'engagement",
          description: `Votre taux d'engagement est de ${engagementStats.overallEngagementRate}. Publiez plus de contenu interactif.`,
          priority: 'medium'
        })
      }

      // Recommandations basées sur la rétention
      if (volunteerStats?.retentionRate && volunteerStats.retentionRate < 60) {
        recommendations.push({
          type: 'retention',
          title: 'Améliorer la rétention',
          description: `Votre taux de rétention est de ${volunteerStats.retentionRate}%. Créez des programmes de fidélisation.`,
          priority: 'medium'
        })
      }

      return recommendations
    })
  }
}
