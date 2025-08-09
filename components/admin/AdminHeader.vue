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
              <NuxtLink
                :class="linkItemClass('/admin')"
                to="/admin"
              >
                {{ t("header.volunteer.home") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="linkItemClass('/admin/support')"
                to="/admin/support"
              >
                Support
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :class="linkItemClass('/admin/manageUser')"
                to="/admin/manageUser"
              >
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
        <NuxtLink
          to="/admin"
          class="font-semibold text-base-content whitespace-nowrap"
        >
          Benevoclic • Admin
        </NuxtLink>
      </div>

      <!-- Desktop menu -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <NuxtLink :class="linkItemClass('/admin')" to="/admin">
              {{
                t("admin.header.home")
              }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :class="linkItemClass('/admin/support')"
              to="/admin/support"
            >
              {{ t("admin.header.support") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :class="linkItemClass('/admin/manageUser')"
              to="/admin/manageUser"
            >
              {{ t("admin.header.users") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :class="linkItemClass('/admin/manageAnnouncement')"
              to="/admin/manageAnnouncement"
            >
              {{ t("admin.header.announcements") }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Right actions -->
      <div class="navbar-end gap-2">
        <button
          class="btn btn-sm btn-outline btn-error"
          :disabled="loading"
          @click="onLogout"
        >
          <span
            v-if="loading"
            class="loading loading-spinner loading-xs"
          />
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useRequestFetch } from '#app'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const $fetch = useRequestFetch()
const loading = ref(false)
const { t } = useI18n()

function linkItemClass (path: string) {
  const isActive = route.path === path
  return [isActive ? 'active font-medium' : '']
}

async function onLogout () {
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
