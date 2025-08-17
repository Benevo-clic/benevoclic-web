<script setup lang="ts">
  import { watch, onMounted, onUnmounted } from 'vue'
  import { X } from 'lucide-vue-next'
  import DrawerAppContentVolunteer from '~/components/header/drawer/components/volunteer/DrawerAppContentVolunteer.vue'
  import DrawerAppContentAssociation from '~/components/header/drawer/components/association/DrawerAppContentAssociation.vue'
  import DrawerAppContentNoConnected from '~/components/header/drawer/components/DrawerAppContentNoConnected.vue'

  const { t } = useI18n()

  const props = defineProps({
    isAuthenticated: Boolean,
    menuOpen: Boolean,
    userFirstName: String,
    role: String
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

  watch(
    () => props.menuOpen,
    isOpen => {
      toggleBodyScroll(isOpen)
    }
  )

  onMounted(() => {
    if (props.menuOpen) {
      toggleBodyScroll(true)
    }
  })

  function handleCloseDrawer() {
    emit('closeDrawer')
  }

  // Gestion de la navigation clavier
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleCloseDrawer()
    }
  }

  // Focus trap pour le drawer
  function handleOverlayClick() {
    handleCloseDrawer()
  }
</script>

<template>
  <!-- Overlay avec effet de flou -->
  <transition name="fade">
    <div
      v-if="props.menuOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      role="presentation"
      aria-hidden="true"
      @click="handleOverlayClick"
      @keydown="handleKeydown"
    />
  </transition>

  <!-- Drawer principal -->
  <transition name="slide">
    <aside
      v-if="props.menuOpen"
      class="fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-gradient-to-b from-base-100 to-base-200 shadow-2xl flex flex-col z-50 text-base-content border-l border-base-300"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="props.isAuthenticated ? 'drawer-title' : 'welcome-title'"
      :aria-describedby="props.isAuthenticated ? 'drawer-description' : 'welcome-description'"
      @keydown="handleKeydown"
    >
      <!-- Header avec effet de verre - Toujours visible -->
      <div class="flex-shrink-0 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <div class="flex items-center justify-between p-4">
          <h2
            :id="props.isAuthenticated ? 'drawer-title' : 'welcome-title'"
            class="text-lg font-semibold text-base-content"
          >
            {{ props.isAuthenticated ? t('drawerContent.menu') : t('drawerContent.welcome') }}
          </h2>
          <button
            class="btn btn-ghost btn-circle btn-sm hover:bg-base-300 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :aria-label="
              props.isAuthenticated
                ? t('drawerContent.closeMenu')
                : t('drawerContent.closeWelcomePanel')
            "
            @click="handleCloseDrawer"
          >
            <X class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div
          :id="props.isAuthenticated ? 'drawer-description' : 'welcome-description'"
          class="sr-only"
        >
          {{
            props.isAuthenticated
              ? t('drawerContent.menuDescription')
              : t('drawerContent.welcomeDescription')
          }}
        </div>
      </div>

      <!-- Contenu dynamique - Scrollable -->
      <div class="flex-1 overflow-hidden" role="main">
        <DrawerAppContentVolunteer
          v-if="props.role === 'VOLUNTEER'"
          :menu-open="menuOpen"
          :display-profile="true"
          :is-authenticated="props.isAuthenticated"
          @close-drawer="handleCloseDrawer"
        />
        <DrawerAppContentAssociation
          v-else-if="props.role === 'ASSOCIATION'"
          :menu-open="menuOpen"
          :display-profile="true"
          :is-authenticated="props.isAuthenticated"
          @close-drawer="handleCloseDrawer"
        />
        <DrawerAppContentNoConnected
          v-else
          :menu-open="menuOpen"
          :display-profile="true"
          @close-drawer="handleCloseDrawer"
        />
      </div>
    </aside>
  </transition>
</template>

<style scoped>
  /* Respect des préférences de réduction de mouvement */
  @media (prefers-reduced-motion: reduce) {
    .fade-enter-active,
    .fade-leave-active,
    .slide-enter-active,
    .slide-leave-active {
      transition: none;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }

  /* Amélioration du focus pour l'accessibilité */
  aside:focus-visible {
    outline: 2px solid #eb5577;
    outline-offset: 2px;
  }

  /* Amélioration du contraste pour les utilisateurs en mode high-contrast */
  @media (prefers-contrast: more) {
    aside {
      border-left: 3px solid #eb5577;
    }

    .btn-ghost:hover {
      background-color: #eb5577 !important;
      color: white !important;
    }
  }
</style>
