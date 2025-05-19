<template>
  <div class="space-y-4">
    <!-- Filter and search -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="form-control flex-1">
        <div class="input-group">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search favorites..." 
            class="input input-bordered w-full" 
          />
          <button class="btn btn-square">
            <Search class="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <select v-model="filterType" class="select select-bordered">
        <option value="all">All Favorites</option>
        <option value="missions">Missions</option>
        <option value="organizations">Organizations</option>
      </select>
    </div>
    
    <!-- Favorites list -->
    <div v-if="filteredFavorites.length > 0" class="grid grid-cols-1 gap-4">
      <!-- Mission favorites -->
      <div 
        v-for="favorite in filteredFavorites" 
        :key="favorite.id" 
        class="card bg-base-200 shadow-sm"
      >
        <div class="card-body p-4">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2">
                <span class="badge badge-sm">{{ favorite.type === 'mission' ? 'Mission' : 'Organization' }}</span>
                <h2 class="card-title text-base-content">{{ favorite.title || favorite.name }}</h2>
              </div>
              <p class="text-base-content opacity-70">{{ favorite.organization || favorite.category }}</p>
              
              <div v-if="favorite.type === 'mission'" class="flex items-center gap-2 mt-2">
                <Calendar class="w-4 h-4 text-base-content opacity-70" />
                <span class="text-sm text-base-content opacity-70">{{ favorite.date }}</span>
              </div>
              
              <div class="flex items-center gap-2 mt-1">
                <MapPin class="w-4 h-4 text-base-content opacity-70" />
                <span class="text-sm text-base-content opacity-70">{{ favorite.location }}</span>
              </div>
            </div>
            
            <button class="btn btn-ghost btn-circle" @click="removeFavorite(favorite)">
              <Heart class="w-5 h-5 text-error fill-error" />
            </button>
          </div>
          
          <p class="text-base-content mt-2">{{ favorite.description }}</p>
          
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-sm btn-outline">
              {{ favorite.type === 'mission' ? 'View Details' : 'View Profile' }}
            </button>
            <button v-if="favorite.type === 'mission'" class="btn btn-sm btn-primary">Apply</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <Heart class="w-16 h-16 mx-auto text-base-content opacity-30" />
      <h3 class="mt-4 text-lg font-medium text-base-content">No favorites found</h3>
      <p class="mt-2 text-base-content opacity-70">
        {{ 
          searchQuery 
            ? 'No favorites match your search criteria.' 
            : 'Add items to your favorites to see them here.' 
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Heart, Calendar, MapPin } from 'lucide-vue-next'

// Props to receive favorites data from parent
const props = defineProps({
  favorites: {
    type: Array,
    default: () => []
  }
})

// Emit events to parent
const emit = defineEmits(['remove'])

// Local state
const searchQuery = ref('')
const filterType = ref('all')

// Computed property to filter favorites based on search and filter
const filteredFavorites = computed(() => {
  let results = props.favorites

  // Filter by type
  if (filterType.value !== 'all') {
    results = results.filter(item => item.type === filterType.value.slice(0, -1)) // Remove 's' from end
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(item => {
      const title = (item.title || item.name || '').toLowerCase()
      const description = (item.description || '').toLowerCase()
      const organization = (item.organization || item.category || '').toLowerCase()
      
      return title.includes(query) || 
             description.includes(query) || 
             organization.includes(query)
    })
  }

  return results
})

// Function to remove a favorite
function removeFavorite(favorite) {
  emit('remove', favorite)
}
</script>