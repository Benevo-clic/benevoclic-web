<script setup lang="ts">
  import { X } from 'lucide-vue-next'
  import { ref, watch, computed } from 'vue'
  import type { FilterAnnouncement } from '~/common/interface/filter.interface'

  const { t } = useI18n()

  const props = defineProps<{
    showAdvancedFilters: boolean
    filters: Partial<FilterAnnouncement>
  }>()

  // eslint-disable-next-line func-call-spacing
  const emit = defineEmits<{
    (event: 'applyFilters', filter: Partial<FilterAnnouncement>): void
    (event: 'resetFilters'): void
    (event: 'closeFilters'): void
  }>()

  const showAdvancedFilters = ref(props.showAdvancedFilters)

  // Filtres temporaires locaux
  const localFilters = ref({
    dateEventFrom: props.filters.dateEventFrom,
    dateEventTo: props.filters.dateEventTo,
    hoursEventFrom: props.filters.hoursEventFrom,
    hoursEventTo: props.filters.hoursEventTo,
    datePublicationFrom: props.filters.datePublicationFrom,
    datePublicationTo: props.filters.datePublicationTo,
    publicationInterval: props.filters.publicationInterval
  })

  // Synchroniser avec les props
  watch(
    () => props.filters,
    newFilters => {
      localFilters.value = {
        dateEventFrom: newFilters.dateEventFrom,
        dateEventTo: newFilters.dateEventTo,
        hoursEventFrom: newFilters.hoursEventFrom,
        hoursEventTo: newFilters.hoursEventTo,
        datePublicationFrom: newFilters.datePublicationFrom,
        datePublicationTo: newFilters.datePublicationTo,
        publicationInterval: newFilters.publicationInterval
      }
    },
    { deep: true }
  )

  function applyFilters() {
    const isDateEventValid =
      (localFilters.value.dateEventFrom && localFilters.value.dateEventTo) ||
      (!localFilters.value.dateEventFrom && !localFilters.value.dateEventTo)

    const isHoursEventValid =
      (localFilters.value.hoursEventFrom && localFilters.value.hoursEventTo) ||
      (!localFilters.value.hoursEventFrom && !localFilters.value.hoursEventTo)

    const isDatePublicationValid =
      (localFilters.value.datePublicationFrom && localFilters.value.datePublicationTo) ||
      (!localFilters.value.datePublicationFrom && !localFilters.value.datePublicationTo)

    if (!isDateEventValid || !isHoursEventValid || !isDatePublicationValid) {
      return
    }

    emit('applyFilters', {
      dateEventFrom: localFilters.value.dateEventFrom,
      dateEventTo: localFilters.value.dateEventTo,
      hoursEventFrom: localFilters.value.hoursEventFrom,
      hoursEventTo: localFilters.value.hoursEventTo,
      datePublicationFrom: localFilters.value.datePublicationFrom,
      datePublicationTo: localFilters.value.datePublicationTo,
      publicationInterval: localFilters.value.publicationInterval
    })
    showAdvancedFilters.value = false
  }

  // Function to reset filters
  function resetFilters() {
    localFilters.value = {
      dateEventFrom: undefined,
      dateEventTo: undefined,
      hoursEventFrom: undefined,
      hoursEventTo: undefined,
      datePublicationFrom: undefined,
      datePublicationTo: undefined,
      publicationInterval: undefined
    }
    emit('resetFilters')
  }

  // Computed property pour vérifier si les filtres sont valides
  const areFiltersValid = computed(() => {
    const isDateEventValid =
      (localFilters.value.dateEventFrom && localFilters.value.dateEventTo) ||
      (!localFilters.value.dateEventFrom && !localFilters.value.dateEventTo)

    const isHoursEventValid =
      (localFilters.value.hoursEventFrom && localFilters.value.hoursEventTo) ||
      (!localFilters.value.hoursEventFrom && !localFilters.value.hoursEventTo)

    const isDatePublicationValid =
      (localFilters.value.datePublicationFrom && localFilters.value.datePublicationTo) ||
      (!localFilters.value.datePublicationFrom && !localFilters.value.datePublicationTo)

    return isDateEventValid && isHoursEventValid && isDatePublicationValid
  })

  function disableAdvancedFilters() {
    showAdvancedFilters.value = false
    emit('closeFilters')
  }
