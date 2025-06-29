import { useAnnouncementStore } from "~/stores/announcement.store";

export const useAnnouncement = () => {
    const announcementStore = useAnnouncementStore()

    return {
        createAnnouncement: announcementStore.createAnnouncement,
        uploadImageCover: announcementStore.uploadImageCover,
        updateAnnouncement: announcementStore.updateAnnouncement,
        removeAnnouncement: announcementStore.removeAnnouncement,
        getAnnouncements: computed(() => announcementStore.getAnnouncements),
        getCurrentAnnouncement: computed(() => announcementStore.getCurrentAnnouncement),
        fetchAllAnnouncements: announcementStore.fetchAllAnnouncements,
        fetchAnnouncements: announcementStore.fetchAnnouncements,
        fetchAnnouncementById: announcementStore.fetchAnnouncementById,
        loading: computed(() => announcementStore.loading),
        error: computed(() => announcementStore.error),
        // Nouvelles méthodes de cache
        clearCache: announcementStore.clearCache,
        invalidateCache: announcementStore.invalidateCache,
        isCacheValid: computed(() => announcementStore.isCacheValid),
    }
}
