<script setup lang="ts">
import { PlusCircle as PlusIcon, Calendar as CalendarIcon, History as HistoryIcon, HelpCircle as HelpIcon } from 'lucide-vue-next'
import { navigateTo } from "#app";

const { t } = useI18n()

// Association specific handlers
function handleAddNewEvent() {
  navigateTo('/association/events/new')
}

function handlePastEvents() {
  navigateTo('/association/events/past')
}

function handleManageEvents() {
  navigateTo('/association/events')
}
</script>

<template>
  <!-- ASSOCIATION layout without search bar -->
  <div class="flex items-center justify-center">
    <div class="flex justify-center flex-wrap text-base-content gap-4">
      <button class="btn btn-primary btn-sm px-3 py-1 flex items-center gap-1" @click="handleAddNewEvent">
        <PlusIcon class="w-5 h-5" /> Nouvel événement
      </button>
      <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="handlePastEvents">
        <HistoryIcon class="w-6 h-6" /> Événements passés
      </button>
      <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="handleManageEvents">
        <CalendarIcon class="w-6 h-6" /> Gérer les événements
      </button>
      <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="navigateTo('/help')">
        <HelpIcon class="w-6 h-6" /> Aide
      </button>
    </div>
  </div>
</template>