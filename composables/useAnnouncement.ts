import { useAnnouncementStore } from "~/stores/announcement.store";

export const useAnnouncement = () => {
    const announcementStore = useAnnouncementStore()

    return {
        addParticipant: announcementStore.addParticipant,
        addVolunteerWaiting: announcementStore.addVolunteerWaiting,
        addVolunteer: announcementStore.addVolunteer,
        removeParticipant: announcementStore.removeParticipant,
        removeVolunteer: announcementStore.removeVolunteer,
        removeVolunteerWaiting: announcementStore.removeVolunteerWaiting,
        createAnnouncement: announcementStore.createAnnouncement,
        uploadImageCover: announcementStore.uploadImageCover,
        updateAnnouncement: announcementStore.updateAnnouncement,
        updateStatus: announcementStore.updateStatus,
        filterAnnouncement: announcementStore.filterAnnouncement,
        filterAssociationAnnouncementByAssociationId: announcementStore.filterAssociationAnnouncements,
        updatePresentVolunteer: announcementStore.updatePresentVolunteer,
        updatePresentParticipant: announcementStore.updatePresentParticipant,
        getCurrentFilter: computed(() => announcementStore.getCurrentFilter),
        setCurrentFilter: announcementStore.setCurrentFilter,
        patchCurrentFilter: announcementStore.patchCurrentFilter,
        removeAnnouncement: announcementStore.removeAnnouncement,
        getAnnouncements: computed(() => announcementStore.getAnnouncements),
        getCurrentAnnouncement: computed(() => announcementStore.getCurrentAnnouncement),
        fetchAllAnnouncements: announcementStore.fetchAllAnnouncements,
        fetchAnnouncements: announcementStore.fetchAnnouncements,
        fetchAnnouncementById: announcementStore.fetchAnnouncementById,
        loading: computed(() => announcementStore.loading),
        error: computed(() => announcementStore.error),
        clearCache: announcementStore.clearCache,
        invalidateCache: announcementStore.invalidateCache,
        isCacheValid: computed(() => announcementStore.isCacheValid),
    }
}
