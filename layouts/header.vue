<template>
  <div class="relative min-h-screen">
    <Header />
    <div
        v-if="isLoading"
        class="fixed inset-0 bg-base-200 bg-opacity-80 z-[1000] flex items-center justify-center"
    >
      <div class="loading loading-spinner loading-xxl"></div>
    </div>
    <main
        v-else
        class="pt-16 bg-base-200 min-h-[calc(100vh-4rem)]"
        :class="{ 'opacity-50': isLoading }"
    >
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/header/Header.vue'
import { onMounted } from 'vue';
import {useAnnouncement} from "#imports"

const isLoading = ref(true);
const announcement = useAnnouncement();

onMounted(async () => {
  await announcement.fetchAllAnnouncements();
  isLoading.value = false;
});

</script>
