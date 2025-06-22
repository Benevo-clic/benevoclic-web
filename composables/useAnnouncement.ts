import { useUserStore } from '~/stores/user/user.store'
import { onMounted } from 'vue'
import { useAnnouncementStore } from "~/stores/announcement.store";
import {useAssociationAuth} from "~/composables/auth/associationAuth";

export const useAnnouncement = () => {
    const authStore = useUserStore()
    const associationStore = useAssociationAuth()
    const announcementStore = useAnnouncementStore()


    onMounted(async () => {
        if (!authStore.isAuthenticated) {
            await authStore.fetchUser()
            await associationStore.getAssociationInfo()
        }
    })

    return {
        createAnnouncement: announcementStore.createAnnouncement,
        uploadImageCover: announcementStore.uploadImageCover,
    }
}
