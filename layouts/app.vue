<template>
  <div class="app">
    <div v-if="isLoading" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else class="flex flex-col h-screen bg-base-200">
      <Header :options-open="true"/>
      <div class="flex flex-1 overflow-hidden">
        <div class="hidden md:block w-64 bg-base-100 shadow-lg flex-shrink-0">
          <DrawerAppContentVolunteer
              :is-authenticated="!isAuthenticated"
              :menu-open="true"
              :display-profile="false"
              class="h-full"
              v-if="userRole === 'VOLUNTEER'"
          />
          <DrawerAppContentAssociation
              :is-authenticated="!isAuthenticated"
              :menu-open="true"
              :display-profile="false"
              class="h-full"
              v-else-if="userRole === 'ASSOCIATION'"
          />
        </div>

        <main class="flex-1 p-1 overflow-auto">
          <slot />
        </main>
      </div>
    </div>
    
    <CookieConsent />
    
    <GlobalPermissionAlert />
  </div>
</template>

<script setup>
import { useUser } from '~/composables/auth/useUser'
import Header from '~/components/header/Header.vue'
import CookieConsent from '~/components/CookieConsent.vue'
import GlobalPermissionAlert from '~/components/utils/GlobalPermissionAlert.vue'
import {onMounted, ref} from 'vue'
import DrawerAppContentVolunteer from '~/components/header/drawer/components/volunteer/DrawerAppContentVolunteer.vue'
import DrawerAppContentAssociation
  from "~/components/header/drawer/components/association/DrawerAppContentAssociation.vue";

const { isAuthenticated, userRole , initializeUser } = useUser()
const isLoading = ref(true)

onMounted(async () => {
  await initializeUser()
  isLoading.value = false
})

</script>
