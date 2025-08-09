import { defineStore } from 'pinia'
import { useRequestFetch } from '#app'

export interface SupportReport {
  _id: string
  type: 'ANNOUNCEMENT' | 'TECHNICAL' | 'USER_FEEDBACK' | 'OTHER'
  category?: string
  description?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt?: string
  userEmail?: string
  pageUrl?: string
  browserInfo?: string
}

interface Stats {
  totalReports?: number
  pendingReports?: number
  resolvedReports?: number
}

interface AdminState {
  reports: SupportReport[]
  selectedReport: SupportReport | null
  stats: Stats | null
  loading: boolean
  error: string | null
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    reports: [],
    selectedReport: null,
    stats: null,
    loading: false,
    error: null
  }),
  getters: {
    filteredByStatus: state => (status?: SupportReport['status']) =>
      status ? state.reports.filter(r => r.status === status) : state.reports,
    getReports: state => state.reports,
    getSelectedReport: state => state.selectedReport,
    getStats: state => state.stats,
    isLoading: state => state.loading,
    getError: state => state.error
  },
  actions: {
    async fetchReports () {
      this.loading = true
      this.error = null
      try {
        const $fetch = useRequestFetch()
        const data = await $fetch<SupportReport[]>('/api/support/reports', {
          method: 'GET',
          credentials: 'include'
        })
        this.reports = data
      } catch (e: any) {
        this.error = e?.message || 'Erreur lors du chargement des tickets'
        throw e
      } finally {
        this.loading = false
      }
    },
    async fetchReportById (id: string): Promise<SupportReport> {
      const $fetch = useRequestFetch()
      const report = await $fetch<SupportReport>(`/api/support/reports/${id}`, {
        method: 'GET',
        credentials: 'include'
      })
      return report
    },
    async updateReportStatus (id: string, status: SupportReport['status']) {
      const $fetch = useRequestFetch()
      await $fetch(`/api/support/reports/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: { status }
      })
      const report = this.reports.find(r => r._id === id)
      if (report) {
        report.status = status
      }
    },

    async supportStats (): Promise<Stats> {
      const $fetch = useRequestFetch()
      try {
        const stats = await $fetch<Stats>('/api/support/stats', {
          method: 'GET',
          credentials: 'include'
        })
        this.stats = stats
        return stats
      } catch (e: any) {
        this.error = e?.message || 'Erreur lors de la récupération des statistiques'
        throw e
      }
    }
  }
})
