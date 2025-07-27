<template>
  <div>
    <Header />
    <main class="bg-base-200">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/header/Header.vue'
</script>
