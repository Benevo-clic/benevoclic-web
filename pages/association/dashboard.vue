<script setup lang="ts">
import { ref, computed } from 'vue'
import StatCard from '~/components/dashboard/StatCard.vue'
import DateRangePicker from '~/components/dashboard/DateRangePicker.vue'
import TimeSeriesChart from '~/components/dashboard/TimeSeriesChart.vue'
import PieChart from '~/components/dashboard/PieChart.vue'
import ObjectiveProgress from '~/components/dashboard/ObjectiveProgress.vue'
import { mockEvents } from '~/mock/mockEvents'
import { mockAssociations } from '~/mock/mockAssociations'
import {definePageMeta} from "#imports";

const dateRange = ref({ from: '2024-06-01', to: '2024-06-30' })

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

const totalAnnouncements = computed(() => mockEvents.length)
const totalVolunteers = computed(() =>
  Array.from(new Set(mockAssociations.flatMap(a => a.volunteers?.map(v => v.id) || []))).length
)
const totalParticipants = computed(() =>
  mockEvents.reduce((sum, e) => sum + (e.nbParticipants || (e.participants?.length || 0)), 0)
)

const announcementsSeries = computed(() => {
  const map = new Map()
  mockEvents.forEach(e => {
    map.set(e.datePublication, (map.get(e.datePublication) || 0) + 1)
  })
  return {
    labels: Array.from(map.keys()),
    data: Array.from(map.values())
  }
})

const volunteersSeries = computed(() => {
  let total = 0
  const map = new Map()
  mockEvents.forEach(e => {
    total += e.nbVolunteers || (e.volunteers?.length || 0)
    map.set(e.datePublication, total)
  })
  return {
    labels: Array.from(map.keys()),
    data: Array.from(map.values())
  }
})

const pieData = computed(() => {
  const volunteers = totalVolunteers.value
  const participants = totalParticipants.value
  return { volunteers, participants }
})

const objectives = computed(() =>
  mockEvents.map(e => ({
    id: e.id,
    title: e.nameEvent,
    covered: e.nbParticipants || (e.participants?.length || 0),
    planned: e.maxParticipants
  }))
)

const cumulativeSeries = volunteersSeries
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row gap-4 mb-6 items-center">
      <DateRangePicker v-model="dateRange" />
      <div class="flex-1 flex gap-4">
        <StatCard :value="totalAnnouncements" label="Annonces publiées" />
        <StatCard :value="totalVolunteers" label="Bénévoles inscrits" />
        <StatCard :value="totalParticipants" label="Participants" />
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      <TimeSeriesChart
        :labels="announcementsSeries.labels"
        :data="announcementsSeries.data"
        label="Annonces publiées"
        type="bar"
        color="#2563eb"
      />
      <TimeSeriesChart
        :labels="volunteersSeries.labels"
        :data="volunteersSeries.data"
        label="Bénévoles inscrits"
        color="#10b981"
      />
      <PieChart
        :labels="['Bénévoles', 'Participants']"
        :data="[pieData.volunteers, pieData.participants]"
        :colors="['#10b981', '#f59e42']"
      />
    </div>
    <div class="mb-6">
      <h2 class="text-lg font-bold mb-2">Taux d’atteinte des objectifs par annonce</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ObjectiveProgress
          v-for="obj in objectives"
          :key="obj.id"
          :title="obj.title"
          :covered="obj.covered"
          :planned="obj.planned"
        />
      </div>
    </div>
    <div>
      <h2 class="text-lg font-bold mb-2">Croissance cumulée des bénévoles adhérents</h2>
      <TimeSeriesChart
        :labels="cumulativeSeries.labels"
        :data="cumulativeSeries.data"
        label="Bénévoles cumulés"
        color="#f59e42"
      />
    </div>
  </div>
</template>