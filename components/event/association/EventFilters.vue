<template>
  <div class="w-full">
    <!-- Filtres actifs -->
    <FilterActive
      :has-active-filters="Boolean(hasActiveFilters)"
      :filters="filters"
      :selected-tags="selectedTags"
      @date-event="removeDateEvent"
      @hours-event="removeHoursEvent"
      @status="removeStatus"
      @tag="removeTag"
      @event-status="removeEventStatus"
      @reset-filters="resetFilters"
    />

    <!-- Conteneur principal des filtres -->
    <div class="w-full">
      <!-- Desktop -->
      <div
        class="hidden md:flex flex-wrap gap-3 items-center justify-center w-full max-w-full"
      >
        <!-- Recherche -->
        <div class="relative">
          <input
            v-model="filters.nameEvent"
            type="text"
            placeholder="Rechercher un événement..."
            class="input input-bordered input-sm w-64 pr-10"
            aria-label="Champ de saisie"
            @input="applyFilters"
          >
          <Search
            class="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
          />
        </div>

        <!-- Statut -->
        <div class="dropdown dropdown-bottom">
          <button
            tabindex="0"
            class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
            :class="filters.status ? 'btn-primary' : 'btn-outline'"
          >
            <CircleDot class="w-4 h-4" />
            Statut
            <ChevronRight class="w-3 h-3" />
          </button>
          <ul
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm z-50"
          >
            <li v-for="statusOption in statusOptions" :key="statusOption.value">
              <a @click.stop="applyStatus(statusOption.value)">
                <input
                  type="checkbox"
                  :checked="filters.status === statusOption.value"
                  class="checkbox checkbox-xs mr-2"
                  aria-label="Champ de saisie"
                >
                {{ statusOption.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Tags -->
        <div class="relative inline-block text-left">
          <button
            class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
            :class="selectedTags.length > 0 ? 'btn-accent' : 'btn-outline'"
            @click="toggleTagsDropdown"
          >
            <Tag class="w-4 h-4" />
            <span>Tags</span>
            <ChevronRight class="w-3 h-3" />
          </button>

          <div
            v-if="showTagsDropdown"
            class="absolute mt-2 w-56 rounded-md shadow-lg bg-base-100 z-50"
            @click.stop
          >
            <ul class="menu p-2 text-sm">
              <li v-for="tag in availableTags" :key="tag">
                <a @click.stop="toggleTag(tag)">
                  <input
                    type="checkbox"
                    :checked="selectedTags.includes(tag)"
                    class="checkbox checkbox-xs mr-2"
                    aria-label="Champ de saisie"
                  >
                  {{ tag }}
                </a>
              </li>
              <li v-if="!showCustomTagInput">
                <button
                  class="text-primary font-semibold cursor-pointer"
                  @click.stop="openCustomTagInput"
                >
                  <Plus class="w-4 h-4 mr-2" />
                  <span>Ajouter un tag...</span>
                </button>
              </li>
              <li v-else>
                <div class="flex items-center gap-2 mt-2">
                  <input
                    ref="customTagInputRef"
                    v-model="customTag"
                    type="text"
                    class="input input-sm input-bordered w-full"
                    placeholder="Nouveau tag…"
                    aria-label="Champ de saisie"
                    @keydown.enter.prevent="addCustomTag"
                  >
                  <button
                    class="btn btn-sm btn-ghost"
                    title="Annuler"
                    type="button"
                    aria-label="Fermer"
                    @click="cancelCustomTagInput"
                  >
                    ✕
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Filtres avancés -->
        <button
          class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
          :class="hasAdvancedFilters ? 'btn-warning' : 'btn-outline'"
          @click="showAdvancedFilters = true"
        >
          <SlidersHorizontal class="w-4 h-4" />
          Filtres avancés
        </button>

        <!-- Filtre rapide événements -->
        <div class="dropdown dropdown-bottom">
          <button
            tabindex="0"
            class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
            :class="filters.stateEvent ? 'btn-info' : 'btn-outline'"
          >
            <Clock class="w-4 h-4" />
            Événements
            <ChevronRight class="w-3 h-3" />
          </button>
          <ul
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm z-50"
          >
            <li>
              <a @click.stop="applyEventStatus('NOW' as const)">
                <input
                  type="checkbox"
                  :checked="filters.stateEvent === 'NOW'"
                  class="checkbox checkbox-xs mr-2"
                  aria-label="Champ de saisie"
                >
                En cours
              </a>
            </li>
            <li>
              <a @click.stop="applyEventStatus('PAST' as const)">
                <input
                  type="checkbox"
                  :checked="filters.stateEvent === 'PAST'"
                  class="checkbox checkbox-xs mr-2"
                  aria-label="Champ de saisie"
                >
                Passés
              </a>
            </li>
            <li>
              <a @click.stop="applyEventStatus('UPCOMING' as const)">
                <input
                  type="checkbox"
                  :checked="filters.stateEvent === 'UPCOMING'"
                  class="checkbox checkbox-xs mr-2"
                  aria-label="Champ de saisie"
                >
                À venir
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Mobile -->
      <div class="flex md:hidden gap-2 w-full">
        <button
          class="btn btn-sm btn-outline rounded-full flex items-center gap-1 justify-center flex-1"
          @click="openMobileFilters"
        >
          <SlidersHorizontal class="w-4 h-4" />
          <span class="text-sm">Filtres</span>
        </button>
      </div>

      <!-- Drawer Mobile -->
      <div v-if="mobileFiltersOpen" class="fixed inset-0 z-50 md:hidden">
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="closeMobileFilters"
        />

        <!-- Drawer -->
        <div
          class="absolute right-0 top-0 h-full w-80 bg-base-100 shadow-xl p-4 overflow-y-auto"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold">
              Filtres
            </h3>
            <button class="btn btn-ghost btn-sm" @click="closeMobileFilters">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Contenu du drawer -->
          <div class="space-y-6">
            <!-- Recherche -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Recherche</span>
              </label>
              <div class="relative">
                <input
                  v-model="filters.nameEvent"
                  type="text"
                  placeholder="Rechercher un événement..."
                  class="input input-bordered w-full pr-10"
                  aria-label="Champ de saisie"
                  @input="applyFilters"
                >
                <Search
                  class="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                />
              </div>
            </div>

            <!-- Statut -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Statut</span>
              </label>
              <div class="relative">
                <button
                  :class="[
                    'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                    showStatusMenu
                      ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm'
                      : 'hover:bg-base-200 hover:shadow-sm',
                  ]"
                  @click="toggleStatusMenu"
                >
                  <div
                    class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors"
                  >
                    <CircleDot class="w-4 h-4" />
                  </div>
                  <span class="font-medium">
                    {{ getStatusLabel() }}
                  </span>
                </button>
                <!-- Dropdown Status -->
                <div
                  v-if="showStatusMenu"
                  class="absolute left-0 mt-2 z-20 bg-base-100 rounded-xl shadow-lg border border-base-300 min-w-48"
                >
                  <div class="p-2 space-y-1">
                    <button
                      v-for="statusOption in statusOptions"
                      :key="statusOption.value"
                      :class="[
                        'flex items-center gap-3 p-2 rounded-lg w-full text-left transition-colors',
                        filters.status === statusOption.value
                          ? 'bg-primary/20 text-primary'
                          : 'hover:bg-base-200',
                      ]"
                      @click="
                        applyStatus(statusOption.value);
                        showStatusMenu = false;
                      "
                    >
                      <input
                        type="radio"
                        :checked="filters.status === statusOption.value"
                        class="radio radio-sm radio-primary"
                        aria-label="Champ de saisie"
                      >
                      <span class="text-sm">{{ statusOption.label }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Tags</span>
              </label>
              <div class="relative">
                <button
                  :class="[
                    'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                    showTagsMenu
                      ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm'
                      : 'hover:bg-base-200 hover:shadow-sm',
                  ]"
                  @click="toggleTagsMenu"
                >
                  <div
                    class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors"
                  >
                    <Tag class="w-4 h-4" />
                  </div>
                  <span class="font-medium">
                    {{ getTagsLabel() }}
                  </span>
                </button>
                <!-- Dropdown Tags -->
                <div
                  v-if="showTagsMenu"
                  class="absolute left-0 mt-2 z-20 bg-base-100 rounded-xl shadow-lg border border-base-300 min-w-48 max-h-64 overflow-y-auto"
                >
                  <div class="p-2 space-y-1">
                    <button
                      v-for="tag in availableTags"
                      :key="tag"
                      :class="[
                        'flex items-center gap-3 p-2 rounded-lg w-full text-left transition-colors',
                        selectedTags.includes(tag)
                          ? 'bg-primary/20 text-primary'
                          : 'hover:bg-base-200',
                      ]"
                      @click="toggleTag(tag)"
                    >
                      <input
                        type="checkbox"
                        :checked="selectedTags.includes(tag)"
                        class="checkbox checkbox-sm checkbox-primary"
                        aria-label="Champ de saisie"
                      >
                      <span class="text-sm">{{ tag }}</span>
                    </button>

                    <!-- Ajout de tag personnalisé -->
                    <div class="border-t border-base-300 pt-2 mt-2">
                      <div v-if="!showCustomTagInput">
                        <button
                          class="flex items-center gap-3 p-2 rounded-lg w-full text-left text-primary hover:bg-primary/10 transition-colors"
                          @click="openCustomTagInput"
                        >
                          <Plus class="w-4 h-4" />
                          <span class="text-sm font-medium">Ajouter un tag...</span>
                        </button>
                      </div>
                      <div v-else class="flex items-center gap-2 p-2">
                        <input
                          ref="customTagInputRef"
                          v-model="customTag"
                          type="text"
                          class="input input-sm input-bordered flex-1"
                          placeholder="Nouveau tag…"
                          aria-label="Champ de saisie"
                          @keydown.enter.prevent="addCustomTag"
                        >
                        <button
                          class="btn btn-sm btn-primary"
                          type="button"
                          aria-label="Ajouter"
                          @click="addCustomTag"
                        >
                          +
                        </button>
                        <button
                          class="btn btn-sm btn-ghost"
                          type="button"
                          aria-label="Fermer"
                          @click="cancelCustomTagInput"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filtres avancés -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Filtres avancés</span>
              </label>
              <button
                class="btn btn-outline w-full"
                @click="
                  showAdvancedFilters = true;
                  closeMobileFilters();
                "
              >
                <SlidersHorizontal class="w-4 h-4 mr-2" />
                Configurer les filtres avancés
              </button>
            </div>

            <!-- Événements -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Événements</span>
              </label>
              <div class="relative">
                <button
                  :class="[
                    'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                    showEventsMenu
                      ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm'
                      : 'hover:bg-base-200 hover:shadow-sm',
                  ]"
                  @click="toggleEventsMenu"
                >
                  <div
                    class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors"
                  >
                    <Clock class="w-4 h-4" />
                  </div>
                  <span class="font-medium">
                    {{ getEventsLabel() }}
                  </span>
                </button>
                <!-- Dropdown Announcements -->
                <div
                  v-if="showEventsMenu"
                  class="absolute left-0 mt-2 z-20 bg-base-100 rounded-xl shadow-lg border border-base-300 min-w-48"
                >
                  <div class="p-2 space-y-1">
                    <button
                      v-for="eventOption in eventOptions"
                      :key="eventOption.value"
                      :class="[
                        'flex items-center gap-3 p-2 rounded-lg w-full text-left transition-colors',
                        filters.stateEvent === eventOption.value
                          ? 'bg-primary/20 text-primary'
                          : 'hover:bg-base-200',
                      ]"
                      @click="
                        applyEventStatus(
                          eventOption.value as 'NOW' | 'PAST' | 'UPCOMING',
                        );
                        showEventsMenu = false;
                      "
                    >
                      <input
                        type="radio"
                        :checked="filters.stateEvent === eventOption.value"
                        class="radio radio-sm radio-primary"
                        aria-label="Champ de saisie"
                      >
                      <span class="text-sm">{{ eventOption.label }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-4 border-t border-base-300">
              <button
                class="btn btn-ghost flex-1"
                type="button"
                @click="resetFilters"
              >
                Réinitialiser
              </button>
              <button
                class="btn btn-primary flex-1"
                type="button"
                @click="closeMobileFilters"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer Filtres Avancés -->
    <AdvancedFilters
      :show-advanced-filters="showAdvancedFilters"
      :filters="tempAdvancedFilters"
      @apply-filters="applyFiltersAdvanced"
      @reset-filters="resetFilters"
      @close-filters="closeAdvancedFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  Search,
  CircleDot,
  Tag,
  ChevronRight,
  SlidersHorizontal,
  Plus,
  X,
  Clock
} from 'lucide-vue-next'
import FilterActive from '~/components/event/volunteer/utils/FilterActive.vue'
import AdvancedFilters from '~/components/event/volunteer/utils/AdvancedFilters.vue'
import type {
  FilterAnnouncement,
  AnnouncementStatus,
  FilterAssociationAnnouncement,
  AnnouncementState
} from '~/common/interface/filter.interface'

