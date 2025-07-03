import {useAssociationAuthStore} from "~/stores/association.store";
import {onMounted, computed} from "vue";
import {useUserStore} from "~/stores/user/user.store";


export const useAssociationAuth = () => {
    const associationStore = useAssociationAuthStore();
    const userStore = useUserStore();

    onMounted(async () => {
        if (userStore.getUserRule === 'ASSOCIATION') {
            await associationStore.getAssociationInfo()
        }
    })

    return {
        association: computed(() => associationStore.getAssociation),
        loading: computed(() => associationStore.loading),
        error: computed(() => associationStore.error),
        registerAssociation: associationStore.registerAssociation,
        getAssociationInfo: associationStore.getAssociationInfo,
        getAssociationInfoBySiret: associationStore.getAssociationInfoBySiret,
        removeAssociation: associationStore.removeAssociation,
        addVolunteerToAssociation: associationStore.addVolunteerToAssociation,
        removeVolunteerFromAssociation: associationStore.removeVolunteerFromAssociation,
        updateAssociation: associationStore.updateAssociation,
        clearCache: associationStore.clearCache,
    }

}
