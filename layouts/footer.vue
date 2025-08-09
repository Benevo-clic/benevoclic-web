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
          <img
            src="/logo.png"
            alt="Logo Benevoclic"
            class="h-8 w-8"
            width="32"
            height="32"
          >
          <span class="font-bold text-lg">Benevoclic</span>
        </div>
        <nav
          class="flex flex-wrap gap-4 text-sm"
          role="navigation"
          aria-label="Navigation du pied de page"
        >
          <NuxtLink
            to="/"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Accueil
          </NuxtLink>
          <NuxtLink
            to="/dashboard"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Tableau de bord
          </NuxtLink>
          <NuxtLink
            to="/association/events/association/manage"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Événements
          </NuxtLink>
          <NuxtLink
            to="/help"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Aide
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Contact
          </NuxtLink>
          <NuxtLink
            to="/mentions-legales"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Mentions légales
          </NuxtLink>
          <NuxtLink
            to="/confidentialite"
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            Confidentialité
          </NuxtLink>
          <button
            class="link link-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="Ouvrir les paramètres des cookies"
            type="button"
            @click.prevent="openCookieSettings"
          >
            Paramètres des cookies
          </button>
        </nav>
      </div>
    </footer>
  </client-only>
</template>

<script setup lang="ts">
// Function to open cookie settings
function openCookieSettings () {
  // Find the CookieConsent component and call its openSettings method
  const cookieConsent = document.querySelector('#cookie-consent')
  if (cookieConsent) {
    // Use a more type-safe approach
    const vueComponent = (cookieConsent as any).__vueParentComponent
    if (
      vueComponent?.ctx?.openSettings &&
      typeof vueComponent.ctx.openSettings === 'function'
    ) {
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
