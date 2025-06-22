<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">passés</h1>
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
</template>

<script setup lang="ts">
import { useUser } from '~/composables/auth/useUser'
import {definePageMeta} from "#imports";
import {onMounted} from "vue";
import {useAssociationAuth} from "~/composables/auth/associationAuth";

definePageMeta({
  middleware: ['auth'],
  layout:'header'
})

const auth = useUser()
const associationAuth = useAssociationAuth()

onMounted(async () => {
  await auth.fetchUser()
  const userRole = auth.userRole
  const isVolunteer = await associationAuth.getAssociationInfo()
  const isAuthenticated = auth.isAuthenticated.value

  if((!isAuthenticated && !isVolunteer) && userRole.value === 'VOLUNTEER') {
    return navigateTo(
        {
          path: '/auth/registerVolunteer',
        }
    )
  }

  if((!isAuthenticated && !isVolunteer) && userRole.value === 'ASSOCIATION'){
    return navigateTo(
        {
          path: '/auth/registerAssociation',
        }
    )
  }

})

</script>