// Props et emits
// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:filters', filters: FilterAnnouncement): void;
}>()

// Réactifs
const filters = ref<FilterAssociationAnnouncement>({
  associationId: '',
  nameEvent: '',
  status: undefined,
  dateEventFrom: undefined,
  dateEventTo: undefined,
  hoursEventFrom: undefined,
  hoursEventTo: undefined,
  tags: undefined,
  page: 1,
  limit: 9,
  stateEvent: undefined
})

const selectedTags = ref<string[]>([])
const showAdvancedFilters = ref(false)
const mobileFiltersOpen = ref(false)
const showTagsDropdown = ref(false)
const showCustomTagInput = ref(false)
const customTag = ref('')
const customTagInputRef = ref<HTMLInputElement | null>(null)

// Menus mobiles
const showStatusMenu = ref(false)
const showTagsMenu = ref(false)
const showEventsMenu = ref(false)

// Options
const statusOptions = ref([
  { value: 'ACTIVE' as AnnouncementStatus, label: 'Actif' },
  { value: 'COMPLETED' as AnnouncementStatus, label: 'Terminé' },
  { value: 'INACTIVE' as AnnouncementStatus, label: 'Inactif' }
])

const availableTags = ref([
  'Urgent',
  'Bénévolat',
  'Formation',
  'Événement',
  'Collecte',
  'Sensibilisation',
  'Humanitaire',
  'Environnement',
  'Sport',
  'Culture',
  'Éducation',
  'Santé'
])

