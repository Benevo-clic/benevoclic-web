<script setup lang="ts">
import {watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import DrawerAppContentVolunteer from "~/components/header/drawer/components/volunteer/DrawerAppContentVolunteer.vue";
import DrawerAppContentAssociation from "~/components/header/drawer/components/association/DrawerAppContentAssociation.vue";
import DrawerAppContentNoConnected from "~/components/header/drawer/components/DrawerAppContentNoConnected.vue";

const props = defineProps({
  isAuthenticated: Boolean,
  menuOpen: Boolean,
  userFirstName: String,
  role: String,
})
const emit = defineEmits(['closeDrawer'])

const toggleBodyScroll = (disable: boolean) => {
  if (disable) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

onUnmounted(() => {
  toggleBodyScroll(false)
})

watch(() => props.menuOpen, (isOpen) => {
  toggleBodyScroll(isOpen)
})

onMounted(() => {
  if (props.menuOpen) {
    toggleBodyScroll(true)
  }
})

function handleCloseDrawer() {
  emit('closeDrawer')
}
</script>

<template>
  <!-- Overlay avec effet de flou -->
  <transition name="fade">
    <div
        v-if="props.menuOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="emit('closeDrawer')"
    />
  </transition>

  <!-- Drawer principal -->
  <transition name="slide">
    <aside
        v-if="props.menuOpen"
      class="fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-gradient-to-b from-base-100 to-base-200 shadow-2xl flex flex-col z-50 text-base-content border-l border-base-300"
    >
      <!-- Header avec effet de verre - Toujours visible -->
      <div class="flex-shrink-0 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <div class="flex items-center justify-between p-4">
          <h2 class="text-lg font-semibold text-base-content">
            {{ props.isAuthenticated ? 'Menu' : 'Bienvenue' }}
          </h2>
          <button 
            @click="emit('closeDrawer')" 
            class="btn btn-ghost btn-circle btn-sm hover:bg-base-300 transition-all duration-200"
          >
            <X class="w-5 h-5" />
        </button>
        </div>
      </div>

      <!-- Contenu dynamique - Scrollable -->
      <div class="flex-1 overflow-hidden">
        <DrawerAppContentVolunteer
          :menu-open="menuOpen"
          :display-profile="true"
          :is-authenticated="props.isAuthenticated"
          @close-drawer="handleCloseDrawer"
          v-if="props.role === 'VOLUNTEER'"
        />
        <DrawerAppContentAssociation
          :menu-open="menuOpen"
          :display-profile="true"
          :is-authenticated="props.isAuthenticated"
          @close-drawer="handleCloseDrawer"
          v-else-if="props.role === 'ASSOCIATION'"
        />
        <DrawerAppContentNoConnected
          :menu-open="menuOpen"
          :display-profile="true"
          @close-drawer="handleCloseDrawer"
          v-else
        />
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) 
}
.fade-enter-from,
.fade-leave-to { 
  opacity: 0 
}

.slide-enter-active,
.slide-leave-active { 
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 
}
.slide-enter-from,
.slide-leave-to { 
  transform: translateX(100%) 
}
</style>
