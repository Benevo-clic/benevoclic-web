<template>
  <div class="min-h-screen bg-base-200">
    <div class="bg-base-100 shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-base-content">Dashboard Admin</h1>
              <p class="text-base-content/70">Gestion de la plateforme</p>
            </div>
          </div>
          <button @click="logout" class="btn btn-outline btn-error">Déconnexion</button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-base-100 rounded-xl shadow-lg p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-base-content">{{ stats.totalReports }}</p>
              <p class="text-base-content/70">Tickets de support</p>
            </div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl shadow-lg p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-base-content">{{ stats.pendingReports }}</p>
              <p class="text-base-content/70">En attente</p>
            </div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl shadow-lg p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-base-content">{{ stats.resolvedReports }}</p>
              <p class="text-base-content/70">Résolus</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-base-100 rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-base-content">Tickets de support</h2>
          <button @click="refreshReports" class="btn btn-primary btn-sm" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            Actualiser
          </button>
        </div>

        <div class="flex gap-4 mb-6">
          <select v-model="filter.status" class="select select-bordered select-sm">
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="RESOLVED">Résolu</option>
            <option value="REJECTED">Rejeté</option>
          </select>

          <select v-model="filter.type" class="select select-bordered select-sm">
            <option value="">Tous les types</option>
            <option value="ANNOUNCEMENT">Annonce</option>
            <option value="TECHNICAL">Technique</option>
            <option value="USER_FEEDBACK">Feedback</option>
            <option value="OTHER">Autre</option>
          </select>

          <div class="flex items-center gap-2 ml-auto">
            <input
              v-model.trim="searchId"
              @keyup.enter="searchById"
              class="input input-bordered input-sm"
              placeholder="Rechercher par ID"
            />
            <button class="btn btn-sm" @click="searchById" :disabled="loading">Chercher</button>
            <button class="btn btn-outline btn-sm" @click="resetSearch" :disabled="loading">Réinitialiser</button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Catégorie</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in filteredReports" :key="report._id">
                <td class="font-mono text-sm">{{ report._id?.slice(-8) }}</td>
                <td><span class="badge badge-outline">{{ report.type }}</span></td>
                <td>{{ report.category }}</td>
                <td class="max-w-xs truncate">{{ report.description }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(report.status)">{{ report.status }}</span>
                </td>
                <td>{{ formatDate(report.createdAt) }}</td>
                <td>
                  <button @click="viewReport(report)" class="btn btn-sm btn-primary">Voir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredReports.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-base-content/60">{{ noResultMsg || 'Aucun ticket trouvé' }}</p>
        </div>
      </div>

      <div v-if="selectedReport" class="modal modal-open">
        <div class="modal-box max-w-4xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-base-content">Ticket #{{ selectedReport._id?.slice(-8) }}</h3>
            <button @click="selectedReport = null" class="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold mb-2">Informations</h4>
                <div class="space-y-2 text-sm">
                  <div><strong>Type:</strong> {{ selectedReport.type }}</div>
                  <div><strong>Catégorie:</strong> {{ selectedReport.category }}</div>
                  <div><strong>Statut:</strong>
                    <span class="badge ml-2" :class="getStatusBadgeClass(selectedReport.status)">
                      {{ selectedReport.status }}
                    </span>
                  </div>
                  <div><strong>Date:</strong> {{ formatDate(selectedReport.createdAt) }}</div>
                </div>
              </div>

              <div>
                <h4 class="font-semibold mb-2">Utilisateur</h4>
                <div class="space-y-2 text-sm">
                  <div><strong>Email:</strong> {{ selectedReport.userEmail || 'Non renseigné' }}</div>
                  <div><strong>Page:</strong> {{ selectedReport.pageUrl || 'Non renseigné' }}</div>
                  <div><strong>Navigateur:</strong> {{ selectedReport.browserInfo || 'Non renseigné' }}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-semibold mb-2">Description</h4>
              <div class="bg-base-200 rounded-lg p-4">{{ selectedReport.description }}</div>
            </div>

            <div class="flex gap-2">
              <button @click="updateStatus(selectedReport._id, 'IN_PROGRESS')" class="btn btn-warning btn-sm" :disabled="selectedReport.status === 'IN_PROGRESS'">Marquer en cours</button>
              <button @click="updateStatus(selectedReport._id, 'RESOLVED')" class="btn btn-success btn-sm" :disabled="selectedReport.status === 'RESOLVED'">Marquer résolu</button>
              <button @click="updateStatus(selectedReport._id, 'REJECTED')" class="btn btn-neutral btn-sm" :disabled="selectedReport.status === 'REJECTED'">Rejeter</button>
            </div>
          </div>
        </div>
        <div class="modal-backdrop" @click="selectedReport = null"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore, type SupportReport } from '~/stores/admin/admin.store'

