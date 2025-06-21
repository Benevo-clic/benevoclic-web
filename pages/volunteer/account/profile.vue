<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <AccountMenuVolunteer />
    </div>
    
    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">{{ $t('drawer-content.account.view_profile') }}</h1>
        
        <!-- Profile information -->
        <div class="space-y-6">
          <!-- Profile image and basic info -->
          <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div class="w-32 h-32 rounded-full overflow-hidden bg-base-300">
              <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <UserRound class="w-16 h-16 text-base-content opacity-50" />
              </div>
            </div>
            
            <div class="flex-1 text-center md:text-left">
              <h2 class="text-xl font-semibold text-base-content">{{ user?.firstName }} {{ user?.lastName }}</h2>
              <p class="text-base-content text-sm">
                {{ user?.birthDate ? calculateAge(user.birthDate) + ' ans' : 'Date de naissance non fournie' }}
              </p>
              <p class="text-base-content mt-2">{{ user?.bio || 'No bio provided' }}</p>
            </div>
          </div>
          
          <!-- Additional profile information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-base-200 p-4 rounded-lg">
              <h3 class="font-medium mb-2 text-base-content">Contact Information</h3>
              <p class="text-base-content"><strong>Email:</strong> {{ auth.user.value?.email }}</p>
              <p class="text-base-content"><strong>Phone:</strong> {{ user?.phone || 'Not provided' }}</p>
            </div>
            
            <div class="bg-base-200 p-4 rounded-lg">
              <h3 class="font-medium mb-2 text-base-content">Location</h3>
              <p class="text-base-content"><strong>City:</strong> {{ user?.city || 'Not provided' }}</p>
              <p class="text-base-content"><strong>Postal Code:</strong> {{ user?.postalCode || 'Not provided' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UserRound } from 'lucide-vue-next'
import { useUser } from '~/composables/auth/useUser'
import { useVolunteerAuth } from '~/composables/auth/volunteerAuth'
import AccountMenuVolunteer from '~/components/account/AccountMenuVolunteer.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const auth = useUser()
const { volunteer: user } = useVolunteerAuth()

const profileImageUrl = computed(() => {
  const img = auth.user.value?.imageProfile
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
})

function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

</script>