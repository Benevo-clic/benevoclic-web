<script setup lang="ts">
import {watch, onMounted, onUnmounted } from 'vue'
import {   X} from 'lucide-vue-next'
import DrawerAppContent from "~/components/header/drawer/components/DrawerAppContent.vue";



const props = defineProps({
  isAuthenticated: Boolean,
  menuOpen: Boolean,
  userFirstName: String,
})
const emit = defineEmits(['closeDrawer'])


const toggleBodyScroll = (disable: boolean) => {
  if (disable) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

watch(() => props.menuOpen, (isOpen) => {
  toggleBodyScroll(isOpen)
})

onMounted(() => {
  if (props.menuOpen) {
    toggleBodyScroll(true)
  }
})

onUnmounted(() => {
  toggleBodyScroll(false)
})

function handleCloseDrawer() {
  emit('closeDrawer')
}

</script>

<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
        v-if="props.menuOpen"
        class="fixed inset-0 bg-black bg-opacity-40 z-40"
        @click="emit('closeDrawer')"
    />
  </transition>

  <transition name="slide">
    <aside
        v-if="props.menuOpen"
        class="fixed top-0 right-0 h-screen w-3/4 max-w-sm bg-base-100 shadow-lg flex flex-col z-50 text-base-content"
    >
      <div class="flex items-center justify-between pt-2 pl-2" :class="props.isAuthenticated ? 'pb-2' : ''">
        <button @click="emit('closeDrawer')" class="btn btn-ghost btn-square">
          <X class="w-6 h-6" />
        </button>
      </div>

      <DrawerAppContent
        :is-authenticated="props.isAuthenticated"
        :menu-open="menuOpen"
        :display-profile="true"
        @close-drawer="handleCloseDrawer"
        />
    </aside>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease }
.fade-enter-from,
.fade-leave-to { opacity: 0 }
.slide-enter-active,
.slide-leave-active { transition: transform 0.3s ease }
.slide-enter-from,
.slide-leave-to { transform: translateX(100%) }
</style>
