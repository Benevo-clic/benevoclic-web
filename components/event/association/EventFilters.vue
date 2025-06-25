<template>
  <div>
    <!-- Filtres visibles sur écran md+ -->
    <div class="hidden md:flex flex-wrap gap-2 items-center">
      <input v-model="filters.search" type="text" placeholder="Recherche..." class="input input-bordered w-48" />
      <input v-model="filters.tags" type="text" placeholder="Tags (virgules)" class="input input-bordered w-48" />
      <div class="relative">
        <button :class="['btn btn-outline rounded-full flex items-center gap-2', isActive('location') ? 'btn-primary text-white' : '']" @click="toggleMenu('location')">
          <MapPin />Localisation
          <ChevronRight />
        </button>
        <div v-if="openMenu === 'location'" class="absolute z-10 bg-white border rounded shadow p-4 mt-2">
          <input v-model="filters.city" type="text" placeholder="Ville" class="input input-bordered mb-2 w-full" />
          <input v-model="filters.postalCode" type="text" placeholder="Code postal" class="input input-bordered w-full" />
          <button class="btn btn-primary mt-2 w-full" @click="applyMenu">Valider</button>
        </div>
      </div>
      <div class="relative">
        <button :class="['btn btn-outline rounded-full flex items-center gap-2', isActive('status') ? 'btn-primary text-white' : '']" @click="toggleMenu('status')">
          Statut <ChevronRight />
        </button>
        <div v-if="openMenu === 'status'" class="absolute z-10 bg-white border rounded shadow p-4 mt-2">
          <select v-model="filters.status" class="select select-bordered w-full">
            <option value="">Tous statuts</option>
            <option value="PENDING">En attente</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Clôturée</option>
          </select>
          <button class="btn btn-primary mt-2 w-full" @click="applyMenu">Valider</button>
        </div>
      </div>
      <div class="relative">
        <button :class="['btn btn-outline rounded-full flex items-center gap-2', isActive('duration') ? 'btn-primary text-white' : '']" @click="toggleMenu('duration')">
          Durée de la mission <ChevronRight />
        </button>
        <div v-if="openMenu === 'duration'" class="absolute z-10 bg-white border rounded shadow p-4 mt-2">
          <label class="block text-sm mb-1">Date de début</label>
          <input v-model="filters.dateStart" type="date" class="input input-bordered mb-2 w-full" />
          <label class="block text-sm mb-1">Date de fin</label>
          <input v-model="filters.dateEnd" type="date" class="input input-bordered mb-2 w-full" />
          <label class="block text-sm mb-1">Heure de début</label>
          <input v-model="filters.timeStart" type="time" class="input input-bordered mb-2 w-full" />
          <label class="block text-sm mb-1">Heure de fin</label>
          <input v-model="filters.timeEnd" type="time" class="input input-bordered w-full" />
          <button class="btn btn-primary mt-2 w-full" @click="applyMenu">Valider</button>
        </div>
      </div>
    </div>
    <!-- Bouton drawer sur mobile -->
    <div class="flex md:hidden">
      <button class="btn btn-outline rounded-full flex items-center gap-2 w-full justify-center" @click="openDrawer">
        <ArrowRightLeft />  <strong class="text-lg">Filtres</strong>
      </button>
    </div>
    <EventFiltersDrawer :open="drawerOpen" @close="closeDrawer" :filters="filters" @update:filters="emitFilters" />
    <div v-if="activeFilters.length" class="flex flex-wrap gap-2 mt-4 items-center">
      <span v-for="f in activeFilters" :key="f.key" class="badge badge-accent gap-1 px-3 py-2 text-white text-base rounded-full flex items-center">
        <span>{{ f.label }}: {{ f.value }}</span>
        <button class="ml-1" @click="resetFilter(f.key)"><X class="w-4 h-4" /></button>
      </span>
      <button class="btn btn-link text-primary ml-2" @click="resetAllFilters">Réinitialiser tout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowRightLeft,ChevronRight, MapPin, X } from 'lucide-vue-next';
import EventFiltersDrawer from './EventFiltersDrawer.vue';

const filters = ref({
  search: '',
  city: '',
  postalCode: '',
  associationType: '',
  dateStart: '',
  dateEnd: '',
  timeStart: '',
  timeEnd: '',
  tags: '',
  status: ''
});

const openMenu = ref('');
const drawerOpen = ref(false);

function toggleMenu(menu) {
  openMenu.value = openMenu.value === menu ? '' : menu;
}

function openDrawer() {
  drawerOpen.value = true;
}

function closeDrawer() {
  drawerOpen.value = false;
}

function applyMenu() {
  const tagsArray = filters.value.tags
    ? filters.value.tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];
  emitFilters({ ...filters.value, tags: tagsArray });
  openMenu.value = '';
}

const emit = defineEmits(['update:filters']);

function emitFilters(payload = filters.value) {
  emit('update:filters', { ...payload });
}

// Filtres actifs sous forme de tableau [{key, label, value}]
const activeFilters = computed(() => {
  const f = filters.value;
  const arr = [];
  if (f.city) arr.push({ key: 'city', label: 'Ville', value: f.city });
  if (f.postalCode) arr.push({ key: 'postalCode', label: 'Code postal', value: f.postalCode });
  if (f.status) arr.push({ key: 'status', label: 'Statut', value: f.status });
  if (f.dateStart || f.dateEnd) arr.push({ key: 'date', label: 'Date', value: `${f.dateStart || ''}${f.dateStart && f.dateEnd ? ' - ' : ''}${f.dateEnd || ''}` });
  if (f.timeStart || f.timeEnd) arr.push({ key: 'time', label: 'Heure', value: `${f.timeStart || ''}${f.timeStart && f.timeEnd ? ' - ' : ''}${f.timeEnd || ''}` });
  return arr;
});

function resetFilter(key) {
  if (key === 'date') {
    filters.value.dateStart = '';
    filters.value.dateEnd = '';
  } else if (key === 'time') {
    filters.value.timeStart = '';
    filters.value.timeEnd = '';
  } else if (key === 'tags') {
    filters.value.tags = '';
  } else {
    filters.value[key] = '';
  }
  emitFilters();
}

function resetAllFilters() {
  filters.value = { search: '', city: '', postalCode: '', associationType: '', dateStart: '', dateEnd: '', timeStart: '', timeEnd: '', tags: '', status: '' };
  emitFilters();
}

// Pour colorer les boutons actifs
function isActive(key) {
  if (key === 'location') return !!(filters.value.city || filters.value.postalCode);
  if (key === 'status') return !!filters.value.status;
  if (key === 'duration') return !!(filters.value.dateStart || filters.value.dateEnd || filters.value.timeStart || filters.value.timeEnd);
  if (key === 'filters') return !!(filters.value.search || filters.value.tags);
  return false;
}
</script>

<style scoped>
.i-mdi-map, .i-mdi-sort, .i-mdi-map-marker, .i-mdi-chevron-down, .i-mdi-chevron-right, .i-mdi-tune-variant {
  /* Remplacer par vos classes d'icônes réelles (FontAwesome, Heroicons, etc.) */
  display: inline-block;
  width: 1em;
  height: 1em;
}
</style> 