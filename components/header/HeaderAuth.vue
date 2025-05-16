<template>
  <header class="relative flex items-center h-16 bg-white shadow-sm">
    <!-- Bouton retour à gauche -->
    <button
        @click="handleLogoutUser"
        class="btn btn-ghost btn-square absolute left-4 bg-primary shadow-sm"
        aria-label="Retour"
    >
      <ArrowLeft class="w-6 h-6" />
    </button>

    <NuxtLink to="/" class="mx-auto w-24">
      <img src="/logo.png" alt="Logo" class="w-full h-auto" />
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import {useUser} from "~/composables/auth/useUser";

const { logout: authLogout } = useUser()

function handleLogoutUser() {
  authLogout()
}
</script>
