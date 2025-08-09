<script setup lang="ts">
  import {
    PlusCircle as PlusIcon,
    Calendar as CalendarIcon,
    ClipboardList,
    HelpCircle as HelpIcon,
    LayoutDashboard as DashboardIcon
  } from 'lucide-vue-next'
  import { useAnnouncementStore } from '~/stores/announcement.store'
  import EventModalForm from '~/components/event/association/EventModalForm.vue'
  import { useNavigation } from '~/composables/useNavigation'
  const { t } = useI18n()

  const announcementStore = useAnnouncementStore()
  const { navigateToRoute } = useNavigation()

  const myModal3 = ref<HTMLDialogElement | null>(null)

  function handleAddNewEvent() {
    announcementStore.setCurrentAnnouncement(null)
    myModal3.value?.showModal()
  }

  async function handleManageEvents() {
    await navigateToRoute('/association/events/association/manage')
  }

  async function handleDashboard() {
    await navigateToRoute('/association/dashboard')
  }

  async function handleRequests() {
    await navigateToRoute('/association/events/association/requests')
  }

  async function handleHelp() {
    await navigateToRoute('/help')
  }

  function closeModal() {
    myModal3.value?.close()
  }
</script>

<template>
  <!-- ASSOCIATION layout without search bar -->
  <div class="flex items-center justify-center">
    <div class="flex justify-center flex-wrap text-base-content gap-4">
      <button
        class="btn btn-primary btn-sm px-3 py-1 flex items-center gap-1"
        @click.prevent="handleAddNewEvent"
      >
        <PlusIcon class="w-5 h-5" /> {{ t('association.activity.new_event') }}
      </button>
      <button
        class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1"
        @click="handleDashboard"
      >
        <DashboardIcon class="w-5 h-5" />
        {{ t('association.activity.dashboard') || 'Dashboard' }}
      </button>
      <button
        class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1"
        @click="handleManageEvents"
      >
        <CalendarIcon class="w-6 h-6" />
        {{ t('association.activity.manage_events') }}
      </button>
      <button
        class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1"
        @click="handleRequests"
      >
        <ClipboardList class="w-6 h-6" />
        {{ t('association.activity.requests') || 'My Requests' }}
      </button>
      <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="handleHelp">
        <HelpIcon class="w-6 h-6" /> Aide
      </button>
    </div>
  </div>

  <dialog ref="myModal3" class="modal">
    <div class="modal-box w-11/12 max-w-7xl" @click.stop>
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="myModal3?.close()"
      >
        ✕
      </button>
      <EventModalForm @close-modal="closeModal" />
    </div>
  </dialog>
</template>
