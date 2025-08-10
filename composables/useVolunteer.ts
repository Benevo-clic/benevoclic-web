import { computed } from 'vue'
import { useVolunteerAuthStore } from '~/stores/volunteer.store'

export const useVolunteerAuth = () => {
  const volunteerStore = useVolunteerAuthStore()

  return {
    volunteer: computed(() => volunteerStore.volunteer),
    loading: computed(() => volunteerStore.loading),
    error: computed(() => volunteerStore.error),
    registerVolunteer: volunteerStore.registerVolunteer,
    getNumberOfVolunteers: volunteerStore.getNumberOfVolunteers,
    getVolunteerInfo: volunteerStore.getVolunteerInfo,
    updateVolunteer: volunteerStore.updateVolunteer,
    removeVolunteer: volunteerStore.removeVolunteer,
    getAssociationToWaitingList: volunteerStore.getAssociationToWaitingList,
    removeVolunteerFromWaitingListAssociation:
      volunteerStore.removeVolunteerFromWaitingListAssociation,
    removeVolunteerFromAssociation: volunteerStore.removeVolunteerFromAssociation,
    addVolunteerToWaitingListAssociation: volunteerStore.addVolunteerToWaitingListAssociation,
    getAllAssociationsToWaitingList: volunteerStore.getAllAssociationsToWaitingList,
    getAllAssociationsFollowingList: volunteerStore.getAllAssociationsFollowingList,
    getAssociationsFollowingList: volunteerStore.getAssociationsFollowingList,
    getAssociations: volunteerStore.getAssociations,
    getVolunteerAnnouncements: volunteerStore.getVolunteerAnnouncements,
    getParticipantAnnouncement: volunteerStore.getParticipantAnnouncement,
    getPastVolunteerAnnouncement: volunteerStore.getPastVolunteerAnnouncement
  }
}
