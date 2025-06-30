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
    // Cache pour éviter les recalculs
    _announcementsCache: new Map<string, Announcement>(),
    _lastFetch: 0,
    _cacheExpiry: 5 * 60 * 1000, // 5 minutes
  }),

  getters: {
    // Optimisation des getters avec cache
    getAnnouncements: (state) => {
      // Retourne directement la référence pour éviter les recalculs
      return state.announcements;
    },
    getCurrentAnnouncement: (state) => state.currentAnnouncement,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    // Getter optimisé pour chercher une annonce par ID
    getAnnouncementById: (state) => (id: string) => {
      return state._announcementsCache.get(id) || 
             state.announcements.find(a => a._id === id);
    },
    // Vérifier si le cache est valide
    isCacheValid: (state) => {
      return Date.now() - state._lastFetch < state._cacheExpiry;
    }
  },

  actions: {

    closeCreateModal() {
      this.isCreateModalVisible = false;
    },

    _updateCache() {
      this._announcementsCache.clear();
      this.announcements.forEach(announcement => {
        if (announcement._id) {
          this._announcementsCache.set(announcement._id, announcement);
        }
      });
      this._lastFetch = Date.now();
    },

    async fetchAnnouncements(associationId?: string) {
      if (this.isCacheValid && this.announcements.length > 0) {
        return this.announcements;
      }

      this.loading = true;
      this.error = null;
      try {
        this.announcements = await $fetch<Announcement[]>('/api/announcement/announcementAssociation', {
          method: 'GET',
          query: associationId ? {associationId} : {},
        });
        
        if (!this.announcements || this.announcements.length === 0) {
          this.error = 'Aucune annonce trouvée';
          console.log(`Aucune annonce trouvée pour associationId: ${associationId}`);
        }
        this._updateCache();
        return this.announcements;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération des annonces';
      } finally {
        this.loading = false;
      }
    },

    async fetchAllAnnouncements() {

        if (this.isCacheValid && this.announcements.length > 0) {
          return this.announcements;
        }

        this.loading = true;
        this.error = null;
        try {
            this.announcements = await $fetch<Announcement[]>('/api/announcement/getAllAnnouncements');
            if (!this.announcements || this.announcements.length === 0) {
            this.error = 'Aucune annonce trouvée';
            }
            
            this._updateCache();
            return this.announcements;
        } catch (err: any) {
            this.error = err?.message || 'Erreur de récupération des annonces';
        } finally {
            this.loading = false;
        }
    },

    async fetchAnnouncementById(id: string) {
      const cached = this._announcementsCache.get(id);

      if (cached && this.isCacheValid) {
        this.currentAnnouncement = cached;
        return cached;
      }

      this.loading = true;
      this.error = null;
      try {
        this.currentAnnouncement = await $fetch<Announcement>(`/api/announcement/${id}`);
        
        if (this.currentAnnouncement?._id) {
          this._announcementsCache.set(this.currentAnnouncement._id, this.currentAnnouncement);
        }
        
        return this.currentAnnouncement;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération de l\'annonce';
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
        
        this._lastFetch = 0;

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
        
        if (this.currentAnnouncement) {
          await this.fetchAnnouncementById(this.currentAnnouncement._id);
        }
        
        this._lastFetch = 0;
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
          this.announcements[index] = {...response, _id: id};
        }
        
        if (this.currentAnnouncement?._id === id) {
          this.currentAnnouncement = {...response, _id: id};
        }
        
        this._announcementsCache.set(id, {...response, _id: id});
        
        this._lastFetch = 0;
        
        return response;
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
        const response  = await $fetch(`/api/announcement/${id}`, {
          method: 'DELETE',
        });
        
        this.announcements = this.announcements.filter((a) => a._id !== id);
        if (this.currentAnnouncement?._id === id) {
          this.currentAnnouncement = null;
        }
        
        this._announcementsCache.delete(id);
        
        return response;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de suppression de l\'annonce';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    setCurrentAnnouncement(announcement: Announcement | null) {
        this.currentAnnouncement = announcement;
    },

    clearCache() {
      this._announcementsCache.clear();
      this._lastFetch = 0;
    },

    invalidateCache() {
      this._lastFetch = 0;
    },

    async addParticipant(announcementId: string, participant: { id: string, name: string }) {
        this.loading = true;
        this.error = null;
        try {
            const response = await $fetch(`/api/announcement/registerParticipant`, {
            method: 'PATCH',
            body: {
                announcementId,
                ...participant,
            },
            });



            if (this.currentAnnouncement?._id === announcementId) {
              await this.fetchAnnouncementById(announcementId)
            }

            this._lastFetch = 0;

          return response;
        } catch (err: any) {
            this.error = err?.message || 'Erreur d\'enregistrement du participant';
            throw err;
        } finally {
            this.loading = false;
        }
    },
    async addVolunteerWaiting(announcementId: string, volunteer: { id: string, name: string }) {
        this.loading = true;
        this.error = null;
        try {
            const response = await $fetch(`/api/announcement/registerVolunteerWaiting`, {
            method: 'PATCH',
            body: {
                announcementId,
                ...volunteer,
            },
            });

            if (this.currentAnnouncement?._id === announcementId) {
              await this.fetchAnnouncementById(announcementId)
            }

            this._lastFetch = 0;

          return response;
        } catch (err: any) {
            this.error = err?.message || 'Erreur d\'enregistrement du volontaire en attente';
            throw err;
        } finally {
            this.loading = false;
        }
    },
    async addVolunteer(announcementId: string, volunteer: { id: string, name: string }) {
        this.loading = true;
        this.error = null;
        try {
            const response = await $fetch(`/api/announcement/registerVolunteer`, {
            method: 'PATCH',
            body: {
                announcementId,
                ...volunteer,
            },
            });

            if (this.currentAnnouncement?._id === announcementId) {
              await this.fetchAnnouncementById(announcementId)
            }

            this._lastFetch = 0;

          return response;
        } catch (err: any) {
            this.error = err?.message || 'Erreur d\'enregistrement du volontaire';
            throw err;
        } finally {
            this.loading = false;
        }
    },

    async removeParticipant(announcementId: string, participantId: string) {
        this.loading = true;
        this.error = null;
        try {
            const response = await $fetch(`/api/announcement/removeParticipant`, {
            method: 'PATCH',
            body:{
                participantId,
                announcementId
            },
            });

            if (this.currentAnnouncement?._id === announcementId) {
            await this.fetchAnnouncementById(announcementId);
            }

            this._lastFetch = 0;

            return response;
        } catch (err: any) {
            this.error = err?.message || 'Erreur de suppression du participant';
            throw err;
        } finally {
            this.loading = false;
        }
    },
    async removeVolunteer(announcementId: string, volunteerId: string) {
        this.loading = true;
        this.error = null;
        try {
            const response = await $fetch(`/api/announcement/removeVolunteer`, {
            method: 'PATCH',
              query: {
                announcementId,
                volunteerId
              }
            });

            if (this.currentAnnouncement?._id === announcementId) {
              await this.fetchAnnouncementById(announcementId)
            }

            this._lastFetch = 0;

          return response;
        } catch (err: any) {
            this.error = err?.message || 'Erreur de suppression du volontaire';
            throw err;
        } finally {
            this.loading = false;
        }
    },
    async removeVolunteerWaiting(announcementId: string, volunteerId: string) {
        this.loading = true;
        this.error = null;
        try {
            const response = await $fetch(`/api/announcement/removeVolunteerWaiting`, {
            method: 'PATCH',
            query: {
                announcementId,
                volunteerId
            }
            });

            if (this.currentAnnouncement?._id === announcementId) {
              await this.fetchAnnouncementById(announcementId)
            }

            this._lastFetch = 0;

          return response;
        } catch (err: any) {
            this.error = err?.message || 'Erreur de suppression du volontaire en attente';
            throw err;
        } finally {
            this.loading = false;
        }
    },
    async updateStatus(announcementId: string, status: string) {
        this.loading = true;
        this.error = null;
        try {
            const response = await $fetch(`/api/announcement/updateStatus`, {
                method: 'PATCH',
                body: { status, announcementId },
            });

            if (this.currentAnnouncement?._id === announcementId) {
                await this.fetchAnnouncementById(announcementId);
            }

            this._lastFetch = 0;

            return response;
        } catch (err: any) {
            this.error = err?.message || 'Erreur de mise à jour du statut de l\'annonce';
            throw err;
        } finally {
            this.loading = false;
        }
    }
  },
}); 