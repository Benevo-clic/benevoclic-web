<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-base-200 py-8">
    <div class="w-11/12 md:max-w-3xl mx-auto px-4">
      <!-- Header infos -->
      <div class="flex flex-col items-center mt-12 mb-6">
        <div class="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg bg-base-300 flex items-center justify-center overflow-hidden mb-4">
          <img
            v-if="profileImageUrl"
            :src="profileImageUrl"
            alt="Photo bénévole"
            class="w-full h-full object-cover"
          />
          <UserRound v-else class="w-16 h-16 text-base-content opacity-50" />
        </div>
        <h1
          class="font-bold text-base-content mb-1 text-xl sm:text-2xl md:text-3xl w-full text-center whitespace-nowrap overflow-hidden text-ellipsis"
          style="max-width: 100vw;"
        >
          {{ user?.firstName }} {{ user?.lastName }}
        </h1>
        <span class="badge badge-outline badge-primary mb-2">{{ user?.birthDate ? calculateAge(user.birthDate) + ' ans' : 'Date de naissance non fournie' }}</span>
        <p class="text-base-content/80 text-center max-w-xl mb-2">{{ user?.bio || 'Aucune description.' }}</p>
        <div class="flex gap-2 mt-2">
          <NuxtLink to="/volunteer/account/edit" class="btn btn-sm btn-outline btn-primary">Éditer le profil</NuxtLink>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <NuxtLink to="/volunteer/account/associations" >
        <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ nbAssociations }}</span>
          <span class="text-xs text-base-content/70">Associations</span>
        </div>
        </NuxtLink>
          <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ nbEvents }}</span>
          <span class="text-xs text-base-content/70">Événements participés</span>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ user?.city || '-' }}</span>
          <span class="text-xs text-base-content/70">Ville</span>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ user?.postalCode || '-' }}</span>
          <span class="text-xs text-base-content/70">Code postal</span>
        </div>
      </div>

      <!-- Informations détaillées -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
          <h3 class="font-semibold mb-2 text-base-content">Contact</h3>
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <Mail class="w-5 h-5 text-primary shrink-0" />
            <span>Email</span>
            <span class="font-medium break-all">{{ auth.user.value?.email }}</span>
          </div>
          <div class="flex items-center gap-2 text-base-content">
            <Phone class="w-5 h-5 text-primary" />
            <span>Téléphone</span>
            <span class="font-medium">{{ user?.phone || 'Non renseigné' }}</span>
          </div>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
          <h3 class="font-semibold mb-2 text-base-content">Localisation</h3>
          <div class="flex items-center gap-2 text-base-content">
            <MapPin class="w-5 h-5 text-primary" />
            <span>Ville</span>
            <span class="font-medium">{{ user?.city || 'Non renseigné' }}</span>
          </div>
          <div class="flex items-center gap-2 text-base-content">
            <MapPin class="w-5 h-5 text-primary" />
            <span>Code postal</span>
            <span class="font-medium">{{ user?.postalCode || 'Non renseigné' }}</span>
          </div>
        </div>
      </div>

      <!-- Section supplémentaire : réseaux sociaux, site web, etc. -->
      <div class="bg-base-100 rounded-xl shadow p-6 flex flex-col items-center">
        <h3 class="font-semibold mb-2 text-base-content">Réseaux sociaux</h3>
        <div class="flex gap-4">
          <span class="text-base-content/60">Aucun site web renseigné</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UserRound, Mail, Phone, MapPin } from 'lucide-vue-next'
import { useUser } from '~/composables/auth/useUser'
import { useVolunteerAuth } from '~/composables/useVolunteer'
import { useAnnouncement } from '~/composables/useAnnouncement'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const auth = useUser()
const { volunteer: user } = useVolunteerAuth()
const announcementStore = useAnnouncement()

const profileImageUrl = computed(() => {
  const img = auth.user.value?.imageProfile
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
})

const nbAssociations = computed(() => user.value?.myAssociations?.length ?? 0)
const nbEvents = computed(() => {
  // On compte le nombre d'annonces où le bénévole est dans participants
  return (announcementStore.getAnnouncements.value || []).filter(
    a => a.participants?.some(p => p.id === user.value?.volunteerId)
  ).length
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