import {computed} from "vue";
import {useAdminStore} from "~/stores/admin/admin.store";


export const useAdmin = () => {
    const adminStore = useAdminStore();

    return {
        reports: computed(() => adminStore.reports),
        selectedReport: computed(() => adminStore.selectedReport),
        loading: computed(() => adminStore.loading),
        error: computed(() => adminStore.error),
        fetchReports: adminStore.fetchReports,
        fetchReportById: adminStore.fetchReportById,
        updateReportStatus: adminStore.updateReportStatus,
        filteredByStatus: adminStore.filteredByStatus,
        getStats: computed(() => adminStore.getStats),
        isLoading: computed(() => adminStore.isLoading),
        getReports: computed(() => adminStore.getReports),
    }

}
