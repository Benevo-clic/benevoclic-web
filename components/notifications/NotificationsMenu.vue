<template>
  <div
    class="bg-base-100 rounded-lg shadow-md p-4"
    role="region"
    aria-labelledby="notifications-menu-title"
  >
    <h2 id="notifications-menu-title" class="text-xl font-semibold mb-4 text-base-content">
      {{ t('drawer-content.notifications_support.title') }}
    </h2>
    <nav role="navigation" aria-label="Menu des notifications et support">
      <ul class="menu menu-vertical w-full" role="menu">
        <li v-if="isAuthenticated" role="none">
          <NuxtLink
            to="/notifications"
            class="flex items-center gap-2 p-2 rounded hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            role="menuitem"
            aria-label="Voir mes notifications"
          >
            <Bell class="w-5 h-5" aria-hidden="true" />
            <span>{{ t('drawer-content.notifications_support.notifications') }}</span>
          </NuxtLink>
        </li>
        <li role="none">
          <NuxtLink
            to="/help"
            class="flex items-center gap-2 p-2 rounded hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            role="menuitem"
            aria-label="Aide et support"
          >
            <CircleHelp class="w-5 h-5" aria-hidden="true" />
            <span>{{ t('drawer-content.notifications_support.help') }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
  import { Bell, CircleHelp } from 'lucide-vue-next'
  import { useUser } from '~/composables/auth/useUser'
  const { t } = useI18n()
  const { isAuthenticated } = useUser()
</script>

<style scoped>
  /* Amélioration de l'accessibilité pour les liens */
  a:focus-visible {
    outline: 2px solid #eb5577;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Amélioration du contraste pour les utilisateurs en mode high-contrast */
  @media (prefers-contrast: more) {
    .menu li a {
      border: 1px solid currentColor;
    }
  }

  /* Respect des préférences de réduction de mouvement */
  @media (prefers-reduced-motion: reduce) {
    .menu li a {
      transition: none;
    }
  }
</style>
