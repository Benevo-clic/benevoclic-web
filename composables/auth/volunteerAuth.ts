import {useVolunteerAuthStore} from "~/stores/volunteer.store";
import {computed, onMounted} from "vue";



export const useVolunteerAuth = () => {
    const volunteerStore = useVolunteerAuthStore();


    onMounted(async () => {
            await volunteerStore.getVolunteerInfo()
            console.log('Mounted volunteer auth composable, fetching volunteer info');
    })

    return {
        volunteer: computed(() => volunteerStore.volunteer),
        loading: computed(() => volunteerStore.loading),
        error: computed(() => volunteerStore.error),
        registerVolunteer: volunteerStore.registerVolunteer,
        getVolunteerInfo: volunteerStore.getVolunteerInfo,
        updateVolunteer: volunteerStore.updateVolunteer
    }

}
