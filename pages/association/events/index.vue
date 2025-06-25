<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu -->
    <div class="hidden md:block">
      <ActivityMenu />
    </div>
    
    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-base-content">{{ t('drawer-content.activity.my_missions') }}</h1>
          <UButton @click="openCreateModal" icon="i-heroicons-plus-circle">Créer une mission</UButton>
        </div>
        
        <EventList
          :association-id="association?.associationId"
          @edit="openEditModal"
          @delete="handleDelete"
        />
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ClientOnly>
      <UModal v-model="isCreateModalVisible">
        <UCard>
          <template #header>
            <h2 class="text-lg font-bold">{{ isEditing ? 'Modifier la mission' : 'Créer une nouvelle mission' }}</h2>
          </template>

          <EventForm
            :announcement="selectedAnnouncement"
            @submit="handleSubmit"
            @cancel="announcementStore.closeCreateModal()"
          />
        </UCard>
      </UModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ActivityMenu from '~/components/activity/ActivityMenu.vue'
import EventList from '~/components/event/association/EventList.vue'
import EventForm from '~/components/event/association/EventForm.vue'
import { useAnnouncementStore } from '~/stores/announcement.store'
import { useAssociationAuthStore } from '~/stores/association.store'
import type { Announcement } from '~/common/interface/event.interface'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const { t } = useI18n()
const announcementStore = useAnnouncementStore();
const associationStore = useAssociationAuthStore();
const route = useRoute();
const router = useRouter();

const { isCreateModalVisible } = storeToRefs(announcementStore);
const association = computed(() => associationStore.getAssociation);

const isEditing = ref(false);
const selectedAnnouncement = ref<Announcement | null>(null);

// Watch for the query parameter to open the modal
watch(
  () => route.query.action,
  (newAction) => {
    if (newAction === 'create') {
      openCreateModal();
      // Clean up the URL
      router.replace({ query: { ...route.query, action: undefined } });
    }
  },
  { immediate: true }
);

const openCreateModal = () => {
  isEditing.value = false;
  selectedAnnouncement.value = null;
  announcementStore.openCreateModal();
};

const openEditModal = (announcement: Announcement) => {
  isEditing.value = true;
  selectedAnnouncement.value = announcement;
  announcementStore.openCreateModal();
};

const handleDelete = async (announcement: Announcement) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la mission "${announcement.nameEvent}" ?`)) {
    try {
      await announcementStore.removeAnnouncement(announcement.id);
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  }
};

const handleSubmit = async (formData: Omit<Announcement, 'id'>) => {
  if (!association.value) {
    console.error('Données de l\'association non disponibles.');
    return;
  }
    
  try {
    if (isEditing.value && selectedAnnouncement.value) {
      await announcementStore.updateAnnouncement(selectedAnnouncement.value.id, formData);
    } else {
      const payload = {
        ...formData,
        associationId: association.value.associationId,
        associationName: association.value.associationName,
        datePublication: new Date().toISOString(),
      };
      await announcementStore.createAnnouncement(payload);
    }
    announcementStore.closeCreateModal();
  } catch (error) {
    console.error('Erreur lors de la soumission', error);
  }
};
</script> 