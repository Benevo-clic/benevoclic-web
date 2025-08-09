<script setup lang="ts">
import { ref } from 'vue'
import { useRequestFetch } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'

interface UserRow { userId: string; email: string; role: string }

const $fetch = useRequestFetch()
const users = ref<UserRow[]>([])
const search = ref('')
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    if (search.value) {
      // Essayer par ID sinon par email
      try {
        const byId = await $fetch<UserRow>(`/api/user/${search.value}`, { method: 'GET', credentials: 'include' })
        users.value = byId ? [byId] : []
      } catch {
        try {
          const byEmail = await $fetch<UserRow>(`/api/user/email/${encodeURIComponent(search.value)}`, { method: 'GET', credentials: 'include' })
          users.value = byEmail ? [byEmail] : []
        } catch {
          users.value = []
        }
      }
    } else {
      const list = await $fetch<UserRow[]>(`/api/admin/users`, { method: 'GET', credentials: 'include' })
      users.value = list || []
    }
  } finally {
    loading.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Confirmer la suppression de cet utilisateur ?')) return
  loading.value = true
  try {
    await $fetch(`/api/admin/users/${id}`, { method: 'DELETE', credentials: 'include' })
    users.value = users.value.filter(u => u.userId !== id)
  } finally {
    loading.value = false
  }
}

function reset() {
  search.value = ''
  load()
}

load()
</script>

<template>
  <div>
    <AdminHeader />
    <section class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 class="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>

      <div class="flex flex-col sm:flex-row gap-2 mb-4">
        <input v-model="search" @keyup.enter="load" class="input input-bordered w-full sm:w-auto" placeholder="Rechercher par ID ou email" />
        <div class="flex gap-2">
          <button class="btn btn-primary" @click="load" :disabled="loading">Rechercher</button>
          <button class="btn" @click="reset" :disabled="loading">Réinitialiser</button>
        </div>
      </div>

      <div class="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.userId">
              <td class="font-mono text-xs sm:text-sm break-all">{{ u.userId }}</td>
              <td class="text-sm">{{ u.email }}</td>
              <td><span class="badge badge-outline">{{ u.role }}</span></td>
              <td>
                <button class="btn btn-error btn-sm" @click="remove(u.userId)" :disabled="loading">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!loading && users.length === 0" class="text-center py-8 text-base-content/70">Aucun utilisateur</div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>