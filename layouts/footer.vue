<template>
  <client-only>
  <footer class="bg-base-200 text-base-content py-6 mt-8 border-t">
    <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" class="h-8 w-8" />
        <span class="font-bold text-lg">Benevoclic</span>
      </div>
      <nav class="flex flex-wrap gap-4 text-sm">
        <NuxtLink to="/" class="link link-hover">Accueil</NuxtLink>
        <NuxtLink to="/dashboard" class="link link-hover">Tableau de bord</NuxtLink>
        <NuxtLink to="/association/events/association/manage" class="link link-hover">Événements</NuxtLink>
        <NuxtLink to="/help" class="link link-hover">Aide</NuxtLink>
        <NuxtLink to="/contact" class="link link-hover">Contact</NuxtLink>
        <NuxtLink to="/mentions-legales" class="link link-hover">Mentions légales</NuxtLink>
        <NuxtLink to="/confidentialite" class="link link-hover">Confidentialité</NuxtLink>
        <a href="#" @click.prevent="openCookieSettings" class="link link-hover">Paramètres des cookies</a>
      </nav>
      <div class="text-xs text-gray-400 mt-2 md:mt-0">&copy; {{ new Date().getFullYear() }} Benevoclic. Tous droits réservés.</div>
    </div>
  </footer>
  </client-only>
</template>

<script setup lang="ts">
// Function to open cookie settings
function openCookieSettings() {
  // Find the CookieConsent component and call its openSettings method
  const cookieConsent = document.querySelector('#cookie-consent');
  if (cookieConsent && typeof cookieConsent.__vueParentComponent?.ctx?.openSettings === 'function') {
    cookieConsent.__vueParentComponent.ctx.openSettings();
  } else {
    // If the component is not found, create a new instance of it
    const event = new CustomEvent('openCookieSettings');
    window.dispatchEvent(event);
  }
}
</script> 
