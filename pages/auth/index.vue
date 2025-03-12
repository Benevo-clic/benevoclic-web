<script setup lang="ts">

definePageMeta({
  middleware: ['guest']
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 class="text-4xl font-bold mb-8">Bienvenue</h1>
    
    <div class="space-y-4">
      <NuxtLink 
        to="/auth/login"
        class="block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Se connecter
      </NuxtLink>
      
      <NuxtLink 
        to="/auth/register"
        class="block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        S'inscrire
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
