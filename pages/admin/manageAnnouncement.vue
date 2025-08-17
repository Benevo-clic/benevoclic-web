<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import AdminHeader from '~/components/admin/AdminHeader.vue'
  import { useAnnouncement } from '~/composables/useAnnouncement'

  const { t } = useI18n()

  interface AnnouncementRow {
    _id: string
    nameEvent: string
    associationName: string
    status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED'
  }

  const announcement = useAnnouncement()

  const announcements = computed<AnnouncementRow[]>(
    () => (announcement.getAnnouncements.value || []) as unknown as AnnouncementRow[]
  )
  const displayed = ref<AnnouncementRow[]>([])
  const status = ref<'' | AnnouncementRow['status']>('')
  const loading = computed(() => announcement.loading.value)

  // Search by ID
  const searchId = ref('')
  const noResultMsg = ref('')

  // Edit modal state
  const isEditOpen = ref(false)
  const editable = ref<Partial<AnnouncementRow> | null>(null)

  async function load() {
    try {
      await announcement.fetchAllAnnouncements()
      displayed.value = announcements.value
      if (status.value) {
        displayed.value = displayed.value.filter(a => a.status === status.value)
      }
      noResultMsg.value = ''
    } catch (e) {
      displayed.value = []
    }
  }

  async function reset() {
    status.value = ''
    searchId.value = ''
    noResultMsg.value = ''
    await load()
  }

  async function searchById() {
    try {
      if (!searchId.value) {
        await load()
        return
      }
      const item = await announcement.fetchAnnouncementById(searchId.value)
      displayed.value = item ? [item as unknown as AnnouncementRow] : []
      if (!item) {
        noResultMsg.value = t('adminManageAnnouncement.no_result', { id: searchId.value })
      }
    } catch (e) {
      displayed.value = []
      noResultMsg.value = t('adminManageAnnouncement.no_result', { id: searchId.value })
    }
  }

  async function updateStatus(id: string, newStatus: AnnouncementRow['status']) {
    try {
      await announcement.updateStatus(id, newStatus)
      const row = displayed.value.find(a => a._id === id)
      if (row) {
        row.status = newStatus
      }
    } catch (e) {
      process.env.NODE_ENV !== 'production' &&
        console.error('Erreur mise à jour statut annonce:', e)
    }
  }

  function openEdit(a: AnnouncementRow) {
    editable.value = { ...a }
    isEditOpen.value = true
  }

  async function saveEdit() {
    if (!editable.value?._id) {
      return
    }
    try {
      await announcement.updateAnnouncement(
        editable.value._id as string,
        {
          nameEvent: editable.value.nameEvent,
          status: editable.value.status
        } as any
      )
      const row = displayed.value.find(a => a._id === editable.value?._id)
      if (row) {
        if (editable.value.nameEvent) {
          row.nameEvent = editable.value.nameEvent
        }
        if (editable.value.status) {
          row.status = editable.value.status as AnnouncementRow['status']
        }
      }
      isEditOpen.value = false
    } catch (e) {
      process.env.NODE_ENV !== 'production' && console.error('Erreur lors de la mise à jour:', e)
    }
  }

  async function remove(id: string) {
    if (!confirm(t('adminManageAnnouncement.confirm.delete'))) {
      return
    }
    try {
      await announcement.removeAnnouncement(id)
      displayed.value = displayed.value.filter(a => a._id !== id)
    } catch (e) {
      process.env.NODE_ENV !== 'production' && console.error('Erreur lors de la suppression:', e)
    }
  }

  onMounted(async () => {
    await load()
  })
</script>

<template>
  <div>
    <AdminHeader />
    <section class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 class="text-2xl font-bold mb-6">{{ t('adminManageAnnouncement.title') }}</h1>

      <div class="flex flex-col sm:flex-row gap-2 mb-4">
        <select v-model="status" class="select select-bordered select-sm w-full sm:w-48">
          <option value="">{{ t('adminManageAnnouncement.filters.all_statuses') }}</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <div class="flex gap-2">
          <button class="btn btn-primary btn-sm" :disabled="loading" @click="load">
            {{ t('adminManageAnnouncement.filters.filter') }}
          </button>
          <button class="btn btn-outline btn-sm" :disabled="loading" @click="reset">
            {{ t('adminManageAnnouncement.filters.reset') }}
          </button>
        </div>
        <div class="flex items-center gap-2 sm:ml-auto">
          <input
            v-model.trim="searchId"
            class="input input-bordered input-sm"
            :placeholder="t('adminManageAnnouncement.search.placeholder')"
            @keyup.enter="searchById"
          />
          <button class="btn btn-sm" :disabled="loading" @click="searchById">
            {{ t('adminManageAnnouncement.search.button') }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table class="table w-full">
          <thead>
            <tr>
              <th>{{ t('adminManageAnnouncement.table.headers.id') }}</th>
              <th>{{ t('adminManageAnnouncement.table.headers.name') }}</th>
              <th>{{ t('adminManageAnnouncement.table.headers.association') }}</th>
              <th>{{ t('adminManageAnnouncement.table.headers.status') }}</th>
              <th>{{ t('adminManageAnnouncement.table.headers.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in displayed" :key="a._id">
              <td class="font-mono text-xs sm:text-sm break-all">
                {{ a._id }}
              </td>
              <td class="text-sm">
                {{ a.nameEvent }}
              </td>
              <td class="text-sm">
                {{ a.associationName }}
              </td>
              <td>
                <span class="badge badge-outline">{{ a.status }}</span>
              </td>
              <td class="flex flex-wrap gap-2">
                <button class="btn btn-xs" @click="updateStatus(a._id, 'ACTIVE')">ACTIVE</button>
                <button class="btn btn-xs" @click="updateStatus(a._id, 'INACTIVE')">
                  INACTIVE
                </button>
                <button class="btn btn-xs" @click="updateStatus(a._id, 'COMPLETED')">
                  COMPLETED
                </button>
                <button class="btn btn-outline btn-xs" @click="openEdit(a)">
                  {{ t('adminManageAnnouncement.table.actions.edit') }}
                </button>
                <button class="btn btn-error btn-xs" @click="remove(a._id)">
                  {{ t('adminManageAnnouncement.table.actions.delete') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="!loading && displayed.length === 0"
          class="text-center py-8 text-base-content/70"
        >
          {{ noResultMsg || t('adminManageAnnouncement.empty') }}
        </div>
      </div>
    </section>

    <!-- Edit Modal -->
    <div v-if="isEditOpen" class="modal modal-open">
      <div class="modal-box max-w-xl">
        <h3 class="font-bold text-lg mb-4">{{ t('adminManageAnnouncement.modal.title') }}</h3>
        <div class="form-control mb-3">
          <label class="label"
            ><span class="label-text">{{ t('adminManageAnnouncement.modal.name') }}</span></label
          >
          <input v-model="editable!.nameEvent" class="input input-bordered" />
        </div>
        <div class="form-control mb-3">
          <label class="label"
            ><span class="label-text">{{ t('adminManageAnnouncement.modal.status') }}</span></label
          >
          <select v-model="editable!.status" class="select select-bordered">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
        <div class="modal-action">
          <button class="btn" @click="isEditOpen = false">
            {{ t('adminManageAnnouncement.modal.cancel') }}
          </button>
          <button class="btn btn-primary" @click="saveEdit">
            {{ t('adminManageAnnouncement.modal.save') }}
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="isEditOpen = false" />
    </div>
  </div>
</template>

<style scoped>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
