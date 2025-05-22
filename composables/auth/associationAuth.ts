import {useAssociationAuthStore} from "~/stores/association.store";


export const useAssociationAuth = () => {
    const associationStore = useAssociationAuthStore();

    return {
        association: computed(() => associationStore.getAssociation),
        loading: computed(() => associationStore.loading),
        error: computed(() => associationStore.error),
        registerAssociation: associationStore.registerAssociation,
        getAssociationInfo: associationStore.getAssociationInfo,
        getAssociationInfoBySiret: associationStore.getAssociationInfoBySiret,
    }

}