<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <AccountMenu />
    </div>
    
    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">{{ $t('drawer-content.account.edit_profile') }}</h1>
        
        <!-- Edit profile form -->
        <form @submit.prevent="saveProfile" class="space-y-6">
          <!-- Profile image -->
          <div class="flex flex-col items-center md:items-start gap-4">
            <div class="w-32 h-32 rounded-full overflow-hidden bg-base-300 relative group">
              <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <UserRound class="w-16 h-16 text-base-content opacity-50" />
              </div>
              
              <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label for="profile-image" class="cursor-pointer text-white text-sm font-medium">
                  <Upload class="w-6 h-6 mx-auto mb-1" />
                  Change
                </label>
                <input id="profile-image" type="file" accept="image/*" class="hidden" @change="handleImageChange" />
              </div>
            </div>
          </div>
          
          <!-- Personal information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text text-base-content">{{ $t('auth.volunteer.first_name') }}</span>
              </label>
              <input type="text" v-model="form.firstName" class="input input-bordered w-full" />
            </div>
            
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text text-base-content">{{ $t('auth.volunteer.name') }}</span>
              </label>
              <input type="text" v-model="form.lastName" class="input input-bordered w-full" />
            </div>
            
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text text-base-content">{{ $t('auth.volunteer.phone') }}</span>
              </label>
              <input type="tel" v-model="form.phone" class="input input-bordered w-full" />
            </div>
            
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text text-base-content">{{ $t('auth.volunteer.birthdate') }}</span>
              </label>
              <input type="date" v-model="form.birthdate" class="input input-bordered w-full" />
            </div>
            
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text text-base-content">{{ $t('auth.volunteer.city') }}</span>
              </label>
              <input type="text" v-model="form.city" class="input input-bordered w-full" />
            </div>
            
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text text-base-content">{{ $t('auth.volunteer.postal_code') }}</span>
              </label>
              <input type="text" v-model="form.postalCode" class="input input-bordered w-full" />
            </div>
          </div>
          
          <!-- Bio -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base-content">{{ $t('auth.volunteer.bio') }}</span>
            </label>
            <textarea v-model="form.bio" class="textarea textarea-bordered h-24 w-full"></textarea>
          </div>
          
          <!-- Submit button -->
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserRound, Upload } from 'lucide-vue-next'
import { useUser } from '~/composables/auth/useUser'
import { useVolunteerAuth } from '~/composables/auth/volunteerAuth'
import AccountMenu from '~/components/account/AccountMenu.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const auth = useUser()
const { volunteer: user, updateVolunteer } = useVolunteerAuth()

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  birthdate: '',
  city: '',
  postalCode: '',
  bio: ''
})

const profileImageUrl = computed(() => {
  const img = auth.user.value?.imageProfile
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
})

onMounted(() => {
  if (user.value) {
    form.value.firstName = user.value.firstName || ''
    form.value.lastName = user.value.lastName || ''
    form.value.phone = user.value.phone || ''
    form.value.birthdate = user.value.birthdate || ''
    form.value.city = user.value.city || ''
    form.value.postalCode = user.value.postalCode || ''
    form.value.bio = user.value.bio || ''
  }
})

function handleImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Handle image upload logic here
    console.log('Image selected:', file)
  }
}

async function saveProfile() {
  try {
    // Call API to update profile
    await updateVolunteer(form.value)
    // Show success message
  } catch (error) {
    // Handle error
    console.error('Error updating profile:', error)
  }
}
</script>