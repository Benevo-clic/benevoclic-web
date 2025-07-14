import {useFavoriteAnnouncement} from "~/stores/favoritesAnnouncement";


export const useFavoritesAnnouncement = () => {
    const announcementStore = useFavoriteAnnouncement()

    return {
        fetchFavorites : announcementStore.fetchFavorites,
        addFavorite: announcementStore.addFavorite,
        getFavorites : computed(() => announcementStore.getFavorites),
        getFavoritesAnnouncementsVolunteer: computed(() => announcementStore.getFavoritesAnnouncementsVolunteer),
        loading: computed(() => announcementStore.loading),
        error: computed(() => announcementStore.error),
        removeByVolunteerIdAndAnnouncementId: announcementStore.removeByVolunteerIdAndAnnouncementId,
        fetchAllFavoritesOfVolunteer: announcementStore.fetchAllFavoritesOfVolunteer,
        fetchFavoriteVolunteerByVolunteerId: announcementStore.fetchFavoriteVolunteerByVolunteerId,
    }
}