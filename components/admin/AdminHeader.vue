<template>
  <header class="sticky top-0 z-50 bg-base-100 border-b border-base-300/70">
    <div class="navbar max-w-screen-xl mx-auto px-2 sm:px-4">
      <!-- Mobile menu button -->
      <div class="navbar-start gap-2">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden" aria-label="Menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-56"
          >
            <li>
              <NuxtLink :class="linkItemClass('/admin')" to="/admin">
                {{ t('header.volunteer.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :class="linkItemClass('/admin/support')" to="/admin/support">
                Support
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :class="linkItemClass('/admin/manageUser')" to="/admin/manageUser">
                Utilisateurs
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="linkItemClass('/admin/manageAnnouncement')"
                to="/admin/manageAnnouncement"
              >
                Annonces
              </NuxtLink>
            </li>
          </ul>
        </div>
        <NuxtLink to="/admin" class="font-semibold text-base-content whitespace-nowrap">
          Benevoclic • Admin
        </NuxtLink>
      </div>

      <!-- Desktop menu -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <NuxtLink :class="linkItemClass('/admin')" to="/admin">
              {{ t('admin.header.home') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :class="linkItemClass('/admin/support')" to="/admin/support">
              {{ t('admin.header.support') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :class="linkItemClass('/admin/manageUser')" to="/admin/manageUser">
              {{ t('admin.header.users') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :class="linkItemClass('/admin/manageAnnouncement')"
              to="/admin/manageAnnouncement"
            >
              {{ t('admin.header.announcements') }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Right actions -->
      <div class="navbar-end gap-2">
        <!-- Notifications bell -->
        <div class="dropdown dropdown-end">
          <button class="btn btn-ghost btn-circle relative" tabindex="0" aria-label="Notifications">
            <Bell class="w-5 h-5" />
            <span
              v-if="unreadCount > 0"
              class="badge badge-error badge-xs absolute -top-1 -right-1"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>
          <div tabindex="0" class="dropdown-content card card-compact w-80 shadow bg-base-100 z-50">
            <div class="card-body p-0">
              <!-- Header -->
              <div class="flex justify-between items-center p-3 border-b">
                <span class="font-semibold">{{ t('adminNotifications.title') }}</span>
                <button v-if="unreadCount > 0" class="btn btn-xs btn-ghost" @click="markAllAsRead">
                  {{ t('adminNotifications.markAllRead') }}
                </button>
              </div>
              <!-- List -->
              <ul class="max-h-72 overflow-y-auto divide-y">
                <li v-if="notifications.length === 0" class="p-4 text-center text-sm opacity-60">
                  {{ t('adminNotifications.empty') }}
                </li>
                <li
                  v-for="n in notifications"
                  :key="n.id"
                  :class="[
                    'p-3 cursor-pointer hover:bg-base-200 transition',
                    !n.isRead ? 'bg-base-200/50' : '',
                  ]"
                  @click="handleNotificationClick(n)"
                >
                  <div class="flex gap-2 items-start">
                    <span
                      :class="
                        n.type === 'NEW_ASSOCIATION'
                          ? 'badge badge-info badge-sm'
                          : 'badge badge-warning badge-sm'
                      "
                    >
                      {{ t(`adminNotifications.types.${n.type}`) }}
                    </span>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm truncate">{{ n.message }}</p>
                      <p class="text-xs opacity-50">{{ formatDate(n.createdAt) }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button class="btn btn-sm btn-outline btn-error" :disabled="loading" @click="onLogout">
          <span v-if="loading" class="loading loading-spinner loading-xs" />
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { useRequestFetch } from '#app'
  import { ref, onMounted } from 'vue'
  import { Bell } from 'lucide-vue-next'
  import { useNotifications, type Notification } from '~/composables/useNotifications'

  const route = useRoute()
  const router = useRouter()
  const $fetch = useRequestFetch()
  const loading = ref(false)
  const { t } = useI18n()

  const { notifications, unreadCount, markAsRead, markAllAsRead, init } = useNotifications()

  onMounted(() => {
    init()
  })

  function linkItemClass(path: string) {
    const isActive = route.path === path
    return [isActive ? 'active font-medium' : '']
  }

  async function handleNotificationClick(n: Notification) {
    if (!n.isRead) {
      await markAsRead(n.id)
    }
    if (n.redirectUrl) {
      router.push(n.redirectUrl)
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffH = Math.floor(diffMin / 60)
    const diffD = Math.floor(diffH / 24)

    if (diffMin < 1) return "À l'instant"
    if (diffMin < 60) return `Il y a ${diffMin} min`
    if (diffH < 24) return `Il y a ${diffH} h`
    return `Il y a ${diffD} j`
  }

  async function onLogout() {
    loading.value = true
    try {
      await $fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (e) {
      // ignore
    } finally {
      loading.value = false
      router.push('/')
    }
  }
</script>
