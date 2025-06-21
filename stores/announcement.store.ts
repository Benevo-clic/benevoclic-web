import { defineStore } from 'pinia';
import type { Announcement } from '~/common/interface/event.interface';

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
        const response = await $fetch<Announcement[]>('/api/announcement/list', {
          method: 'GET',
          query: associationId ? { associationId } : {},
        });
        this.announcements = response;
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
        const response = await $fetch<Announcement>(`/api/announcement/${id}`);
        this.currentAnnouncement = response;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération de l\'annonce';
        // throw err;
      } finally {
        this.loading = false;
      }
    },

    async createAnnouncement(payload: Omit<Announcement, 'id'>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch<Announcement>('/api/announcement/create', {
          method: 'POST',
          body: payload,
        });
        this.announcements.push(response);
      } catch (err: any) {
        this.error = err?.message || 'Erreur de création de l\'annonce';
        throw err;
      } finally {
        this.loading = false;
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
        const index = this.announcements.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.announcements[index] = response;
        }
        if (this.currentAnnouncement?.id === id) {
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
        this.announcements = this.announcements.filter((a) => a.id !== id);
        if (this.currentAnnouncement?.id === id) {
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