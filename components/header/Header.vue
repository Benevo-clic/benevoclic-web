<script setup lang="ts">
import { ref } from 'vue'
import {useAuth} from "~/composables/auth/useAuth";
import NavigationActions from "~/components/header/NavigationActions.vue";
import NavigationActionsOptions from "~/components/header/NavigationActionsOptions.vue";
import {AlignJustify} from "lucide-vue-next";
import DrawerContent from "~/components/header/drawer/DrawerContent.vue";
const { isAuthenticated, logout, login } = useAuth()

const menuOpen = ref(false)
const showLoginModal = ref(false)
const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  showLoginModal.value = false
  email.value = ''
  password.value = ''
  await navigateTo('/dashboard')
}
const handleDrawerClose = () => {
  menuOpen.value = !menuOpen.value
  console.log('handleDrawerClose', menuOpen.value)
}

watch(menuOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  const mediaQuery = window.matchMedia('(min-width: 1253px)')

  const handler = (e: MediaQueryListEvent) => {
    if (e.matches) {
      menuOpen.value = false
    }
  }

  mediaQuery.addEventListener('change', handler)

  if (mediaQuery.matches) {
    menuOpen.value = false
  }

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handler)
  })
})


</script>

<template>
  <header class="app-header">
    <div class="header-container">

      <div class="header-top-row">

        <div class="w-24 rounded-full">
          <NuxtLink to="/" >
            <img src="/.idea/shelf/Changes31/logo.png" alt="Logo" />
          </NuxtLink>
        </div>
        <div class="burger-button">
          <NavigationActions class="nav-actions-burger-button" />
          <button  @click.prevent="handleDrawerClose">
            <AlignJustify class="icon-burger-button" />
          </button>
        </div>

      </div>

      <div class="header-search-bar">
        <HeaderSearchBar />
      </div>

      <div class="header-center">
        <NavigationActionsOptions :is-authenticated="isAuthenticated" />
      </div>

      <div class="header-nav-actions">
        <NavigationActions />
      </div>


      <DrawerContent :is-authenticated="isAuthenticated" :menu-open="menuOpen"  @close-drawer="menuOpen = false" />

      <div class="header-nav-theme">
        <label class="flex cursor-pointer gap-2">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path
                d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input type="checkbox" value="synthwave" class="toggle theme-controller" />
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
      </div>

      <div class="right-actions">

        <div v-if="isAuthenticated" class="auth-buttons">
          <HeaderAuthModalAuth />
        </div>

        <div v-else class="btn btn-primary">
          <button @click="logout" class="text-neutral">Déconnexion</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">

@use '@/assets/css/variables' as vars;

.app-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0;

  .header-container {
    max-width: 1500px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .burger-button {
    display: none;
    background: transparent;
    border: none;
    padding: 0.5rem;
    cursor: pointer;

    svg {
      stroke: #000;
    }
  }


  .header-search-bar {
    flex: 1;
    display: block;
  }

  .header-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .right-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .auth-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;


    .icon {
      height: 1.25rem;
      width: 1.25rem;
    }
  }

}

@media (max-width: 1399px) {
  .app-header {
    .header-container {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      padding: 1rem 0;

      .header-top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        gap: 1rem;
      }

      .burger-button {
        display: flex;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;

        svg {
          stroke: #000;
        }
      }

      .header-search-bar {
        width: 100%;
        padding: 0 3rem;

        :deep(input) {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          box-sizing: border-box;
        }
      }

      .header-center,
      .header-nav-actions,
      .right-actions,
      .auth-buttons,
      .header-nav-theme
      {
        display: none !important;
      }
    }

    .icon-burger-button{
      margin-left: 1rem;

      width: 3rem;
      height: 3rem;
    }
    .nav-actions-burger-button{
      margin-top: 0.2rem;
    }

    .nav-actions-theme-button{
      margin-top: 0.2rem;
      margin-left: 0.5rem;
    }

    .mobile-auth {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      a,
      button {
        text-align: left;
        font-size: 1rem;
        padding: 0.5rem 0;
        background: none;
        border: none;
        cursor: pointer;
      }

      button {
        color: #dc2626;
      }
    }

  }
}

</style>
