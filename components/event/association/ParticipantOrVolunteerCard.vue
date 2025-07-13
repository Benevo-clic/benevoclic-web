<template>
  <div class="bg-base-100 rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow mb-4">
    <!-- Avatar à gauche -->
    <div class="flex-shrink-0 flex items-start">
      <div v-if="loading" class="avatar placeholder">
        <div class="w-16 h-16 rounded-full bg-base-300 text-base-content ring-2 ring-primary ring-offset-2 ring-offset-base-100">
          <span class="loading loading-spinner loading-sm"></span>
        </div>
      </div>
      <div v-else-if="userInfo?.avatarFileKey" class="avatar">
        <div class="w-16 h-16 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
          <img :src="profileImageUrl" :alt="`Photo de ${participant.name}`" class="w-full h-full object-cover rounded-full" />
        </div>
      </div>
      <div v-else class="avatar placeholder">
        <div class="w-16 h-16 rounded-full bg-base-300 text-base-content ring-2 ring-primary ring-offset-2 ring-offset-base-100 flex items-center justify-center">
          <span class="text-xl font-bold">{{ participant.name.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
    </div>
    <!-- Infos + boutons -->
    <div class="flex-1 flex flex-col justify-between min-w-0">
      <!-- Nom et email en haut -->
      <div class="mb-4">
        <h4 class="font-semibold text-base-content text-lg truncate">{{ participant.name }}</h4>
        <p class="text-sm text-base-content/70 truncate">{{ userInfo?.email || 'Email non disponible' }}</p>
      </div>
      <!-- Boutons en bas -->
      <div class="flex gap-2 mt-auto">
        <button class="btn btn-sm btn-outline btn-primary flex-1">Détails</button>
        <button class="btn btn-sm btn-outline btn-error flex-1" @click="$emit('rightAction', participant.id)">Retirer</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useUser} from '~/composables/auth/useUser';

interface Participant {
  id: string;
  name: string;
}

interface UserInfo {
  userId: string;
  email: string;
  imageProfile?: {
    data: string;
    contentType: string;
    uploadedAt: string;
  };
  avatarFileKey?: string;
}

const props = defineProps<{
  participant: Participant;
}>();

const emit = defineEmits<{
  rightAction: [participant: string];
}>();

const { getUserById } = useUser();
const userInfo = ref<UserInfo | null>(null);
const loading = ref(false);

// URL de l'image de profil
const profileImageUrl = computed(() => {
  return  userInfo.value?.avatarFileKey;
});

async function loadUserInfo() {
  if (!props.participant.id) return;
  
  loading.value = true;
  try {
    userInfo.value = await getUserById(props.participant.id);
    console.log('Informations utilisateur chargées:', userInfo.value);
  } catch (error) {
    console.error('Erreur lors du chargement des informations utilisateur:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadUserInfo();
});
</script>

<style scoped>
.avatar img {
  transition: transform 0.2s ease-in-out;
}

.avatar:hover img {
  transform: scale(1.05);
}

.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}
</style> 