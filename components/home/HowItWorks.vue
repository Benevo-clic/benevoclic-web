<script setup lang="ts">
  const props = defineProps<{
    startSearching: boolean
    isVisible: boolean
  }>()
</script>

<template>
  <div class="how-it-works">
    <section v-if="!props.startSearching" id="how-it-works-section" class="py-16 px-4 bg-base-100">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 slide-in-up" :class="{ visible: props.isVisible }">
          <h2 class="text-3xl font-bold mb-4">Comment ça marche ?</h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            Participer à un événement ou rejoindre une mission n'a jamais été aussi simple. Suivez
            ces étapes pour trouver l'événement qui vous correspond, que vous soyez bénévole ou
            personne à la recherche d'aide.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <!-- Ligne de connexion entre les étapes (visible uniquement sur desktop) -->
          <div class="absolute top-8 left-0 w-full h-1 bg-base-300 hidden md:block z-0">
            <div
              class="absolute top-0 left-0 h-full bg-primary transition-all duration-1000"
              :style="{ width: props.isVisible ? '100%' : '0%' }"
            />
          </div>

          <!-- Étape 1 -->
          <div
            class="flex flex-col items-center text-center slide-in-up"
            :class="{ visible: props.isVisible }"
          >
            <div
              class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 z-10"
            >
              1
            </div>
            <h3 class="text-xl font-bold mb-3">Trouvez un événement</h3>
            <p class="text-base-content/70">
              Parcourez les annonces ou utilisez les filtres pour trouver un événement qui
              correspond à vos besoins ou compétences.
            </p>
          </div>

          <!-- Étape 2 -->
          <div
            class="flex flex-col items-center text-center slide-in-up delay-300"
            :class="{ visible: props.isVisible }"
          >
            <div
              class="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 z-10"
            >
              2
            </div>
            <h3 class="text-xl font-bold mb-3">Inscrivez-vous en quelques clics</h3>
            <p class="text-base-content/70">
              Inscrivez-vous à l'événement directement via la plateforme. Vous pouvez préciser votre
              rôle (bénévole ou participant) et ajouter un message.
            </p>
          </div>

          <!-- Étape 3 -->
          <div
            class="flex flex-col items-center text-center slide-in-up delay-600"
            :class="{ visible: props.isVisible }"
          >
            <div
              class="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 z-10"
            >
              3
            </div>
            <h3 class="text-xl font-bold mb-3">Participez</h3>
            <p class="text-base-content/70">
              Une fois votre inscription confirmée, vous recevrez tous les détails pour participer à
              l'événement, que ce soit en tant que bénévole ou bénéficiaire.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
