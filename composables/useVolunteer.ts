import {useVolunteerAuthStore} from "~/stores/volunteer.store";
import {computed, onMounted} from "vue";
import {useUserStore} from "~/stores/user/user.store";


export const useVolunteerAuth = () => {
    const volunteerStore = useVolunteerAuthStore();
    const userStore = useUserStore();

    onMounted(async () => {
        if (userStore.getUserRule === 'VOLUNTEER') {
            await volunteerStore.getVolunteerInfo()
        }
    })

    return {
        volunteer: computed(() => volunteerStore.volunteer),
        loading: computed(() => volunteerStore.loading),
        error: computed(() => volunteerStore.error),
        registerVolunteer: volunteerStore.registerVolunteer,
        getVolunteerInfo: volunteerStore.getVolunteerInfo,
        updateVolunteer: volunteerStore.updateVolunteer,
        removeVolunteer: volunteerStore.removeVolunteer,
        getAssociationToWaitingList: volunteerStore.getAssociationToWaitingList,
        removeVolunteerFromWaitingListAssociation: volunteerStore.removeVolunteerFromWaitingListAssociation,
        removeVolunteerFromAssociation: volunteerStore.removeVolunteerFromAssociation,
        addVolunteerToWaitingListAssociation: volunteerStore.addVolunteerToWaitingListAssociation,
        getAllAssociationsToWaitingList: volunteerStore.getAllAssociationsToWaitingList,
        getAllAssociationsFollowingList: volunteerStore.getAllAssociationsFollowingList,
        getAssociationsFollowingList: volunteerStore.getAssociationsFollowingList,
        getAssociations: volunteerStore.getAssociations,
    }

}