const eventOptions = ref([
  { value: 'NOW', label: 'En cours' },
  { value: 'PAST', label: 'Passés' },
  { value: 'UPCOMING', label: 'À venir' }
])

// Filtres avancés temporaires
const tempAdvancedFilters = ref<Partial<FilterAssociationAnnouncement>>({
  dateEventFrom: undefined,
  dateEventTo: undefined,
  hoursEventFrom: undefined,
  hoursEventTo: undefined
})

// Computed
const hasActiveFilters = computed(() => {
  return (
    filters.value.nameEvent ||
    filters.value.status ||
    selectedTags.value.length > 0 ||
    filters.value.dateEventFrom ||
    filters.value.dateEventTo ||
    filters.value.hoursEventFrom ||
    filters.value.hoursEventTo ||
    filters.value.stateEvent
  )
})

const hasAdvancedFilters = computed(() => {
  return (
    filters.value.dateEventFrom ||
    filters.value.dateEventTo ||
    filters.value.hoursEventFrom ||
    filters.value.hoursEventTo
  )
})

// Méthodes
const applyFilters = () => {
  filters.value.tags =
    selectedTags.value.length > 0 ? selectedTags.value : undefined
  emit('update:filters', { ...filters.value })
}

const applyStatus = (status: AnnouncementStatus) => {
  filters.value.status = filters.value.status === status ? undefined : status
  applyFilters()
}

