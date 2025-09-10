<template>
  <client-only>
    <footer
      class="bg-base-200 text-base-content py-6 mt-8 border-t min-h-[120px] flex flex-col justify-center"
      role="contentinfo"
    >
      <div
        class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div class="flex items-center gap-2">
          <img src="/logo.png" alt="Logo Benevoclic" class="h-8 w-8" width="32" height="32" />
          <span class="font-bold text-lg">Benevoclic</span>
        </div>
        <nav
          class="flex flex-wrap gap-4 text-sm"
          role="navigation"
          :aria-label="$t('footer.navigation_label')"
        >
          <NuxtLink
            to="/"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {{ $t('footer.home') }}
          </NuxtLink>
          <NuxtLink
            to="/help"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {{ $t('footer.help') }}
          </NuxtLink>
          <NuxtLink
            to="/mentions-legales"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {{ $t('footer.legal_notices') }}
          </NuxtLink>
          <NuxtLink
            to="/confidentialite"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {{ $t('footer.privacy') }}
          </NuxtLink>
          <button
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            :aria-label="$t('footer.cookie_settings_aria')"
            type="button"
            @click.prevent="openCookieSettings"
          >
            {{ $t('footer.cookie_settings') }}
          </button>
        </nav>
      </div>
    </footer>
  </client-only>
</template>

<script setup lang="ts">
  // Function to open cookie settings
  function openCookieSettings() {
    // Find the CookieConsent component and call its openSettings method
    const cookieConsent = document.querySelector('#cookie-consent')
    if (cookieConsent) {
      // Use a more type-safe approach
      const vueComponent = (cookieConsent as any).__vueParentComponent
      if (vueComponent?.ctx?.openSettings && typeof vueComponent.ctx.openSettings === 'function') {
        vueComponent.ctx.openSettings()
      } else {
        // If the component is not found, create a new instance of it
        const event = new CustomEvent('openCookieSettings')
        window.dispatchEvent(event)
      }
    } else {
      // If the component is not found, create a new instance of it
      const event = new CustomEvent('openCookieSettings')
      window.dispatchEvent(event)
    }
  }
</script>
