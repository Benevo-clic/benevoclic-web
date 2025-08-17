<script setup lang="ts">
  const { t } = useI18n()

  const props = defineProps<{
    startSearching: boolean
    isVisible: boolean
    animatedStats: {
      events: number
      associations: number
      volunteers: number
    }
  }>()
</script>

<template>
  <div class="statistique">
    <section v-if="!props.startSearching" id="stats-section" class="py-16 px-4 bg-base-200">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 slide-in-up" :class="{ visible: props.isVisible }">
          <h2 class="text-3xl font-bold mb-4">{{ t('statistics.title') }}</h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            {{ t('statistics.description') }}
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
            <div class="text-xl font-semibold mb-2">{{ t('statistics.cards.events.title') }}</div>
            <p class="text-base-content/70">
              {{ t('statistics.cards.events.description') }}
            </p>
          </div>

          <div
            class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-400"
            :class="{ visible: isVisible }"
          >
            <div class="text-4xl font-bold text-secondary mb-2 counter-animate">
              {{ animatedStats.associations }}
            </div>
            <div class="text-xl font-semibold mb-2">{{ t('statistics.cards.associations.title') }}</div>
            <p class="text-base-content/70">
              {{ t('statistics.cards.associations.description') }}
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
              {{ animatedStats.volunteers > 1 ? t('statistics.cards.volunteers.title_plural') : t('statistics.cards.volunteers.title_singular') }}
            </div>
            <p class="text-base-content/70">
              {{ t('statistics.cards.volunteers.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
