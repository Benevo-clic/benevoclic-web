<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  open: Boolean,
  filters: Object
})
const emit = defineEmits(['close', 'update:filters'])

const localFilters = ref({ ...props.filters })

watch(
  () => props.filters,
  (val) => {
    localFilters.value = { ...val }
  }
)

function handleClose () {
  emit('close')
}
function handleValidate () {
  // On découpe les tags en tableau si besoin
  const tagsArray = localFilters.value.tags
    ? typeof localFilters.value.tags === 'string'
      ? localFilters.value.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
      : localFilters.value.tags
    : []
  emit('update:filters', { ...localFilters.value, tags: tagsArray })
  emit('close')
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black bg-opacity-40 z-40"
      @click="handleClose"
    />
  </transition>
  <transition name="slide">
    <aside
      v-if="open"
      class="fixed top-0 right-0 h-screen w-full max-w-md bg-base-100 shadow-lg flex flex-col z-50 text-base-content"
    >
      <div class="flex items-center justify-between pt-2 pl-2 pr-2 pb-2">
        <span class="font-bold text-lg">Filtres avancés</span>
        <button class="btn btn-ghost btn-square" @click="handleClose">
          <X class="w-6 h-6" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Recherche..."
          class="input input-bordered w-full"
          aria-label="Champ de saisie"
        >
        <input
          v-model="localFilters.tags"
          type="text"
          placeholder="Tags (virgules)"
          class="input input-bordered w-full"
          aria-label="Champ de saisie"
        >
        <select
          v-model="localFilters.status"
          class="select select-bordered w-full"
          aria-label="Sélection"
        >
          <option value="">
            Tous statuts
          </option>
          <option value="PENDING">
            En attente
          </option>
          <option value="ACTIVE">
            Active
          </option>
          <option value="CLOSED">
            Clôturée
          </option>
        </select>
        <input
          v-model="localFilters.city"
          type="text"
          placeholder="Ville"
          class="input input-bordered w-full"
          aria-label="Champ de saisie"
        >
        <input
          v-model="localFilters.postalCode"
          type="text"
          placeholder="Code postal"
          class="input input-bordered w-full"
          aria-label="Champ de saisie"
        >
        <select
          v-model="localFilters.associationType"
          class="select select-bordered w-full"
          aria-label="Sélection"
        >
          <option value="">
            Tous types d'association
          </option>
          <option value="solidaire">
            Solidaire
          </option>
          <option value="sport">
            Sport
          </option>
          <option value="culture">
            Culture
          </option>
        </select>
        <label class="block text-sm mb-1">Date de début</label>
        <input
          v-model="localFilters.dateStart"
          type="date"
          class="input input-bordered w-full"
          aria-label="Champ de saisie"
        >
        <label class="block text-sm mb-1">Date de fin</label>
        <input
          v-model="localFilters.dateEnd"
          type="date"
          class="input input-bordered w-full"
          aria-label="Champ de saisie"
        >
        <label class="block text-sm mb-1">Heure de début</label>
        <input
          v-model="localFilters.timeStart"
          type="time"
          class="input input-bordered w-full"
          aria-label="Champ de saisie"
        >
        <label class="block text-sm mb-1">Heure de fin</label>
        <input
          v-model="localFilters.timeEnd"
          type="time"
          class="input input-bordered w-full"
          aria-label="Champ de saisie"
        >
      </div>
      <div class="p-4 flex gap-2">
        <button class="btn btn-primary flex-1" @click="handleValidate">
          Valider
        </button>
        <button class="btn btn-ghost flex-1" @click="handleClose">
          Annuler
        </button>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
