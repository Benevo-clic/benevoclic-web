<template>
  <div class="bg-white min-h-screen">
    <Header />
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/header/Header.vue'
</script>