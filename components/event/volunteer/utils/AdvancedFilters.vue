<script setup lang="ts">

import {X} from "lucide-vue-next";
import {ref, watch} from "vue";
import {Teleport} from 'vue';
import type {FilterAnnouncement} from "~/common/interface/filter.interface";

const props = defineProps<{
  showAdvancedFilters: boolean;
  filters: Partial<FilterAnnouncement>;
}>();

const emit = defineEmits<{
  (event: 'applyFilters',filter: Partial<FilterAnnouncement>): void;
  (event: 'resetFilters'): void;
  (event: 'closeFilters'): void;
}>();


const showAdvancedFilters = ref(props.showAdvancedFilters);



// Function to apply filters
function applyFilters() {
  emit('applyFilters', {
    dateEventFrom: filters.value.dateEventFrom,
    dateEventTo: filters.value.dateEventTo,
    hoursEventFrom: filters.value.hoursEventFrom,
    hoursEventTo: filters.value.hoursEventTo,
    datePublicationFrom: filters.value.datePublicationFrom,
    datePublicationTo: filters.value.datePublicationTo,
    publicationInterval: filters.value.publicationInterval
  });
  showAdvancedFilters.value = false;
}

// Function to reset filters
function resetFilters() {
  filters.value = {
    dateEventFrom: undefined,
    dateEventTo: undefined,
    hoursEventFrom: undefined,
    hoursEventTo: undefined,
    datePublicationFrom: undefined,
    datePublicationTo: undefined,
    publicationInterval: ''
  };
  emit('resetFilters');
}




const filters = ref({
  dateEventFrom: undefined,
  dateEventTo: undefined,
  hoursEventFrom: undefined,
  hoursEventTo: undefined,
  datePublicationFrom: undefined,
  datePublicationTo: undefined,
  publicationInterval: ''
});

function disableAdvancedFilters() {
  showAdvancedFilters.value = false;
  emit('closeFilters');
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
        ></div>

        <!-- Drawer Content -->
        <div class="fixed right-0 top-0 h-full w-96 bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out">
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-base-300">
              <h3 class="text-lg font-semibold">Filtres avancés</h3>
              <button @click="disableAdvancedFilters" class="btn btn-ghost btn-sm">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <div class="space-y-6">
                <!-- Date de l'événement -->
                <div class="card bg-base-200 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="font-medium mb-3">Date de l'événement</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">Du:</span>
                        </label>
                        <input type="date" v-model="props.filters.dateEventFrom" class="input input-bordered input-sm w-full" />
                      </div>
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">Au:</span>
                        </label>
                        <input type="date" v-model="props.filters.dateEventTo" class="input input-bordered input-sm w-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Heure de l'événement -->
                <div class="card bg-base-200 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="font-medium mb-3">Heure de l'événement</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">De:</span>
                        </label>
                        <input type="time" v-model="props.filters.hoursEventFrom" class="input input-bordered input-sm w-full" />
                      </div>
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">À:</span>
                        </label>
                        <input type="time" v-model="props.filters.hoursEventTo" class="input input-bordered input-sm w-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Date de publication -->
                <div class="card bg-base-200 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="font-medium mb-3">Date de publication</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">Du:</span>
                        </label>
                        <input type="date" v-model="props.filters.datePublicationFrom" class="input input-bordered input-sm w-full" />
                      </div>
                      <div>
                        <label class="label">
                          <span class="label-text text-sm">Au:</span>
                        </label>
                        <input type="date" v-model="props.filters.datePublicationTo" class="input input-bordered input-sm w-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Intervalle de publication -->
                <div class="card bg-base-200 shadow-sm">
                  <div class="card-body p-4">
                    <h4 class="font-medium mb-3">Intervalle de publication</h4>
                    <select v-model="props.filters.publicationInterval" class="select select-bordered select-sm w-full">
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
                <button @click="applyFilters" class="btn btn-primary btn-sm">
                  Appliquer les filtres
                </button>
                <button @click="resetFilters" class="btn btn-outline btn-sm">
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>

</template>

<style scoped>

</style>