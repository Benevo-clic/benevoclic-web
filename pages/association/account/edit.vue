<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-base-200 py-8">
    <div class="w-full max-w-2xl mx-auto px-2  p-6">
      <h1 class="text-3xl font-bold mb-8 text-center text-base-content">{{ t('drawer-content.account.edit_profile') }}</h1>

      <!-- Alert messages -->
      <div v-if="alertStatus === 'success'" role="alert" class="alert alert-success mb-4 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ alertMessage }}</span>
        <button class="btn btn-sm btn-ghost" @click="alertStatus = null">×</button>
      </div>
      <div v-if="alertStatus === 'error'" role="alert" class="alert alert-error mb-4 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ alertMessage }}</span>
        <button class="btn btn-sm btn-ghost" @click="alertStatus = null">×</button>
      </div>

      <!-- Avatar/logo -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-32 h-32 rounded-full overflow-hidden bg-base-300 relative group mb-2 shadow-lg border-4 border-base-200">
          <!-- Loading spinner -->
          <div v-if="isImageUploading" class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
            <div class="loading loading-spinner loading-lg text-primary"></div>
          </div>

          <!-- Profile image -->
          <img v-if="profileImageUrl" :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <UserRound class="w-16 h-16 text-base-content opacity-50" />
          </div>

          <!-- Upload overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <label for="profile-image" class="cursor-pointer text-white text-sm font-medium flex flex-col items-center">
              <Upload class="w-6 h-6 mx-auto mb-1" />
              Changer
            </label>
            <input id="profile-image" type="file" accept="image/*" class="hidden" @change="handleImageChange" />
          </div>
        </div>
        <span class="text-base-content/70 text-sm">Logo de l'association</span>
      </div>

      <!-- Edit profile form -->
      <form @submit.prevent="saveProfile" class="space-y-6">
        <div class="bg-base-100 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control w-full">
            <label class="label"><span class="label-text text-base-content">{{ t('auth.association.name') || 'Association Name' }}</span></label>
            <input type="text" v-model="form.associationName" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label"><span class="label-text text-base-content">{{ t('auth.association.type') || 'Type' }}</span></label>
            <input type="text" v-model="form.type" class="input input-bordered w-full" />
          </div>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control w-full">
            <label class="label"><span class="label-text text-base-content">{{ t('auth.association.phone') || 'Phone' }}</span></label>
            <input type="tel" v-model="form.phone" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label"><span class="label-text text-base-content">{{ t('auth.association.country') || 'Country' }}</span></label>
            <input type="text" v-model="form.country" class="input input-bordered w-full" />
          </div>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control w-full">
            <label class="label"><span class="label-text text-base-content">{{ t('auth.association.city') || 'City' }}</span></label>
            <input type="text" v-model="form.city" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label"><span class="label-text text-base-content">{{ t('auth.association.postal_code') || 'Postal Code' }}</span></label>
            <input type="text" v-model="form.postalCode" class="input input-bordered w-full" />
          </div>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-6">
          <div class="form-control w-full">
            <label class="label"><span class="label-text text-base-content">{{ t('auth.association.bio') || 'Bio' }}</span></label>
            <textarea v-model="form.bio" class="textarea textarea-bordered h-24 w-full"></textarea>
          </div>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary btn-wide" :disabled="!isFormChanged">
            <span v-if="isImageUploading" class="loading loading-spinner loading-xs mr-2"></span>
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UserRound, Upload } from 'lucide-vue-next'
import { useUser } from '~/composables/auth/useUser'

import { useI18n } from 'vue-i18n'
import { isEqual } from 'lodash'
import {useAssociationAuth} from "~/composables/useAssociation";

const { t } = useI18n()

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const auth = useUser()
const associationAuth = useAssociationAuth()

const form = ref({
  associationName: '',
  phone: '',
  city: '',
  postalCode: '',
  bio: '',
  type: '',
  country: '',
})

const initialForm = ref({
  associationName: '',
  phone: '',
  city: '',
  postalCode: '',
  bio: '',
  type: '',
  country: '',
})

const alertStatus = ref<'success' | 'error' | null>(null)
const alertMessage = ref('')
const isImageUploading = ref(false)

let profileImageUrl = computed(() => {
  const img = auth.user.value?.imageProfile
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
})

const isFormChanged = computed(() => {
  return !isEqual(form.value, initialForm.value)
})

onMounted(async () => {
  await auth.fetchUser()

  if (!associationAuth.association.value) {
    await associationAuth.getAssociationInfo()
  }

  if (associationAuth.association.value) {

    const associationName = associationAuth.association.value.associationName || ''
    const phone = associationAuth.association.value.phone || ''
    const city = associationAuth.association.value.city || ''
    const postalCode = associationAuth.association.value.postalCode || ''
    const bio = associationAuth.association.value.bio || ''
    const type = associationAuth.association.value.type || ''
    const country = associationAuth.association.value.country || ''

    form.value.associationName = associationName
    form.value.phone = phone
    form.value.city = city
    form.value.postalCode = postalCode
    form.value.bio = bio
    form.value.type = type
    form.value.country = country

    initialForm.value.associationName = associationName
    initialForm.value.phone = phone
    initialForm.value.city = city
    initialForm.value.postalCode = postalCode
    initialForm.value.bio = bio
    initialForm.value.type = type
    initialForm.value.country = country
  }
})

function handleImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    isImageUploading.value = true

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64 = reader.result as string
        await auth.updateProfile(base64)
        alertStatus.value = 'success'
        alertMessage.value = t('drawer-content.account.profile_updated_success') || 'Profile image updated successfully'
        setTimeout(() => {
          alertStatus.value = null
        }, 10000)
        profileImageUrl = computed(() => {
          return base64
        })
      } catch (error) {
        // Show error alert
        alertStatus.value = 'error'
        alertMessage.value = t('drawer-content.account.profile_update_error') || 'Error updating profile image. Please try again.'
        console.error('Error updating profile image:', error)
        // Auto-hide alert after 10 seconds
        setTimeout(() => {
          alertStatus.value = null
        }, 10000)
      } finally {
        // Reset loading state
        isImageUploading.value = false
      }
    }
    reader.readAsDataURL(file)
  }
}

async function saveProfile() {
  try {
    await associationAuth.updateAssociation(form.value, auth.user.value?.userId)

    // Update initialForm to match the new form values
    initialForm.value = { ...form.value }

    // Show success alert
    alertStatus.value = 'success'
    alertMessage.value = t('drawer-content.account.profile_updated_success') || 'Profile updated successfully'
    // Auto-hide alert after 10 seconds
    setTimeout(() => {
      alertStatus.value = null
    }, 10000)
  } catch (error) {
    // Show error alert
    alertStatus.value = 'error'
    alertMessage.value = t('drawer-content.account.profile_update_error') || 'Error updating profile. Please try again.'
    console.error('Error updating profile:', error)
    // Auto-hide alert after 10 seconds
    setTimeout(() => {
      alertStatus.value = null
    }, 10000)
  }
}
</script>
