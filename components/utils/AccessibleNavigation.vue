<template>
  <!-- Liens de saut pour la navigation clavier -->
  <nav class="skip-links" role="navigation" aria-label="Navigation rapide">
    <NuxtLink to="/" class="skip-link focus:top-6">
      Aller à l'accueil
    </NuxtLink>
    <NuxtLink to="/help" class="skip-link focus:top-6">
      Aller à l'aide
    </NuxtLink>
    <NuxtLink to="/notifications" class="skip-link focus:top-6">
      Aller aux notifications
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
// Composant pour améliorer la navigation clavier
// Fournit des liens de saut pour les utilisateurs de lecteurs d'écran
</script>

<style scoped>
.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1001;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: top 0.2s ease;
  
  &:focus {
    top: 6px;
    outline: 2px solid white;
    outline-offset: 2px;
  }
  
  &:hover {
    background: #2563eb;
  }
}
</style> 