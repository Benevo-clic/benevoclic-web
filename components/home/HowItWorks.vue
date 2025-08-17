<script setup lang="ts">
  const { t } = useI18n()

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
          <h2 class="text-3xl font-bold mb-4">{{ t('howItWorks.title') }}</h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            {{ t('howItWorks.description') }}
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
            <h3 class="text-xl font-bold mb-3">{{ t('howItWorks.steps.step1.title') }}</h3>
            <p class="text-base-content/70">
              {{ t('howItWorks.steps.step1.description') }}
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
            <h3 class="text-xl font-bold mb-3">{{ t('howItWorks.steps.step2.title') }}</h3>
            <p class="text-base-content/70">
              {{ t('howItWorks.steps.step2.description') }}
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
            <h3 class="text-xl font-bold mb-3">{{ t('howItWorks.steps.step3.title') }}</h3>
            <p class="text-base-content/70">
              {{ t('howItWorks.steps.step3.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
