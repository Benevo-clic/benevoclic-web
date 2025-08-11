import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    volunteer: {
      profileVisibility: true,
      locationSharing: false,
      activitySharing: true,
      twoFactor: false
    } as {
      profileVisibility: boolean
      locationSharing: boolean
      activitySharing: boolean
      twoFactor: boolean
    },
    association: {
      profileVisibility: true,
      contactInfoVisibility: false,
      eventVisibility: true,
      volunteerListVisibility: false,
      twoFactor: false,
      loginNotifications: true,
      siretVerification: true,
      autoApproveVolunteers: false,
      volunteerLimits: true,
      eventApproval: true
    } as {
      profileVisibility: boolean
      contactInfoVisibility: boolean
      eventVisibility: boolean
      volunteerListVisibility: boolean
      twoFactor: boolean
      loginNotifications: boolean
      siretVerification: boolean
      autoApproveVolunteers: boolean
      volunteerLimits: boolean
      eventApproval: boolean
    },
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async loadVolunteer() {
      this.isLoading = true
      this.error = null
      try {
        this.volunteer = await $fetch('/api/settings/volunteer')
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des paramètres'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async saveVolunteer(payload?: Partial<typeof this.volunteer>) {
      this.isLoading = true
      this.error = null
      try {
        const body = payload ?? this.volunteer
        this.volunteer = await $fetch('/api/settings/volunteer', {
          method: 'PUT',
          body
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la sauvegarde des paramètres'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loadAssociation() {
      this.isLoading = true
      this.error = null
      try {
        this.association = await $fetch('/api/settings/association')
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des paramètres'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async saveAssociation(payload?: Partial<typeof this.association>) {
      this.isLoading = true
      this.error = null
      try {
        const body = payload ?? this.association
        this.association = await $fetch('/api/settings/association', {
          method: 'PUT',
          body
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la sauvegarde des paramètres'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