const toggleTagsDropdown = () => {
  showTagsDropdown.value = !showTagsDropdown.value
}

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
  applyFilters()
}

const openCustomTagInput = () => {
  showCustomTagInput.value = true
  nextTick(() => {
    customTagInputRef.value?.focus()
  })
}

const cancelCustomTagInput = () => {
  customTag.value = ''
  showCustomTagInput.value = false
}

const addCustomTag = () => {
  const tag = customTag.value.trim()
  if (!tag) { return }

  if (!availableTags.value.includes(tag)) {
    availableTags.value.push(tag)
  }

  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
  }

  customTag.value = ''
  showCustomTagInput.value = false
  applyFilters()
}

const applyEventStatus = (status: AnnouncementState) => {
  filters.value.stateEvent =
    filters.value.stateEvent === status ? undefined : status
  applyFilters()
}

// Mobile
const openMobileFilters = () => {
  mobileFiltersOpen.value = true
}

const closeMobileFilters = () => {
  mobileFiltersOpen.value = false
}

const toggleStatusMenu = () => {
  showStatusMenu.value = !showStatusMenu.value
}

const toggleTagsMenu = () => {
  showTagsMenu.value = !showTagsMenu.value
}

const toggleEventsMenu = () => {
  showEventsMenu.value = !showEventsMenu.value
}

