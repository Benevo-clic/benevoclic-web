<template>
  <div>
    <div class="max-w-3xl mx-auto px-4">
      <!-- Header infos -->
      <div class="flex flex-col items-center mt-12 mb-6">
        <div class="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg bg-base-300 flex items-center justify-center overflow-hidden mb-4">
          <img
            v-if="profileImageUrl"
            :src="profileImageUrl"
            alt="Logo association"
            class="w-full h-full object-cover"
          />
          <UserRound v-else class="w-16 h-16 text-base-content opacity-50" />
        </div>
        <h1 class="text-3xl font-bold text-base-content mb-1">{{ user?.associationName }}</h1>
        <span class="badge badge-outline badge-primary mb-2">{{ user?.type || 'Type non fourni' }}</span>
        <p class="text-base-content/80 text-center max-w-xl mb-2">{{ user?.bio || 'Aucune description.' }}</p>
        <div class="flex gap-2 mt-2">
          <NuxtLink to="/association/account/edit" class="btn btn-sm btn-outline btn-primary">Éditer le profil</NuxtLink>
          <button class="btn btn-sm btn-outline btn-secondary">Partager</button>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ user?.volunteers?.length ?? 0 }}</span>
          <span class="text-xs text-base-content/70">Bénévoles</span>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ nbAnnouncements }}</span>
          <span class="text-xs text-base-content/70">Annonces créées</span>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ creationDate }}</span>
          <span class="text-xs text-base-content/70">Créée le</span>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ user?.city || '-' }}</span>
          <span class="text-xs text-base-content/70">Ville</span>
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
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <Phone class="w-5 h-5 text-primary shrink-0" />
            <span>Téléphone</span>
            <span class="font-medium">{{ user?.phone || 'Non renseigné' }}</span>
          </div>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
          <h3 class="font-semibold mb-2 text-base-content">Localisation</h3>
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <Globe class="w-5 h-5 text-primary shrink-0" />
            <span>Pays</span>
            <span class="font-medium">{{ user?.country || 'Non renseigné' }}</span>
          </div>
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <MapPin class="w-5 h-5 text-primary shrink-0" />
            <span>Ville</span>
            <span class="font-medium">{{ user?.city || 'Non renseigné' }}</span>
          </div>
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <MapPin class="w-5 h-5 text-primary shrink-0" />
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
          <!-- Ajoute ici d'autres liens réseaux sociaux si tu les as -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { UserRound, Mail, Phone, MapPin, Globe } from 'lucide-vue-next'
import { useUser } from '~/composables/auth/useUser'
import { useAssociationAuth } from '~/composables/useAssociation'
import { useAnnouncement } from '~/composables/useAnnouncement'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const auth = useUser()
const { association: user } = useAssociationAuth()
const announcementStore = useAnnouncement()
const nbAnnouncements = computed(() =>
  (announcementStore.getAnnouncements.value || []).filter(
    a => a.associationId === user.value?.associationId
  ).length
)

const creationDate = computed(() => {
  // Fallback si createdAt n'existe pas
  if ('createdAt' in (user.value || {})) {
    // @ts-ignore
    return formatDate(user.value?.createdAt)
  }
  return '-'
})

onMounted(async () => {
  await auth.fetchUser()
  if (!user.value) {
    await useAssociationAuth().getAssociationInfo()
  }
  await announcementStore.fetchAnnouncements(user.value?.associationId)
})

const profileImageUrl = computed(() => {
  const img = auth.user.value?.imageProfile
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
})

function formatDate(dateString?: string) {
  if (!dateString) return '-'
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}
</script>
