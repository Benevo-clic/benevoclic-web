import {defineStore} from 'pinia';
import type {Announcement, CreateAnnouncementDto} from '~/common/interface/event.interface';
import {$fetch} from "ofetch";

export const useAnnouncementStore = defineStore('announcement', {
  state: () => ({
    announcements: [] as Announcement[],
    currentAnnouncement: null as Announcement | null,
    isCreateModalVisible: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getAnnouncements: (state) => state.announcements,
    getCurrentAnnouncement: (state) => state.currentAnnouncement,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    openCreateModal() {
      this.isCreateModalVisible = true;
    },
    closeCreateModal() {
      this.isCreateModalVisible = false;
    },
    async fetchAnnouncements(associationId?: string) {
      this.loading = true;
      this.error = null;
      try {
        this.announcements = await $fetch<Announcement[]>('/api/announcement/announcementAssociation', {
          method: 'GET',
          query: associationId ? {associationId} : {},
        });
        if (!this.announcements || this.announcements.length === 0) {
          this.error = 'Aucune annonce trouvée';
        }
        return this.announcements;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des annonces';
        // throw err; // Decide if you want to re-throw
      } finally {
        this.loading = false;
      }
    },

    async fetchAnnouncementById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.currentAnnouncement = await $fetch<Announcement>(`/api/announcement/${id}`);
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération de l\'annonce';
        // throw err;
      } finally {
        this.loading = false;
      }
    },

    async createAnnouncement(payload: CreateAnnouncementDto) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch('/api/announcement/create', {
          method: 'POST',
          body: payload,
        });
        if(!response) {
            throw new Error('Erreur lors de la création de l\'annonce');
        }

        await this.fetchAnnouncementById(response);

        return response;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de création de l\'annonce';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async uploadImageCover(imageBase64: string) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/announcement/updateCoverAnnouncement', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageBase64,
            id: this.currentAnnouncement?._id
          })
        })

        if (!response) {
          this.error = 'Erreur lors de l\'upload de l\'image'
          throw new Error(this.error)
        }
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de l\'upload de l\'image'
        throw error
      } finally {
        this.loading = false
      }
    },


    async updateAnnouncement(id: string, payload: Partial<Announcement>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch<Announcement>(`/api/announcement/${id}`, {
          method: 'PATCH',
          body: payload,
        });
        const index = this.announcements.findIndex((a) => a._id === id);
        if (index !== -1) {
          this.announcements[index] = response;
        }
        if (this.currentAnnouncement?._id === id) {
          this.currentAnnouncement = response;
        }
      } catch (err: any) {
        this.error = err?.message || 'Erreur de mise à jour de l\'annonce';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async removeAnnouncement(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await $fetch(`/api/announcement/${id}`, {
          method: 'DELETE',
        });
        this.announcements = this.announcements.filter((a) => a._id !== id);
        if (this.currentAnnouncement?._id === id) {
          this.currentAnnouncement = null;
        }
      } catch (err: any) {
        this.error = err?.message || 'Erreur de suppression de l\'annonce';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    setCurrentAnnouncement(announcement: Announcement | null) {
        this.currentAnnouncement = announcement;
    }
  },
}); 