// Labels
const getStatusLabel = () => {
  const statusOption = statusOptions.value.find(
    s => s.value === filters.value.status
  )
  return statusOption ? statusOption.label : 'Statut'
}

const getTagsLabel = () => {
  if (selectedTags.value.length === 0) {
    return 'Tags'
  }
  if (selectedTags.value.length === 1) {
    return selectedTags.value[0]
  }
  return `${selectedTags.value.length} tags`
}

const getEventsLabel = () => {
  const eventOption = eventOptions.value.find(
    e => e.value === filters.value.stateEvent
  )
  return eventOption ? eventOption.label : 'Événements'
}

// Filtres avancés
const closeAdvancedFilters = () => {
  showAdvancedFilters.value = false
}

const applyFiltersAdvanced = (
  advancedFilters: Partial<FilterAssociationAnnouncement>
) => {
  filters.value.dateEventFrom =
    advancedFilters.dateEventFrom || filters.value.dateEventFrom
  filters.value.dateEventTo =
    advancedFilters.dateEventTo || filters.value.dateEventTo
  filters.value.hoursEventFrom =
    advancedFilters.hoursEventFrom || filters.value.hoursEventFrom
  filters.value.hoursEventTo =
    advancedFilters.hoursEventTo || filters.value.hoursEventTo

  tempAdvancedFilters.value = {
    dateEventFrom: undefined,
    dateEventTo: undefined,
    hoursEventFrom: undefined,
    hoursEventTo: undefined
  }

  applyFilters()
}

// Reset et remove
const removeStatus = () => {
  filters.value.status = undefined
  applyFilters()
}

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
  applyFilters()
}

const removeDateEvent = () => {
  filters.value.dateEventFrom = undefined
  filters.value.dateEventTo = undefined
  applyFilters()
}

const removeHoursEvent = () => {
  filters.value.hoursEventFrom = undefined
  filters.value.hoursEventTo = undefined
  applyFilters()
}

const removeEventStatus = () => {
  filters.value.stateEvent = undefined
  applyFilters()
}

const resetFilters = () => {
  filters.value = {
    associationId: '',
    nameEvent: '',
    status: undefined,
    dateEventFrom: undefined,
    dateEventTo: undefined,
    hoursEventFrom: undefined,
    hoursEventTo: undefined,
    tags: undefined,
    page: 1,
    limit: 9,
    stateEvent: undefined
  }
  selectedTags.value = []
  tempAdvancedFilters.value = {
    dateEventFrom: undefined,
    dateEventTo: undefined,
    hoursEventFrom: undefined,
    hoursEventTo: undefined
  }
  applyFilters()
}

// Watchers
watch(showCustomTagInput, (val) => {
  if (val) {
    nextTick(() => {
      customTagInputRef.value?.focus()
    })
  }
})
</script>

<style scoped>
.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Prevent horizontal scroll */
* {
  box-sizing: border-box;
}

.overflow-x-hidden {
  overflow-x: hidden;
}
</style>
