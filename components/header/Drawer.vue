<script setup lang="ts">
import NavigationActions from "~/components/header/NavigationActions.vue";
import NavigationActionsOptions from "~/components/header/NavigationActionsOptions.vue";

const props = defineProps<{
  isAuthenticated: boolean
  menuOpen: boolean
}>()

</script>

<template>
  <transition name="fade">
    <div v-if="props.menuOpen" class="drawer-overlay" @click="$emit('closeDrawer')">
    </div>
  </transition>
  <transition name="slide">
    <div v-if="props.menuOpen" class="mobile-drawer">

      <NavigationActions />
      <NavigationActionsOptions :is-authenticated="props.isAuthenticated" />

    </div>
  </transition>
</template>

<style scoped>
</style>