<script setup lang="ts">
import Footer from './layouts/footer.vue';
import CookieConsent from './components/CookieConsent.vue';
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
    <Footer />
    <CookieConsent />
  </NuxtLayout>
</template>