</script>

<template>
  <div class="advanced-filters">
    <!-- Drawer Filtres Avancés Global -->
    <Teleport to="body">
      <div v-if="props.showAdvancedFilters" class="fixed inset-0 z-50 flex">
        <!-- Overlay -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          @click="disableAdvancedFilters"
        />

        <!-- Drawer Content -->
        <div
          class="fixed right-0 top-0 h-full w-96 bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out"
        >
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-base-300">
              <h3 class="text-lg font-semibold">{{ t('advancedFilters.title') }}</h3>
              <button class="btn btn-ghost btn-sm" @click="disableAdvancedFilters">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <div class="space-y-6">
                <!-- Date de l'événement -->
                <div class="card bg-base-200 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="font-medium mb-3">{{ t('advancedFilters.sections.eventDate') }}</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">{{ t('advancedFilters.labels.from') }}</span>
                        </label>
                        <input
                          v-model="localFilters.dateEventFrom"
                          type="date"
                          class="input input-bordered input-sm w-full"
                          :aria-label="t('advancedFilters.aria.inputField')"
                        />
                      </div>
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">{{ t('advancedFilters.labels.to') }}</span>
                        </label>
                        <input
                          v-model="localFilters.dateEventTo"
                          type="date"
                          class="input input-bordered input-sm w-full"
                          :aria-label="t('advancedFilters.aria.inputField')"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Heure de l'événement -->
                <div class="card bg-base-200 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="font-medium mb-3">{{ t('advancedFilters.sections.eventTime') }}</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">{{ t('advancedFilters.labels.fromTime') }}</span>
                        </label>
                                                  <input
                            v-model="localFilters.hoursEventFrom"
                            type="time"
                            class="input input-bordered input-sm w-full"
                            :aria-label="t('advancedFilters.aria.inputField')"
                          />
                      </div>
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">{{ t('advancedFilters.labels.toTime') }}</span>
                        </label>
                                                  <input
                            v-model="localFilters.hoursEventTo"
                            type="time"
                            class="input input-bordered input-sm w-full"
                            :aria-label="t('advancedFilters.aria.inputField')"
                          />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Date de publication -->
                <div class="card bg-base-200 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="font-medium mb-3">{{ t('advancedFilters.sections.publicationDate') }}</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">{{ t('advancedFilters.labels.from') }}</span>
                        </label>
                                                  <input
                            v-model="localFilters.datePublicationFrom"
                            type="date"
                            class="input input-bordered input-sm w-full"
                            :aria-label="t('advancedFilters.aria.inputField')"
                          />
                      </div>
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">{{ t('advancedFilters.labels.to') }}</span>
                        </label>
                                                  <input
                            v-model="localFilters.datePublicationTo"
                            type="date"
                            class="input input-bordered input-sm w-full"
                            :aria-label="t('advancedFilters.aria.inputField')"
                          />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Intervalle de publication -->
                <div class="card bg-base-200 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="font-medium mb-3">Intervalle de publication</h4>
                    <select
                      v-model="localFilters.publicationInterval"
                      class="select select-bordered select-sm w-full"
                      aria-label="Sélection"
                    >
                      <option value="">Tous</option>
                      <option value="1h">Dernière heure</option>
                      <option value="5h">5 dernières heures</option>
                      <option value="1d">Dernière journée</option>
                      <option value="1w">Dernière semaine</option>
                      <option value="1M">Dernier mois</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-base-300">
              <div class="flex flex-col gap-2">
                <button
                  :disabled="!areFiltersValid"
                  :class="areFiltersValid ? 'btn btn-primary btn-sm' : 'btn btn-disabled btn-sm'"
                  @click="applyFilters"
                >
                  Appliquer les filtres
                </button>
                <button class="btn btn-outline btn-sm" @click="resetFilters">Réinitialiser</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped></style>
