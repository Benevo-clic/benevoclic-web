<template>
  <div>
    <Header />
    <main class="bg-base-200 max-h-[calc(100vh-4rem)]">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/header/Header.vue'
</script>
