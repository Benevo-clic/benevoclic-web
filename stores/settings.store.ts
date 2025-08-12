import { defineStore } from 'pinia'

export interface AssociationSettings {
  profileVisibility: boolean
  contactInfoVisibility: boolean
  eventVisibility: boolean
  volunteerListVisibility: boolean
  twoFactor: boolean
  loginNotifications: boolean
  siretVerification: boolean
  autoApproveVolunteers: boolean
  volunteerLimits: boolean
  participantLimits: boolean
  eventApproval: boolean
}

export interface VolunteerSettings {
  profileVisibility: boolean
  locationSharing: boolean
  activitySharing: boolean
  twoFactor: boolean
}

interface SettingsState {
  volunteer: VolunteerSettings
  association: AssociationSettings
  isLoading: boolean
  error: string | null
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    volunteer: {
      profileVisibility: true,
      locationSharing: false,
      activitySharing: true,
      twoFactor: false
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
      participantLimits: true,
      eventApproval: true
    },
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async loadVolunteer() {
      this.isLoading = true
      this.error = null
      try {
        this.volunteer = await $fetch('/api/settings/volunteer', {
          method: 'GET',
          credentials: 'include'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des paramètres'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async getVolunteerSettings(volunteerId: string) {
      this.isLoading = true
      this.error = null
      try {
        this.volunteer = await $fetch(`/api/settings/volunteer/${volunteerId}`, {
          method: 'GET',
          credentials: 'include'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des paramètres du bénévole'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async saveVolunteer(payload?: Partial<VolunteerSettings>) {
      this.isLoading = true
      this.error = null
      try {
        const body = payload ?? this.volunteer
        this.volunteer = await $fetch('/api/settings/volunteer', {
          method: 'PUT',
          body,
          credentials: 'include'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la sauvegarde des paramètres'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async getAssociationSettings(associationId: string) {
      this.isLoading = true
      this.error = null
      try {
        this.association = await $fetch(`/api/settings/association/${associationId}`, {
          method: 'GET',
          credentials: 'include'
        })
        return this.association
      } catch (error: any) {
        this.error = error.message || "Erreur lors du chargement des paramètres de l'association"
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loadAssociation() {
      this.isLoading = true
      this.error = null
      try {
        this.association = await $fetch('/api/settings/association', {
          method: 'GET',
          credentials: 'include'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des paramètres'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async saveAssociation(payload?: Partial<AssociationSettings>) {
      this.isLoading = true
      this.error = null
      try {
        const body = payload ?? this.association
        this.association = await $fetch('/api/settings/association', {
          method: 'PUT',
          body,
          credentials: 'include'
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
