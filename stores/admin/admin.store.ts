import { defineStore } from 'pinia'
import { useRequestFetch, useCookie } from '#app'

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

interface AdminState {
  reports: SupportReport[]
  selectedReport: SupportReport | null
  loading: boolean
  error: string | null
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    reports: [],
    selectedReport: null,
    loading: false,
    error: null,
  }),
  getters: {
    filteredByStatus: (state) => (status?: SupportReport['status']) =>
      status ? state.reports.filter(r => r.status === status) : state.reports,
  },
  actions: {
    async fetchReports() {
      this.loading = true
      this.error = null
      try {
        const $fetch = useRequestFetch()
        const data = await $fetch<SupportReport[]>('/api/admin/support-reports', {
          method: 'GET',
          credentials: 'include',
        })
        this.reports = data
      } catch (e: any) {
        this.error = e?.message || 'Erreur lors du chargement des tickets'
        throw e
      } finally {
        this.loading = false
      }
    },
    async fetchReportById(id: string) {
      const $fetch = useRequestFetch()
      return $fetch<SupportReport>(`/api/admin/support-reports/${id}`, {
        method: 'GET',
        credentials: 'include',
      })
    },
    async updateReportStatus(id: string, status: SupportReport['status']) {
      const $fetch = useRequestFetch()
      await $fetch(`/api/admin/support-reports/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: { status },
      })
      const report = this.reports.find(r => r._id === id)
      if (report) report.status = status
    },
  }
})