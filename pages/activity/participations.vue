<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <ActivityMenu />
    </div>
    
    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">{{ t('drawer-content.activity.my_participations') }}</h1>
        
        <!-- Participations list -->
        <div class="space-y-4">
          <!-- Filter and search -->
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div class="form-control flex-1">
              <div class="input-group">
                <input type="text" placeholder="Search participations..." class="input input-bordered w-full" />
                <button class="btn btn-square">
                  <Search class="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <select class="select select-bordered">
              <option value="all">All Participations</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          
          <!-- Participation cards -->
          <div v-if="participations.length > 0" class="grid grid-cols-1 gap-4">
            <div v-for="participation in participations" :key="participation.id" class="card bg-base-200 shadow-sm">
              <div class="card-body p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h2 class="card-title text-base-content">{{ participation.missionTitle }}</h2>
                    <p class="text-base-content opacity-70">{{ participation.organization }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <Calendar class="w-4 h-4 text-base-content opacity-70" />
                      <span class="text-sm text-base-content opacity-70">{{ participation.date }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <MapPin class="w-4 h-4 text-base-content opacity-70" />
                      <span class="text-sm text-base-content opacity-70">{{ participation.location }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <Users class="w-4 h-4 text-base-content opacity-70" />
                      <span class="text-sm text-base-content opacity-70">{{ participation.role }}</span>
                    </div>
                  </div>
                  
                  <div class="badge" :class="{
                    'badge-primary': participation.status === 'confirmed',
                    'badge-warning': participation.status === 'pending',
                    'badge-error': participation.status === 'canceled',
                    'badge-success': participation.status === 'completed'
                  }">
                    {{ participation.status }}
                  </div>
                </div>
                
                <div class="card-actions justify-end mt-4">
                  <button class="btn btn-sm btn-outline">View Details</button>
                  <button v-if="participation.status === 'confirmed' || participation.status === 'pending'" class="btn btn-sm btn-error">Cancel</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <ClipboardList class="w-16 h-16 mx-auto text-base-content opacity-30" />
            <h3 class="mt-4 text-lg font-medium text-base-content">No participations found</h3>
            <p class="mt-2 text-base-content opacity-70">You haven't participated in any missions yet.</p>
            <button class="btn btn-primary mt-4">Find Missions</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Calendar, MapPin, Users, ClipboardList } from 'lucide-vue-next'
import ActivityMenu from '~/components/activity/ActivityMenu.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})
const { t } = useI18n()

// Mock participations data - would be fetched from API in a real app
const participations = ref([
  {
    id: 1,
    missionTitle: 'Beach Cleanup',
    organization: 'Ocean Conservation Group',
    date: '2023-06-15',
    location: 'Miami Beach, FL',
    role: 'Volunteer',
    status: 'confirmed'
  },
  {
    id: 2,
    missionTitle: 'Food Distribution',
    organization: 'Community Food Bank',
    date: '2023-05-20',
    location: 'Downtown Community Center',
    role: 'Team Leader',
    status: 'pending'
  },
  {
    id: 3,
    missionTitle: 'Tree Planting Event',
    organization: 'Green Earth Initiative',
    date: '2023-04-10',
    location: 'City Park',
    role: 'Volunteer',
    status: 'completed'
  }
])
</script>