<script setup lang="ts">
import {
  Award,
  Clock,
  HeartHandshake,
  Search,
  Shield,
  Users
} from 'lucide-vue-next'

const props = defineProps<{
  startSearching: boolean;
  isVisible: boolean;
}>()
</script>

<template>
  <div class="home-advantage">
    <section
      v-if="!props.startSearching"
      id="benefits-section"
      class="py-16 px-4 bg-base-200"
    >
      <div class="max-w-6xl mx-auto">
        <div
          class="text-center mb-12 slide-in-up"
          :class="{ visible: isVisible }"
        >
          <h2 class="text-3xl font-bold mb-4">
            Pourquoi rejoindre Benevoclic ?
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            Notre plateforme permet aux associations de promouvoir leurs
            événements et de connecter à la fois les bénévoles et les personnes
            dans le besoin avec des actions solidaires qui leur correspondent.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Carte 1 -->
          <div
            class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up"
            :class="{ visible: props.isVisible }"
          >
            <div class="card-body">
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300"
                >
                  <Search class="h-6 w-6 text-primary" />
                </div>
                <h3 class="card-title text-xl">
                  Trouvez facilement
                </h3>
              </div>
              <p class="text-base-content/70">
                Accédez à des milliers d'événements et de missions filtrés selon
                vos besoins, préférences et votre localisation, que vous
                cherchiez à aider ou à participer.
              </p>
            </div>
          </div>

          <!-- Carte 2 -->
          <div
            class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-200"
            :class="{ visible: props.isVisible }"
          >
            <div class="card-body">
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors duration-300"
                >
                  <Clock class="h-6 w-6 text-secondary" />
                </div>
                <h3 class="card-title text-xl">
                  Gérez votre temps
                </h3>
              </div>
              <p class="text-base-content/70">
                Choisissez des missions adaptées à vos disponibilités, qu'il
                s'agisse d'un engagement ponctuel ou régulier.
              </p>
            </div>
          </div>

          <!-- Carte 3 -->
          <div
            class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-400"
            :class="{ visible: props.isVisible }"
          >
            <div class="card-body">
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors duration-300"
                >
                  <Award class="h-6 w-6 text-accent" />
                </div>
                <h3 class="card-title text-xl">
                  Développez vos compétences
                </h3>
              </div>
              <p class="text-base-content/70">
                Mettez en pratique vos talents ou acquérez de nouvelles
                compétences valorisables dans votre parcours.
              </p>
            </div>
          </div>

          <!-- Carte 4 -->
          <div
            class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-200"
            :class="{ visible: props.isVisible }"
          >
            <div class="card-body">
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300"
                >
                  <Users class="h-6 w-6 text-primary" />
                </div>
                <h3 class="card-title text-xl">
                  Rejoignez une communauté
                </h3>
              </div>
              <p class="text-base-content/70">
                Connectez-vous avec d'autres bénévoles partageant vos valeurs et
                élargissez votre réseau.
              </p>
            </div>
          </div>

          <!-- Carte 5 -->
          <div
            class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-400"
            :class="{ visible: props.isVisible }"
          >
            <div class="card-body">
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors duration-300"
                >
                  <HeartHandshake class="h-6 w-6 text-secondary" />
                </div>
                <h3 class="card-title text-xl">
                  Faites la différence
                </h3>
              </div>
              <p class="text-base-content/70">
                Contribuez concrètement à des causes qui vous tiennent à cœur et
                ayez un impact positif sur la société.
              </p>
            </div>
          </div>

          <!-- Carte 6 -->
          <div
            class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-600"
            :class="{ visible: props.isVisible }"
          >
            <div class="card-body">
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors duration-300"
                >
                  <Shield class="h-6 w-6 text-accent" />
                </div>
                <h3 class="card-title text-xl">
                  Sécurité garantie
                </h3>
              </div>
              <p class="text-base-content/70">
                Toutes les associations sont vérifiées et les missions sont
                encadrées pour assurer votre sécurité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
