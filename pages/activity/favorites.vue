<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <ActivityMenu />
    </div>
    
    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">{{ t('drawer-content.activity.my_favorites') }}</h1>
        
        <!-- Favorites list -->
        <div class="space-y-4">
          <!-- Filter and search -->
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div class="form-control flex-1">
              <div class="input-group">
                <input type="text" placeholder="Search favorites..." class="input input-bordered w-full" />
                <button class="btn btn-square">
                  <Search class="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <select class="select select-bordered">
              <option value="all">All Favorites</option>
              <option value="missions">Missions</option>
              <option value="organizations">Organizations</option>
            </select>
          </div>
          
          <!-- Tabs -->
          <div class="tabs tabs-boxed bg-base-200 mb-4">
            <button 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'missions' }"
              @click="activeTab = 'missions'"
            >
              Missions
            </button>
            <button 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'organizations' }"
              @click="activeTab = 'organizations'"
            >
              Organizations
            </button>
          </div>
          
          <!-- Favorite missions -->
          <div v-if="activeTab === 'missions'">
            <div v-if="favoriteMissions.length > 0" class="grid grid-cols-1 gap-4">
              <div v-for="mission in favoriteMissions" :key="mission.id" class="card bg-base-200 shadow-sm">
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
                    
                    <button class="btn btn-ghost btn-circle" @click="removeFavorite(mission.id, 'mission')">
                      <Heart class="w-5 h-5 text-error fill-error" />
                    </button>
                  </div>
                  
                  <div class="card-actions justify-end mt-4">
                    <button class="btn btn-sm btn-outline">View Details</button>
                    <button class="btn btn-sm btn-primary">Apply</button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty state for missions -->
            <div v-else class="text-center py-12">
              <Heart class="w-16 h-16 mx-auto text-base-content opacity-30" />
              <h3 class="mt-4 text-lg font-medium text-base-content">No favorite missions</h3>
              <p class="mt-2 text-base-content opacity-70">You haven't added any missions to your favorites yet.</p>
              <button class="btn btn-primary mt-4">Explore Missions</button>
            </div>
          </div>
          
          <!-- Favorite organizations -->
          <div v-if="activeTab === 'organizations'">
            <div v-if="favoriteOrganizations.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="org in favoriteOrganizations" :key="org.id" class="card bg-base-200 shadow-sm">
                <div class="card-body p-4">
                  <div class="flex justify-between items-start">
                    <div class="flex gap-3">
                      <div class="avatar">
                        <div class="w-12 h-12 rounded-full bg-base-300">
                          <img v-if="org.logo" :src="org.logo" alt="Logo" />
                        </div>
                      </div>
                      <div>
                        <h2 class="font-semibold text-base-content">{{ org.name }}</h2>
                        <p class="text-sm text-base-content opacity-70">{{ org.category }}</p>
                        <p class="text-sm text-base-content opacity-70 mt-1">{{ org.location }}</p>
                      </div>
                    </div>
                    
                    <button class="btn btn-ghost btn-circle" @click="removeFavorite(org.id, 'organization')">
                      <Heart class="w-5 h-5 text-error fill-error" />
                    </button>
                  </div>
                  
                  <div class="card-actions justify-end mt-4">
                    <button class="btn btn-sm btn-outline">View Profile</button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty state for organizations -->
            <div v-else class="text-center py-12">
              <Heart class="w-16 h-16 mx-auto text-base-content opacity-30" />
              <h3 class="mt-4 text-lg font-medium text-base-content">No favorite organizations</h3>
              <p class="mt-2 text-base-content opacity-70">You haven't added any organizations to your favorites yet.</p>
              <button class="btn btn-primary mt-4">Explore Organizations</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Calendar, MapPin, Heart } from 'lucide-vue-next'
import ActivityMenu from '~/components/activity/ActivityMenu.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const activeTab = ref('missions')
const {t} = useI18n()

// Mock favorite missions data - would be fetched from API in a real app
const favoriteMissions = ref([
  {
    id: 1,
    title: 'Beach Cleanup',
    organization: 'Ocean Conservation Group',
    date: '2023-06-15',
    location: 'Miami Beach, FL'
  },
  {
    id: 2,
    title: 'Food Distribution',
    organization: 'Community Food Bank',
    date: '2023-05-20',
    location: 'Downtown Community Center'
  }
])

const favoriteOrganizations = ref([
  {
    id: 1,
    name: 'Ocean Conservation Group',
    category: 'Environmental',
    location: 'Miami, FL',
    logo: null
  },
  {
    id: 2,
    name: 'Community Food Bank',
    category: 'Humanitarian',
    location: 'New York, NY',
    logo: null
  }
])

function removeFavorite(id: number, type: 'mission' | 'organization') {
  if (type === 'mission') {
    favoriteMissions.value = favoriteMissions.value.filter(mission => mission.id !== id)
  } else {
    favoriteOrganizations.value = favoriteOrganizations.value.filter(org => org.id !== id)
  }
}
</script>