import { computed } from 'vue'
import { useAssociationAuthStore } from '~/stores/association.store'

export const useAssociationAuth = () => {
  const associationStore = useAssociationAuthStore()

  return {
    association: computed(() => associationStore.getAssociation),
    loading: computed(() => associationStore.loading),
    error: computed(() => associationStore.error),
    registerAssociation: associationStore.registerAssociation,
    getNumberOfAssociations: associationStore.getNumberOfAssociations,
    getAssociationInfo: associationStore.getAssociationInfo,
    getAssociationById: associationStore.getAssociationById,
    getAssociationInfoBySiret: associationStore.getAssociationInfoBySiret,
    removeAssociation: associationStore.removeAssociation,
    addVolunteerToAssociation: associationStore.addVolunteerToAssociation,
    removeVolunteerFromAssociation: associationStore.removeVolunteerFromAssociation,
    updateAnnouncementVisibility: associationStore.updateAnnouncementVisibility,
    removeAssociationVolunteerWaiting: associationStore.removeAssociationVolunteerWaiting,
    updateAssociation: associationStore.updateAssociation,
    clearCache: associationStore.clearCache
  }
}
