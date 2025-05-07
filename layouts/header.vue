

<template>
  <div>
    <Header />
    <main class="p-4 bg-gray-50 min-h-screen">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/header/Header.vue'
</script>