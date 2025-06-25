import { useAnnouncementStore } from "~/stores/announcement.store";

export const useAnnouncement = () => {
    const announcementStore = useAnnouncementStore()


    return {
        createAnnouncement: announcementStore.createAnnouncement,
        uploadImageCover: announcementStore.uploadImageCover,
        getAnnouncements: computed(() => announcementStore.getAnnouncements),
        fetchAllAnnouncements: announcementStore.fetchAllAnnouncements,
        fetchAnnouncements: announcementStore.fetchAnnouncements,
        fetchAnnouncementById: announcementStore.fetchAnnouncementById,
        getCurrentAnnouncement: announcementStore.getCurrentAnnouncement,
        loading: computed(() => announcementStore.loading),
        error: computed(() => announcementStore.error),
    }
}
