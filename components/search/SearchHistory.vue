<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-base-content">Recent Searches</h3>
      <button 
        v-if="searchHistory.length > 0" 
        @click="clearHistory" 
        class="btn btn-sm btn-ghost"
      >
        Clear All
      </button>
    </div>
    
    <!-- Search history list -->
    <div v-if="searchHistory.length > 0" class="space-y-2">
      <div 
        v-for="(search, index) in searchHistory" 
        :key="index" 
        class="bg-base-200 rounded-lg p-3 flex justify-between items-center"
      >
        <div class="flex items-center gap-2">
          <Clock class="w-4 h-4 text-base-content opacity-70" />
          <div>
            <p class="font-medium text-base-content">{{ search.query }}</p>
            <div class="flex gap-2 text-xs text-base-content opacity-70">
              <span v-if="search.location">{{ search.location }}</span>
              <span v-if="search.category">{{ search.category }}</span>
              <span>{{ formatDate(search.date) }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex gap-2">
          <button 
            @click="repeatSearch(search)" 
            class="btn btn-sm btn-ghost btn-circle"
            title="Repeat search"
          >
            <Search class="w-4 h-4" />
          </button>
          <button 
            @click="removeSearch(index)" 
            class="btn btn-sm btn-ghost btn-circle"
            title="Remove from history"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <Clock class="w-12 h-12 mx-auto text-base-content opacity-30" />
      <h3 class="mt-3 text-base font-medium text-base-content">No search history</h3>
      <p class="mt-1 text-sm text-base-content opacity-70">Your recent searches will appear here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Search, X } from 'lucide-vue-next'

// Props to receive search history data from parent
const props = defineProps({
  searchHistory: {
    type: Array,
    default: () => []
  }
})

// Emit events to parent
const emit = defineEmits(['repeat', 'remove', 'clear'])

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Function to repeat a search
function repeatSearch(search: any) {
  emit('repeat', search)
}

// Function to remove a search from history
function removeSearch(index: number) {
  emit('remove', index)
}

// Function to clear all search history
function clearHistory() {
  emit('clear')
}
</script>