<template>
  <div >
    <HeaderAuth/>
    <main class="bg-gray-50 min-h-screen">
      <slot />
    </main>
  </div>
</template>

<script setup>
import HeaderAuth from '~/components/header/HeaderAuth.vue'
</script>