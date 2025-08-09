<script setup lang="ts">
const props = defineProps<{
  startSearching: boolean;
  isVisible: boolean;
  animatedStats: {
    events: number;
    associations: number;
    volunteers: number;
  };
}>()
</script>

<template>
  <div class="statistique">
    <section
      v-if="!props.startSearching"
      id="stats-section"
      class="py-16 px-4 bg-base-200"
    >
      <div class="max-w-6xl mx-auto">
        <div
          class="text-center mb-12 slide-in-up"
          :class="{ visible: props.isVisible }"
        >
          <h2 class="text-3xl font-bold mb-4">
            Benevoclic en chiffres
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            Rejoignez notre communauté grandissante et participez à des
            événements qui font la différence.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-200"
            :class="{ visible: props.isVisible }"
          >
            <div class="text-4xl font-bold text-primary mb-2 counter-animate">
              {{ props.animatedStats.events }}
            </div>
            <div class="text-xl font-semibold mb-2">
              Événements
            </div>
            <p class="text-base-content/70">
              Événements disponibles sur notre plateforme pour vous engager et
              faire la différence.
            </p>
          </div>

          <div
            class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-400"
            :class="{ visible: isVisible }"
          >
            <div class="text-4xl font-bold text-secondary mb-2 counter-animate">
              {{ animatedStats.associations }}
            </div>
            <div class="text-xl font-semibold mb-2">
              Associations
            </div>
            <p class="text-base-content/70">
              Associations actives qui proposent des missions et événements
              variés.
            </p>
          </div>

          <div
            class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-600"
            :class="{ visible: isVisible }"
          >
            <div class="text-4xl font-bold text-accent mb-2 counter-animate">
              {{ animatedStats.volunteers }}
            </div>
            <div class="text-xl font-semibold mb-2">
              Bénévole<span v-if="animatedStats.volunteers > 1">s</span> &
              participant<span v-if="animatedStats.volunteers > 1">s</span>
            </div>
            <p class="text-base-content/70">
              Nombre de bénévoles et participants engagés dans des actions
              solidaires.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
