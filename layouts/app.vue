<template>
  <div class="flex flex-col min-h-screen bg-base-200">
    <Header :options-open="true"/>
    <div class="flex flex-1">
      <!-- Drawer for desktop (hidden on mobile) -->
      <div class="hidden md:block w-64 bg-base-100 shadow-lg pt-4">
        <DrawerAppContent
          :is-authenticated="isAuthenticated"
          :menu-open="true"
          :display-profile="false"
          class="h-full"
        />
      </div>

      <!-- Main content -->
      <main class="flex-1 p-6 overflow-auto max-h-[calc(100vh-150px)]">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useUser } from '~/composables/auth/useUser'
import Header from '~/components/header/Header.vue'
import DrawerAppContent from '~/components/header/drawer/components/DrawerAppContent.vue'

const { isAuthenticated } = useUser()
</script>
