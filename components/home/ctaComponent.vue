<script setup lang="ts">
  import { ArrowRight } from 'lucide-vue-next'

  const { t } = useI18n()

  const props = defineProps<{
    startSearching: boolean
    isVisible: boolean
  }>()
</script>

<template>
  <div class="home-cta">
    <section v-if="!props.startSearching" id="cta-section" class="py-16 px-4 bg-base-100">
      <div
        class="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 md:p-12 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 slide-in-up"
        :class="{ visible: isVisible }"
      >
        <h2 class="text-3xl font-bold mb-4">{{ t('cta.title') }}</h2>
        <p class="text-base-content/80 max-w-2xl mx-auto mb-8">
          {{ t('cta.description') }}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="#search-section"
            class="btn btn-primary btn-lg group hover:scale-105 transition-transform duration-300"
          >
            {{ t('cta.button') }}
            <ArrowRight
              class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
            />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
