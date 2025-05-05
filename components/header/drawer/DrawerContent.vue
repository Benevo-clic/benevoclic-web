<script setup lang="ts">
import {X, Search, Heart, Bell,ChevronLeft} from "lucide-vue-next";
import {useAuth} from "~/composables/auth/useAuth";
const { isAuthenticated, logout: authLogout, login } = useAuth()


const props = defineProps<{
  isAuthenticated: boolean
  menuOpen: boolean
  userFirstName?: string
}>()

const emit = defineEmits(['closeDrawer'])


function handleLogout() {
  authLogout()
  emit('closeDrawer')
}


const profileImage = ref<string | null>(null)



const placeholderUrl = computed(() => {
  const firstLetter = props.userFirstName?.charAt(0).toUpperCase() || 'U'
  return `https://ui-avatars.com/api/?name=${firstLetter}&background=0D8ABC&color=fff`
})

const profileImageSrc = computed(() => profileImage.value || placeholderUrl.value)

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

</script>

<template>

  <transition name="fade">
    <div v-if="props.menuOpen" class="drawer-overlay" @click.prevent="$emit('closeDrawer')">
    </div>
  </transition>
  <transition name="slide">
    <div v-if="props.menuOpen" class="mobile-drawer">
      <div class="divider"></div>

      <div class="mobile-drawer__header">
          <button class="mobile-drawer__header-button" @click="$emit('closeDrawer')">
            <X />
          </button>
          <section class="w-24 rounded-full">
            <NuxtLink to="/" >
              <img src="/.idea/shelf/Changes31/logo.png" alt="Logo" />
            </NuxtLink>
          </section>
      </div>
      <div class="divider"></div>

      <div class="mobile-drawer__content">
        <section class="mobile-drawer__content--search" @click="$emit('closeDrawer')">
          <button class="icon-search" aria-label="Ouvrir la recherche">
            <Search  class="icon-search" />
          </button>
          <h4 class="icon-search-title">Mes recherches</h4>
        </section>


        <section class="mobile-drawer__content--favorites">
            <NuxtLink to="#" class="mobile-drawer__content--favorites">
              <Heart class="icon-heart"  aria-label="Ouvrir les évènements favoris"/>
              <h4 class="icon-heart-title">Favoris</h4>
            </NuxtLink>
        </section>

        <section class="mobile-drawer__content--notifications" v-if="!isAuthenticated">
          <NuxtLink to="#" class="mobile-drawer__content--notifications">
            <Bell class="icon-notifications"  aria-label="Ouvrir les notifications"/>
            <h4 class="icon-notification-title">Notifications</h4>
          </NuxtLink>
        </section>

      </div>
      <div class="divider" v-if="!isAuthenticated"></div>

      <section class="mobile-drawer__content--profile" v-if="!isAuthenticated">
        <NuxtLink to="/auth/login" class="profile-login-link" @click="$emit('closeDrawer')">

        <div class="profile-picture-wrapper">
          <section class="profile-picture-wrapper--chevron">
          <ChevronLeft />
          </section>
          <section class="profile-picture-wrapper--profile">
            <label for="profile-upload" class="cursor-pointer display-inline-block">
              <img
                  :src="profileImageSrc"
                  alt="Photo de profil"
                  class="w-15 h-15 rounded-full object-cover border-2 border-primary hover:border-primary"
              />
              <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  @change="onFileChange"
                  class="hidden"
              />
            </label>
            <h4>{{ props.userFirstName || 'Utilisateur' }}</h4>
          </section>
        </div>
        </NuxtLink>

      </section>


      <div class="divider"></div>
      <div class="mobile-drawer__footer">
        <div class="right-actions">

          <div v-if="isAuthenticated" class="auth-buttons">

           <HeaderAuthModalAuth />
          </div>

          <div v-else class="btn btn-primary">
            <button @click="handleLogout" class="text-neutral">Déconnexion</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">

@use '@/assets/css/variables' as vars;


.divider {
  width: 100%;
  height: 1px;
  background-color: #e5e7eb;
  padding: 0;
  margin: 0;
}

.mobile-drawer__header,
.mobile-drawer__content,
.mobile-drawer__footer
{
  padding: 0 1rem;
}

.profile-login-link {
  text-align: center;
  font-size: 14px;
  margin-top: 0.5rem;
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


.mobile-drawer{
  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    &--profile {
      gap: 0.5rem;
      padding-bottom: 1rem;
      padding-right: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: rgba(vars.$color-accent, 0.2);
      }

      .profile-picture-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .profile-picture-wrapper--profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .profile-picture-wrapper--chevron {
        cursor: pointer;
        display: flex;
        align-items: center; /* Centre verticalement la flèche */
      }

      .profile-picture {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #ccc;
        transition: border-color 0.2s;

        &:hover {
          border-color: #1e90ff;
        }
      }
    }

    &--search {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-bottom: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: rgba(vars.$color-accent, 0.2);
      }


      .icon-search {
        width: 1.1rem;
        height: 1.1rem;
      }

      .icon-search-title {
        font-size: 1.1rem;
        color: #4b5563;
        font-weight: bold;
        padding-top: 0.05rem;
        cursor: pointer;
      }
    }

    &--favorites{
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-bottom: 0.5rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: rgba(vars.$color-accent, 0.2);
      }

      .icon-heart {
        width: 1.1rem;
        height: 1.1rem;
      }

      .icon-heart-title {
        font-size: 1.1rem;
        color: #4b5563;
        font-weight: bold;
        padding-top: 0.05rem;
        cursor: pointer;
      }
    }

    &--notifications {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-bottom: 0.5rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: rgba(vars.$color-accent, 0.2);
      }


      .icon-notifications {
        width: 1.1rem;
        height: 1.1rem;
      }

      .icon-notification-title {
        font-size: 1.1rem;
        color: #4b5563;
        font-weight: bold;
        padding-top: 0.05rem;
        cursor: pointer;
      }
    }
  }
  &__footer {
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

/* Bouton à gauche */
.mobile-drawer__header-button {
  position: absolute;
  left: 0;
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

/* Logo centré */
.logo-link {
  display: flex;
  justify-content: center;
  align-items: center;
}


.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9998;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 60vh;
  width: 80%;
  max-width: 450px;
  background-color: #fff;
  z-index: 9999;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 465px) {
    width: 100%;
    max-width: 100%;
  }
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.5s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

</style>