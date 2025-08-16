import { useAssociationDashboardStore } from '~/stores/association-dashboard.store'
import type { AssociationStatsFilterDto } from '~/common/interface/dashboard.interface'

export const useAssociationDashboard = () => {
  const dashboardStore = useAssociationDashboardStore()

  return {
    fetchDashboard: dashboardStore.fetchDashboard,
    fetchAnnouncementStats: dashboardStore.fetchAnnouncementStats,
    fetchParticipantStats: dashboardStore.fetchParticipantStats,
    fetchVolunteerStats: dashboardStore.fetchVolunteerStats,
    fetchEngagementStats: dashboardStore.fetchEngagementStats,
    fetchTimeSeriesData: dashboardStore.fetchTimeSeriesData,
    fetchEventTypeStats: dashboardStore.fetchEventTypeStats,

    setCurrentFilter: dashboardStore.setCurrentFilter,
    setCurrentAssociationId: dashboardStore.setCurrentAssociationId,
    clearData: dashboardStore.clearData,
    invalidateCache: dashboardStore.invalidateCache,
    reset: dashboardStore.reset,

    dashboardData: computed(() => dashboardStore.getDashboardData),
    loadingDashboard: computed(() => dashboardStore.getLoadingDashboard),

    announcementStats: computed(() => dashboardStore.getAnnouncementStats),
    participantStats: computed(() => dashboardStore.getParticipantStats),
    volunteerStats: computed(() => dashboardStore.getVolunteerStats),
    engagementStats: computed(() => dashboardStore.getEngagementStats),
    timeSeriesData: computed(() => dashboardStore.getTimeSeriesData),
    eventTypeStats: computed(() => dashboardStore.getEventTypeStats),

    loading: computed(() => dashboardStore.getLoading),
    loadingAnnouncements: computed(() => dashboardStore.getLoadingAnnouncements),
    loadingParticipants: computed(() => dashboardStore.getLoadingParticipants),
    loadingVolunteers: computed(() => dashboardStore.getLoadingVolunteers),
    loadingEngagement: computed(() => dashboardStore.getLoadingEngagement),
    loadingTimeline: computed(() => dashboardStore.getLoadingTimeline),
    loadingEventTypes: computed(() => dashboardStore.getLoadingEventTypes),

    error: computed(() => dashboardStore.getError),
    currentFilter: computed(() => dashboardStore.getCurrentFilter),
    currentAssociationId: computed(() => dashboardStore.getCurrentAssociationId),
    isCacheValid: computed(() => dashboardStore.isCacheValid),

    timeSeriesChartData: computed(() => dashboardStore.getTimeSeriesChartData),
    pieChartData: computed(() => dashboardStore.getPieChartData),

    async loadDashboard(associationId: string, filter: AssociationStatsFilterDto = {}) {
      try {
        return await dashboardStore.fetchDashboard(associationId, filter)
      } catch (error) {
        process.env.NODE_ENV !== 'production' &&
          console.error('Erreur lors du chargement du dashboard:', error)
        throw error
      }
    },

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
        process.env.NODE_ENV !== 'production' &&
          console.error('Erreur lors du chargement de toutes les données:', error)
        throw error
      }
    },

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

    recommendations: computed(() => {
      const stats = dashboardStore.getAnnouncementStats
      const participantStats = dashboardStore.getParticipantStats
      const volunteerStats = dashboardStore.getVolunteerStats
      const engagementStats = dashboardStore.getEngagementStats

      const recommendations = []

      if (stats?.completionRate && stats.completionRate < 70) {
        recommendations.push({
          type: 'completion',
          title: 'Améliorer le taux de completion',
          description: `Votre taux de completion est de ${stats.completionRate}%. Pensez à mieux planifier vos événements.`,
          priority: 'high'
        })
      }

      if (engagementStats?.overallEngagementRate && engagementStats.overallEngagementRate < 50) {
        recommendations.push({
          type: 'engagement',
          title: "Augmenter l'engagement",
          description: `Votre taux d'engagement est de ${engagementStats.overallEngagementRate}. Publiez plus de contenu interactif.`,
          priority: 'medium'
        })
      }

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
