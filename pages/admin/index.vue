<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRequestFetch } from '#app'
  import AdminHeader from '~/components/admin/AdminHeader.vue'
  import { useAdmin } from '~/composables/useAdmin'
  import { useAnnouncement } from '~/composables/useAnnouncement'

  const { t } = useI18n()

  const $fetch = useRequestFetch()
  const admin = useAdmin()
  const announcement = useAnnouncement()

  const loading = ref(false)
  const usersCount = ref<number | null>(null)
  const supportStats = ref<{
    totalReports?: number
    pendingReports?: number
    resolvedReports?: number
  } | null>(null)
  const announcementsCount = ref<number | null>(null)
  const errorMsg = ref('')

  async function loadOverview() {
    loading.value = true
    errorMsg.value = ''
    try {
      // Utilisateurs (pas de composable pour la liste globale → API admin)
      try {
        const users = await $fetch<any[]>('/api/admin/users', {
          method: 'GET',
          credentials: 'include'
        })
        usersCount.value = Array.isArray(users) ? users.length : null
      } catch (e) {
        usersCount.value = null
      }

      // Support (via composable useAdmin)
      try {
        await admin.fetchReports()
        const reports = admin.reports.value
        supportStats.value = {
          totalReports: reports.length,
          pendingReports: reports.filter(r => r.status === 'PENDING').length,
          resolvedReports: reports.filter(r => r.status === 'RESOLVED').length
        }
      } catch (e) {
        supportStats.value = null
      }

      // Annonces (via composable useAnnouncement)
      try {
        await announcement.fetchAllAnnouncements()
        announcementsCount.value = announcement.getAnnouncements.value?.length ?? null
      } catch (e) {
        announcementsCount.value = null
      }
    } catch (e: any) {
      errorMsg.value = e?.message || t('adminIndex.error.loading')
    } finally {
      loading.value = false
    }
  }

  onMounted(loadOverview)
</script>
<template>
  <div class="min-h-screen bg-base-200">
    <AdminHeader />

    <!-- Hero / Header -->
    <section class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">
      <div class="hero bg-base-100 rounded-xl shadow-sm">
        <div class="hero-content flex-col lg:flex-row gap-6 lg:gap-10">
          <div>
            <h1 class="text-3xl lg:text-4xl font-bold">{{ t('adminIndex.hero.title') }}</h1>
            <p class="py-2 text-base-content/70">
              {{ t('adminIndex.hero.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="stat bg-base-100 rounded-xl shadow">
          <div class="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline-block w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div class="stat-title">{{ t('adminIndex.stats.users.title') }}</div>
          <div class="stat-value">
            {{ usersCount ?? '—' }}
          </div>
          <div class="stat-desc">{{ t('adminIndex.stats.users.description') }}</div>
        </div>

        <div class="stat bg-base-100 rounded-xl shadow">
          <div class="stat-figure text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline-block w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="stat-title">{{ t('adminIndex.stats.support.title') }}</div>
          <div class="stat-value">
            {{ supportStats?.totalReports ?? '—' }}
          </div>
          <div class="stat-desc">
            {{ t('adminIndex.stats.support.pending') }}: {{ supportStats?.pendingReports ?? '—' }} •
            {{ t('adminIndex.stats.support.resolved') }}:
            {{ supportStats?.resolvedReports ?? '—' }}
          </div>
        </div>

        <div class="stat bg-base-100 rounded-xl shadow">
          <div class="stat-figure text-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline-block w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="stat-title">{{ t('adminIndex.stats.announcements.title') }}</div>
          <div class="stat-value">
            {{ announcementsCount ?? '—' }}
          </div>
          <div class="stat-desc">{{ t('adminIndex.stats.announcements.description') }}</div>
        </div>
      </div>

      <div v-if="loading" class="mt-4">
        <span class="loading loading-dots loading-md" />
      </div>
      <div v-if="errorMsg" class="alert alert-error mt-4">
        <span>{{ errorMsg }}</span>
      </div>
    </section>
  </div>
</template>
<style scoped lang="scss"></style>
