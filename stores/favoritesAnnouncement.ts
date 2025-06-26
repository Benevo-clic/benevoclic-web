import {defineStore} from "pinia";
import type {FavoritesAnnouncement} from "~/common/interface/event.interface";


export const useFavoriteAnnouncement = defineStore('favoriteAnnouncement', {
    state: () => ({
        favorites: [] as FavoritesAnnouncement[],
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getFavorites: (state) => state.favorites,
        isLoading: (state) => state.loading,
        getError: (state) => state.error,
    },

    actions: {
        async fetchFavorites(volunteerId: string,announcementId: string) {
            this.loading = true;
            this.error = null;
            try {
                this.favorites = await $fetch<FavoritesAnnouncement[]>('/api/announcement/favorites-announcement/favoritesAnnouncement', {
                    method: 'GET',
                    query: {volunteerId, announcementId},
                });
                if (!this.favorites || this.favorites.length === 0) {
                    this.error = 'Aucun favori trouvé';
                }
                return this.favorites;
            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération des favoris';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async fetchAllFavoritesOfVolunteer(id: string) {
            this.loading = true;
            this.error = null;
            try {
                this.favorites = await $fetch<FavoritesAnnouncement[]>(`/api/announcement/favorites-announcement/${id}`);
                if (!this.favorites || this.favorites.length === 0) {
                    this.error = 'Aucun favori trouvé';
                }
                return this.favorites;
            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération des favoris';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async addFavorite(announcementId: string, volunteerId: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await $fetch<FavoritesAnnouncement>('/api/announcement/favorites-announcement/favoritesAnnouncement', {
                    method: 'POST',
                    body: { announcementId, volunteerId },
                });
                console.log('Favorite added:', response);
                this.favorites.push(response);
            } catch (err: any) {
                this.error = err?.message || 'Erreur d\'ajout au favoris';
                throw err;
            } finally {
                this.loading = false;
            }
        },
        async removeByVolunteerIdAndAnnouncementId(announcementId: string , volunteerId: string) {
            this.loading = true;
            this.error = null;
            try {
                await $fetch(`/api/announcement/favorites-announcement/removeByVolunteerIdAndAnnouncementId`, {
                    method: 'DELETE',
                    body: { volunteerId, announcementId },
                });
                this.favorites = this.favorites.filter(fav => fav.volunteerId !== volunteerId || fav.announcementId !== announcementId);
                console.log("Updated favorites:", this.favorites);
            } catch (err: any) {
                this.error = err?.message || 'Erreur de suppression du favori';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    },
});