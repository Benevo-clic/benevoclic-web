import { onMounted } from 'vue'
import { useAnnouncementStore } from "~/stores/announcement.store";
import {useUser} from "~/composables/auth/useUser";

export const useAnnouncement = () => {
    const announcementStore = useAnnouncementStore()
    const { user,fetchUser } = useUser();



    onMounted(async () => {
            if(!user.value){
                await fetchUser();
            }else if(user.value.role === "ASSOCIATION"){
            await announcementStore.fetchAnnouncements(user.value?.userId);
            }else {
                await announcementStore.fetchAllAnnouncements();
            }
    })

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
