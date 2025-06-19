import {useAssociationAuthStore} from "~/stores/association.store";
import {onMounted} from "vue";


export const useAssociationAuth = () => {
    const associationStore = useAssociationAuthStore();

    onMounted(async () => {
        await associationStore.getAssociationInfo()
        console.log('Mounted volunteer auth composable, fetching volunteer info');
    })

    return {
        association: computed(() => associationStore.getAssociation),
        loading: computed(() => associationStore.loading),
        error: computed(() => associationStore.error),
        registerAssociation: associationStore.registerAssociation,
        getAssociationInfo: associationStore.getAssociationInfo,
        getAssociationInfoBySiret: associationStore.getAssociationInfoBySiret,
        removeAssociation: associationStore.removeAssociation,
        updateAssociation: associationStore.updateAssociation
    }

}