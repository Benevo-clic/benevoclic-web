import {useVolunteerAuthStore} from "~/stores/volunteer.store";


export const useVolunteerAuth = () => {
    const volunteerStore = useVolunteerAuthStore();

    return {
        volunteer: computed(() => volunteerStore.getVolunteer),
        loading: computed(() => volunteerStore.loading),
        error: computed(() => volunteerStore.error),
        registerVolunteer: volunteerStore.registerVolunteer,
    }

}