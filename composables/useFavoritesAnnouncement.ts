import {useFavoriteAnnouncement} from "~/stores/favoritesAnnouncement.store";


export const useFavoritesAnnouncement = () => {
    const announcementStore = useFavoriteAnnouncement()

    return {
        fetchFavorites : announcementStore.fetchFavorites,
        addFavorite: announcementStore.addFavorite,
        getFavorites : computed(() => announcementStore.getFavorites),
        fetchAllFavorites: announcementStore.fetchAllFavorites,
        fetchFavoritesByAnnouncementId: announcementStore.fetchFavoritesByAnnouncementId,
        removeAllByVolunteerId: announcementStore.removeAllByVolunteerId,
        removeAllByAnnouncementId: announcementStore.removeAllByAnnouncementId,
        resetState: announcementStore.resetState,
        getFavoritesAnnouncementsVolunteer: computed(() => announcementStore.getFavoritesAnnouncementsVolunteer),
        loading: computed(() => announcementStore.loading),
        error: computed(() => announcementStore.error),
        removeByVolunteerIdAndAnnouncementId: announcementStore.removeByVolunteerIdAndAnnouncementId,
        fetchAllFavoritesOfVolunteer: announcementStore.fetchAllFavoritesOfVolunteer,
        fetchFavoriteVolunteerByVolunteerId: announcementStore.fetchFavoriteVolunteerByVolunteerId,
    }
}