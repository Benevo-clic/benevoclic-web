<template>
  <div class="bg-base-100 rounded-lg shadow-md p-4">
    <h2 class="text-xl font-semibold mb-4 text-base-content">Search</h2>
    
    <!-- Search form -->
    <div class="space-y-4">
      <div class="form-control">
        <div class="input-group">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search missions, organizations..." 
            class="input input-bordered w-full" 
            @keyup.enter="performSearch"
          aria-label="Champ de saisie">
          <button class="btn btn-square" @click="performSearch">
            <Search class="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text text-base-content">Category</span>
          </label>
          <select v-model="filters.category" class="select select-bordered w-full" aria-label="Sélection">
            <option value="">All Categories</option>
            <option value="environmental">Environmental</option>
            <option value="humanitarian">Humanitarian</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="community">Community</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text text-base-content">Location</span>
          </label>
          <select v-model="filters.location" class="select select-bordered w-full" aria-label="Sélection">
            <option value="">All Locations</option>
            <option value="paris">Paris</option>
            <option value="lyon">Lyon</option>
            <option value="marseille">Marseille</option>
            <option value="bordeaux">Bordeaux</option>
            <option value="lille">Lille</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text text-base-content">Date Range</span>
          </label>
          <select v-model="filters.dateRange" class="select select-bordered w-full" aria-label="Sélection">
            <option value="">Any Time</option>
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="next-month">Next Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text text-base-content">Type</span>
          </label>
          <select v-model="filters.type" class="select select-bordered w-full" aria-label="Sélection">
            <option value="">All Types</option>
            <option value="missions">Missions</option>
            <option value="organizations">Organizations</option>
            <option value="events">Events</option>
          </select>
        </div>
      </div>
      
      <!-- Custom date range (shown only when custom is selected) -->
      <div v-if="filters.dateRange === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text text-base-content">Start Date</span>
          </label>
          <input type="date" v-model="filters.startDate" class="input input-bordered w-full" aria-label="Champ de saisie">
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text text-base-content">End Date</span>
          </label>
          <input type="date" v-model="filters.endDate" class="input input-bordered w-full" aria-label="Champ de saisie">
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="flex justify-end gap-2">
        <button class="btn btn-outline" @click="resetFilters" type="button" focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2>Reset</button>
        <button class="btn btn-primary" @click="performSearch" type="button" focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2>Search</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'

const emit = defineEmits(['search'])

const searchQuery = ref('')
const filters = ref({
  category: '',
  location: '',
  dateRange: '',
  type: '',
  startDate: '',
  endDate: ''
})

function performSearch() {
  emit('search', {
    query: searchQuery.value,
    filters: { ...filters.value }
  })
}

function resetFilters() {
  searchQuery.value = ''
  filters.value = {
    category: '',
    location: '',
    dateRange: '',
    type: '',
    startDate: '',
    endDate: ''
  }
}
</script>