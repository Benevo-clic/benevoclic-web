<template>
  <div class="flex flex-col min-h-screen bg-base-200">
    <Header :options-open="true"/>
    <div class="flex flex-1">
      <!-- Drawer for desktop (hidden on mobile) -->
      <div class="hidden md:block w-64 bg-base-100 shadow-lg pt-4">
        <DrawerAppContentVolunteer
          :is-authenticated="isAuthenticated"
          :menu-open="true"
          :display-profile="false"
          class="h-full"
          v-if="userRole === 'VOLUNTEER'"
        />
        <DrawerAppContentAssociation
          :is-authenticated="isAuthenticated"
          :menu-open="true"
          :display-profile="false"
          class="h-full"
          v-else-if="userRole === 'ASSOCIATION'"
        />
      </div>

      <!-- Main content -->
      <main class="flex-1 p-1 overflow-auto max-h-[calc(100vh-4rem)]">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useUser } from '~/composables/auth/useUser'
import Header from '~/components/header/Header.vue'
import DrawerAppContentVolunteer from '~/components/header/drawer/components/volunteer/DrawerAppContentVolunteer.vue'
import DrawerAppContentAssociation
  from "~/components/header/drawer/components/association/DrawerAppContentAssociation.vue";

const { isAuthenticated, userRole } = useUser()
</script>
