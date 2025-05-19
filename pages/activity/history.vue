<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <ActivityMenu />
    </div>
    
    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">{{ $t('drawer-content.activity.history') }}</h1>
        
        <!-- History list -->
        <div class="space-y-4">
          <!-- Filter and search -->
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div class="form-control flex-1">
              <div class="input-group">
                <input type="text" placeholder="Search history..." class="input input-bordered w-full" />
                <button class="btn btn-square">
                  <Search class="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <select class="select select-bordered">
              <option value="all">All Activities</option>
              <option value="missions">Missions</option>
              <option value="applications">Applications</option>
              <option value="searches">Searches</option>
            </select>
          </div>
          
          <!-- Timeline -->
          <div v-if="historyItems.length > 0" class="relative">
            <!-- Timeline line -->
            <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-base-300 ml-6 md:ml-8"></div>
            
            <!-- Timeline items -->
            <div class="space-y-6">
              <div v-for="(item, index) in historyItems" :key="index" class="relative pl-16 md:pl-20">
                <!-- Timeline dot -->
                <div class="absolute left-0 top-0 w-12 md:w-16 flex items-center justify-center">
                  <div class="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center z-10">
                    <component :is="getIconForType(item.type)" class="w-4 h-4 text-base-content" />
                  </div>
                </div>
                
                <!-- Timeline content -->
                <div class="bg-base-200 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold text-base-content">{{ item.title }}</h3>
                    <span class="text-sm text-base-content opacity-70">{{ formatDate(item.date) }}</span>
                  </div>
                  
                  <p class="text-base-content">{{ item.description }}</p>
                  
                  <!-- Action buttons based on type -->
                  <div class="flex justify-end mt-4 gap-2">
                    <button v-if="item.type === 'mission'" class="btn btn-sm btn-outline">View Mission</button>
                    <button v-if="item.type === 'application'" class="btn btn-sm btn-outline">View Application</button>
                    <button v-if="item.type === 'search'" class="btn btn-sm btn-outline">Repeat Search</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <Clock class="w-16 h-16 mx-auto text-base-content opacity-30" />
            <h3 class="mt-4 text-lg font-medium text-base-content">No history found</h3>
            <p class="mt-2 text-base-content opacity-70">Your activity history will appear here.</p>
          </div>
          
          <!-- Load more button -->
          <div v-if="historyItems.length > 0" class="flex justify-center mt-8">
            <button class="btn btn-outline">Load More</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Clock, MapPin, FileText, Search as SearchIcon } from 'lucide-vue-next'
import ActivityMenu from '~/components/activity/ActivityMenu.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

// Mock history data - would be fetched from API in a real app
const historyItems = ref([
  {
    type: 'mission',
    title: 'Completed Mission: Beach Cleanup',
    description: 'You completed the Beach Cleanup mission with Ocean Conservation Group.',
    date: '2023-05-15T14:30:00'
  },
  {
    type: 'application',
    title: 'Application Submitted',
    description: 'You applied to the Food Distribution mission with Community Food Bank.',
    date: '2023-05-10T09:15:00'
  },
  {
    type: 'search',
    title: 'Search Performed',
    description: 'You searched for "environmental missions" in Miami.',
    date: '2023-05-05T16:45:00'
  },
  {
    type: 'mission',
    title: 'Mission Canceled',
    description: 'Your participation in Tree Planting Event was canceled.',
    date: '2023-04-28T11:20:00'
  }
])

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get icon component based on activity type
function getIconForType(type: string) {
  switch (type) {
    case 'mission':
      return MapPin
    case 'application':
      return FileText
    case 'search':
      return SearchIcon
    default:
      return Clock
  }
}
</script>