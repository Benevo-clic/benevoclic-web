<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <ActivityMenu />
    </div>
    
    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">{{ t('drawer-content.activity.my_missions') }}</h1>
        
        <!-- Missions list -->
        <div class="space-y-4">
          <!-- Filter and search -->
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div class="form-control flex-1">
              <div class="input-group">
                <input type="text" placeholder="Search missions..." class="input input-bordered w-full" />
                <button class="btn btn-square">
                  <Search class="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <select class="select select-bordered">
              <option value="all">All Missions</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          
          <!-- Mission cards -->
          <div v-if="missions.length > 0" class="grid grid-cols-1 gap-4">
            <div v-for="mission in missions" :key="mission.id" class="card bg-base-200 shadow-sm">
              <div class="card-body p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h2 class="card-title text-base-content">{{ mission.title }}</h2>
                    <p class="text-base-content opacity-70">{{ mission.organization }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <Calendar class="w-4 h-4 text-base-content opacity-70" />
                      <span class="text-sm text-base-content opacity-70">{{ mission.date }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <MapPin class="w-4 h-4 text-base-content opacity-70" />
                      <span class="text-sm text-base-content opacity-70">{{ mission.location }}</span>
                    </div>
                  </div>
                  
                  <div class="badge" :class="{
                    'badge-primary': mission.status === 'active',
                    'badge-success': mission.status === 'completed',
                    'badge-secondary': mission.status === 'upcoming'
                  }">
                    {{ mission.status }}
                  </div>
                </div>
                
                <div class="card-actions justify-end mt-4">
                  <button class="btn btn-sm btn-outline">View Details</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <Box class="w-16 h-16 mx-auto text-base-content opacity-30" />
            <h3 class="mt-4 text-lg font-medium text-base-content">No missions found</h3>
            <p class="mt-2 text-base-content opacity-70">You haven't created any missions yet.</p>
            <button class="btn btn-primary mt-4">Create a Mission</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Calendar, MapPin, Box } from 'lucide-vue-next'
import ActivityMenu from '~/components/activity/ActivityMenu.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const { t } = useI18n()

// Mock missions data - would be fetched from API in a real app
const missions = ref([
  {
    id: 1,
    title: 'Beach Cleanup',
    organization: 'Ocean Conservation Group',
    date: '2023-06-15',
    location: 'Miami Beach, FL',
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Food Distribution',
    organization: 'Community Food Bank',
    date: '2023-05-20',
    location: 'Downtown Community Center',
    status: 'active'
  },
  {
    id: 3,
    title: 'Tree Planting Event',
    organization: 'Green Earth Initiative',
    date: '2023-04-10',
    location: 'City Park',
    status: 'completed'
  }
])
</script>