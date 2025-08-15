// Interfaces pour le dashboard d'association

export interface AnnouncementStatsDto {
  totalAnnouncements: number
  activeAnnouncements: number
  completedAnnouncements: number
  cancelledAnnouncements: number
  completionRate: number
  averageParticipantsPerAnnouncement: number
  averageVolunteersPerAnnouncement: number
}

export interface ParticipantStatsDto {
  totalUniqueParticipants: number
  totalParticipations: number
  newParticipantsThisMonth: number
  retentionRate: number
  mostActiveParticipant: {
    id: string
    name: string
    participations: number
  }
}

export interface VolunteerStatsDto {
  totalUniqueVolunteers: number
  totalVolunteerParticipations: number
  newVolunteersThisMonth: number
  retentionRate: number
  mostActiveVolunteer: {
    id: string
    name: string
    participations: number
  }
  volunteersInWaitingList: number
}

export interface EngagementStatsDto {
  overallEngagementRate: number
  averageEventFillRate: number
  mostPopularEvent: {
    id: string
    name: string
    participants: number
    volunteers: number
  }
  bestFillRateEvent: {
    id: string
    name: string
    fillRate: number
  }
}

export interface TimeSeriesDataDto {
  date: string
  announcements: number
  participants: number
  volunteers: number
  engagementRate: number
}

export interface EventTypeStatsDto {
  eventType: string
  count: number
  completionRate: number
  averageParticipants: number
}

export interface AssociationDashboardResponseDto {
  announcementStats: AnnouncementStatsDto
  participantStats: ParticipantStatsDto
  volunteerStats: VolunteerStatsDto
  engagementStats: EngagementStatsDto
  timeSeriesData: TimeSeriesDataDto[]
  eventTypeStats: EventTypeStatsDto[]
  period: {
    startDate: string
    endDate: string
  }
}

export interface AssociationStatsFilterDto {
  startDate?: string
  endDate?: string
  eventType?: string
  status?: string
}

// Types pour les données de graphiques
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string
    borderWidth?: number
  }[]
}

export interface PieChartData {
  labels: string[]
  data: number[]
  colors: string[]
}

export interface TimeSeriesChartData {
  labels: string[]
  data: number[]
  label: string
  color: string
}
