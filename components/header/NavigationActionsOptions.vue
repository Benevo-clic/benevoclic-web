<script setup lang="ts">

import { Bell, Heart, HelpCircle,ChevronDown } from 'lucide-vue-next'


const props = defineProps<
    {
      isAuthenticated: boolean
    }
>()

</script>

<template>
  <div v-if="isAuthenticated" class="nav-authenticated">
    <NuxtLink to="#" class="nav-link">
      <span class="nav-icon-label">
        Mes recherches
        <ChevronDown />
      </span>
    </NuxtLink>

    <NuxtLink to="#" class="nav-link">
      Favoris
    </NuxtLink>
  </div>

  <div v-else class="nav-unauthenticated">
    <NuxtLink to="#">
      <Bell class="icon" />
    </NuxtLink>
    <NuxtLink to="#">
      <Heart class="icon" />
    </NuxtLink>
    <NuxtLink to="#">
      <HelpCircle class="icon" />
    </NuxtLink>
  </div>
</template>

<style scoped>
.nav-authenticated {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  .nav-link {
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    color: inherit;

    .nav-icon-label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
}

.nav-unauthenticated {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;

  .icon {
    width: 2rem;
    height: 2rem;
  }
}

</style>