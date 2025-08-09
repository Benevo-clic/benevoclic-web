<script setup lang="ts">
import { ref } from 'vue'
import { useRequestFetch } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'

interface AnnouncementRow {
  id: string
  nameEvent: string
  associationName: string
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED'
}

const $fetch = useRequestFetch()
const announcements = ref<AnnouncementRow[]>([])
const status = ref<'' | AnnouncementRow['status']>('')
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const qs = status.value ? `?status=${status.value}` : ''
    const list = await $fetch<AnnouncementRow[]>(`/api/announcements${qs}`, { method: 'GET', credentials: 'include' })
    announcements.value = list || []
  } finally {
    loading.value = false
  }
}

async function updateStatus(id: string, newStatus: AnnouncementRow['status']) {
  try {
    await $fetch(`/api/announcements/updateStatus/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: { status: newStatus },
    })
    const row = announcements.value.find(a => a.id === id)
    if (row) row.status = newStatus
  } catch (e) {
    console.error('Erreur mise à jour statut annonce:', e)
  }
}

function reset() {
  status.value = ''
  load()
}

load()
</script>

<template>
  <div>
    <AdminHeader />
    <section class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 class="text-2xl font-bold mb-6">Gestion des annonces</h1>

      <div class="flex flex-col sm:flex-row gap-2 mb-4">
        <select v-model="status" class="select select-bordered select-sm w-full sm:w-48">
          <option value="">Tous les statuts</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <div class="flex gap-2">
          <button class="btn btn-primary btn-sm" @click="load" :disabled="loading">Filtrer</button>
          <button class="btn btn-outline btn-sm" @click="reset" :disabled="loading">Réinitialiser</button>
        </div>
      </div>

      <div class="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Association</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in announcements" :key="a.id">
              <td class="font-mono text-xs sm:text-sm break-all">{{ a.id }}</td>
              <td class="text-sm">{{ a.nameEvent }}</td>
              <td class="text-sm">{{ a.associationName }}</td>
              <td><span class="badge badge-outline">{{ a.status }}</span></td>
              <td class="flex flex-wrap gap-2">
                <button class="btn btn-xs" @click="updateStatus(a.id, 'ACTIVE')">ACTIVE</button>
                <button class="btn btn-xs" @click="updateStatus(a.id, 'INACTIVE')">INACTIVE</button>
                <button class="btn btn-xs" @click="updateStatus(a.id, 'COMPLETED')">COMPLETED</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!loading && announcements.length === 0" class="text-center py-8 text-base-content/70">Aucune annonce</div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>