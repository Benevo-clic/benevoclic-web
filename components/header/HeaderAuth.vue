<template>
  <header class="relative flex items-center h-16 bg-base-100 shadow-sm">
    <!-- Bouton retour à gauche -->
    <button
        @click="handleLogoutUser"
        class="btn btn-ghost btn-square absolute left-4 bg-primary shadow-sm"
        aria-label="Retour"
    >
      <ArrowLeft class="w-6 h-6" />
    </button>

    <NuxtLink to="/" class="mx-auto w-14">
      <img 
        src="/logo_benevoclic.png" 
        alt="Logo Benevoclic" 
        class="w-full h-auto"
        width="120"
        height="40"
        loading="eager"
        decoding="sync"
      />
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import {useUser} from "~/composables/auth/useUser";

const { logout: authLogout, initializeUser } = useUser()

onMounted(async () => {
  try {
    await initializeUser()
  } catch (error) {
    console.error('Error initializing user:', error)
  }
})


async function handleLogoutUser() {
  await authLogout()
}
</script>
