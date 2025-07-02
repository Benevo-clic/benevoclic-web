<template>
  <div class="bg-base-100 rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
    <!-- Photo de profil -->
    <div class="flex-shrink-0">
      <div v-if="loading" class="avatar placeholder">
        <div class="w-12 h-12 rounded-full bg-base-300 text-base-content ring-2 ring-primary ring-offset-2 ring-offset-base-100">
          <span class="loading loading-spinner loading-sm"></span>
        </div>
      </div>
      <div v-else-if="userInfo?.imageProfile?.data" class="avatar">
        <div class="w-12 h-12 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
          <img :src="profileImageUrl" :alt="`Photo de ${participant.name}`" class="w-full h-full object-cover rounded-full" />
        </div>
      </div>
      <div v-else class="avatar placeholder">
        <div class="w-12 h-12 rounded-full bg-base-300 text-base-content ring-2 ring-primary ring-offset-2 ring-offset-base-100">
          <span class="text-lg font-bold">{{ participant.name.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
    </div>

    <!-- Informations du participant -->
    <div class="flex-1 min-w-0">
      <h4 class="font-semibold text-base-content truncate">{{ participant.name }}</h4>
      <p class="text-sm text-base-content/70 truncate">{{ userInfo?.email || 'Email non disponible' }}</p>
    </div>

    <!-- Boutons d'action -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <!-- Bouton de gauche -->
      <button 
        class="btn btn-sm btn-outline btn-primary"
      >
        Détails
      </button>

      <!-- Bouton de droite -->
      <button 
        class="btn btn-sm btn-outline btn-error"
      >
        Retirer
      </button>
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
}

const props = defineProps<{
  participant: Participant;
}>();

const emit = defineEmits<{
  leftAction: [participant: Participant];
  rightAction: [participant: Participant];
}>();

const { getUserById } = useUser();
const userInfo = ref<UserInfo | null>(null);
const loading = ref(false);

// URL de l'image de profil
const profileImageUrl = computed(() => {
  const img = userInfo.value?.imageProfile;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`;
  }
  return '';
});

async function loadUserInfo() {
  if (!props.participant.id) return;
  
  loading.value = true;
  try {
    userInfo.value = await getUserById(props.participant.id);
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