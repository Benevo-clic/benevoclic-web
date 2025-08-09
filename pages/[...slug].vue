<template>
  <div class="error-page">
    <div class="error-content">
      <h1>404</h1>
      <h2>Page non trouvée</h2>
      <p>La page que vous recherchez n'existe pas.</p>
      <button
        class="btn-primary"
        type="button"
        focus:outline-none
        focus:ring-2
        focus:ring-primary
        focus:ring-offset-2
        @click="goHome"
      >
        Retour à l'accueil
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'

const { navigateToHome } = useNavigation()

const goHome = () => {
  navigateToHome()
}

// Définir le titre de la page
useHead({
  title: 'Page non trouvée - Benevoclic'
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.error-content {
  max-width: 500px;
}

h1 {
  font-size: 6rem;
  font-weight: bold;
  color: #ef4444;
  margin: 0;
}

h2 {
  font-size: 2rem;
  margin: 1rem 0;
  color: #374151;
}

p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style>
