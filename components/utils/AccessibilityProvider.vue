<template>
  <div>
    <!-- Skip links pour l'accessibilité -->
    <nav class="skip-links" aria-label="Liens d'accessibilité">
      <a 
        href="#main-content" 
        class="skip-link"
        @click="handleSkipLink"
      >
        Passer au contenu principal
      </a>
      <a 
        href="#main-navigation" 
        class="skip-link"
        @click="handleSkipLink"
      >
        Passer à la navigation
      </a>
      <a 
        href="#footer" 
        class="skip-link"
        @click="handleSkipLink"
      >
        Passer au pied de page
      </a>
    </nav>

    <!-- Annonceur de statut pour les lecteurs d'écran -->
    <div 
      id="status-announcer" 
      class="sr-only" 
      aria-live="polite" 
      aria-atomic="true"
      ref="statusAnnouncer"
    ></div>

    <!-- Slot pour le contenu -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const statusAnnouncer = ref<HTMLElement>()

// Gestion des liens de saut
const handleSkipLink = (event: Event) => {
  event.preventDefault()
  const target = event.target as HTMLAnchorElement
  const targetId = target.getAttribute('href')?.substring(1)
  
  if (targetId) {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.focus()
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// Fonction pour annoncer des messages aux lecteurs d'écran
const announceStatus = (message: string) => {
  if (statusAnnouncer.value) {
    statusAnnouncer.value.textContent = message
    // Effacer le message après un délai pour permettre la lecture
    setTimeout(() => {
      if (statusAnnouncer.value) {
        statusAnnouncer.value.textContent = ''
      }
    }, 1000)
  }
}

// Exposer la fonction pour les composants enfants
defineExpose({
  announceStatus
})

// Gestion du focus pour l'accessibilité
onMounted(() => {
  // Gestion du focus trap pour les modales
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  })
})
</script>

<style scoped>
.skip-links {
  position: absolute;
  top: -40px;
  left: 6px;
  z-index: 1000;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #3B82F6;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Amélioration du focus visible */
:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .skip-link {
    background: #60A5FA;
  }
  
  :focus-visible {
    outline-color: #60A5FA;
  }
}

/* Réduction des animations pour les utilisateurs qui le préfèrent */
@media (prefers-reduced-motion: reduce) {
  .skip-link {
    transition: none;
  }
}
</style> 