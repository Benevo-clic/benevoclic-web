import { onMounted } from 'vue'
import { useAnnouncementStore } from "~/stores/announcement.store";
import {useUser} from "~/composables/auth/useUser";

export const useAnnouncement = () => {
    const announcementStore = useAnnouncementStore()
    const { user,fetchUser } = useUser();



    onMounted(async () => {
            if(!user.value){
                await fetchUser();
            }
            await announcementStore.fetchAnnouncements(user.value?.userId);
    })

    return {
        createAnnouncement: announcementStore.createAnnouncement,
        uploadImageCover: announcementStore.uploadImageCover,
        getAnnouncements: computed(() => announcementStore.getAnnouncements),
        fetchAnnouncements: announcementStore.fetchAnnouncements,
        fetchAnnouncementById: announcementStore.fetchAnnouncementById,
        getCurrentAnnouncement: announcementStore.getCurrentAnnouncement,
        loading: computed(() => announcementStore.loading),
        error: computed(() => announcementStore.error),
    }
}