const router = useRouter()
const admin = useAdminStore()

const loading = computed(() => admin.loading)
const reports = computed<SupportReport[]>(() => admin.reports)
const selectedReport = ref<SupportReport | null>(null)
const stats = ref({ totalReports: 0, pendingReports: 0, resolvedReports: 0 })

const filter = ref<{ status: SupportReport['status'] | ''; type: SupportReport['type'] | '' }>({ status: '', type: '' })
const searchId = ref('')
const noResultMsg = ref<string>('')

const filteredReports = computed<SupportReport[]>(() => {
  let list = reports.value
  if (filter.value.status) list = list.filter(r => r.status === filter.value.status)
  if (filter.value.type) list = list.filter(r => r.type === filter.value.type)
  return list
})

async function loadReports() {
  await admin.fetchReports()
  noResultMsg.value = ''
  updateStats()
}

function updateStats() {
  stats.value.totalReports = reports.value.length
  stats.value.pendingReports = reports.value.filter(r => r.status === 'PENDING').length
  stats.value.resolvedReports = reports.value.filter(r => r.status === 'RESOLVED').length
}

function refreshReports() {
  loadReports()
}

function viewReport(report: SupportReport) {
  selectedReport.value = report
}

async function updateStatus(reportId: string, newStatus: SupportReport['status']) {
  try {
    await admin.updateReportStatus(reportId, newStatus)
    if (selectedReport.value && selectedReport.value._id === reportId) {
      selectedReport.value.status = newStatus
    }
    updateStats()
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
  }
}

async function searchById() {
  try {
    if (!searchId.value) {
      await loadReports()
      return
    }
    const report = await admin.fetchReportById(searchId.value)
    // Remplacer la liste par le résultat unique
    admin.reports = report ? [report] : []
    updateStats()
    if (!report) {
      noResultMsg.value = `Aucun résultat pour l'ID ${searchId.value}`
      console.warn('Ticket non trouvé pour ID:', searchId.value)
    }
  } catch (e) {
    // Si 404 ou autre erreur: afficher aucun résultat
    admin.reports = []
    updateStats()
    noResultMsg.value = `Aucun résultat pour l'ID ${searchId.value}`
  }
}

function resetSearch() {
  searchId.value = ''
  noResultMsg.value = ''
  loadReports()
}

function getStatusBadgeClass(status: SupportReport['status']) {
  switch (status) {
    case 'PENDING':
      return 'badge-warning'
    case 'IN_PROGRESS':
      return 'badge-info'
    case 'RESOLVED':
      return 'badge-success'
    case 'REJECTED':
      return 'badge-neutral'
    default:
      return 'badge-primary'
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

async function logout() {
  try {
    await $fetch('/api/user/logout', { method: 'POST' })
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  } finally {
    await router.push('/')
  }
}

onMounted(() => {
  loadReports()
})

definePageMeta({
  middleware: ['auth']
})
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); }
.modal { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; }
.modal-box { background: var(--fallback-b1,oklch(var(--b1)/1)); border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1); max-height: 90vh; overflow-y: auto; }
</style> 