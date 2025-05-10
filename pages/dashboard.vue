<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <button
              @click="auth.removeUser"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            supprimer mon compte
          </button>
        </div>
        <div v-if="auth.user" class="space-y-4">
          <p><strong>Email:</strong> {{ auth.user.value?.email }}</p>
          <p><strong>Rôle:</strong> {{ auth.user.value?.role }}</p>
          <p><strong>Statut:</strong> {{ auth.user.value?.isOnline ? 'En ligne' : 'Hors ligne' }}</p>
          <p><strong>Dernière connexion:</strong> {{ new Date(auth.user.value?.lastConnection).toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
  <RegisterModal ref="authModal"  v-if="displayModal" :is-association="isAssociation" :is-register="isRegister"/>
</template>

<script setup lang="ts">

import { useUser } from '~/composables/auth/useUser'
import {definePageMeta} from "#imports";
import RegisterModal from "~/components/register/RegisterModal.vue";
definePageMeta({
  middleware: ['auth'],
  layout:'header'
})

const auth = useUser()

console.log('User:', auth.user.value?.imageProfile)
const route = useRoute()
const authModal = ref<InstanceType<typeof RegisterModal> | null>(null)
const displayModal = ref(false)
const isAssociation = ref(false)
const isRegister = ref(false)

watch(
    () => route.query,
    (query)=> {
  const from = query.from
  const message = query.message
  const role = query.role
  const status = route.query.status

  if (from === 'google' && message === 'success') {
    nextTick(() => {
      authModal.value?.openRegisterModal()
    })
    displayModal.value = true
    isAssociation.value = role === 'true'
  }else if(status === 'created' && message === 'success') {
    nextTick(() => {
      authModal.value?.openRegisterModal()
    })
    isRegister.value = true
    displayModal.value = true
    isAssociation.value = role === 'true'
  }else {
    displayModal.value = false
    isAssociation.value = false
    isRegister.value = false
  }
},
  { immediate: true }
)




</script>