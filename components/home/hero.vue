<script setup lang="ts">
  import { ArrowRight } from 'lucide-vue-next'

  const props = defineProps<{
    startSearching: boolean
  }>()
</script>

<template>
  <div class="hero">
    <section
      v-if="!props.startSearching"
      id="hero-section"
      class="hero min-h-[70vh] bg-gradient-to-br from-primary/10 to-secondary/10 py-16 px-4 flex items-center relative"
    >
      <div class="max-w-6xl mx-auto w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div class="space-y-6 slide-in-left visible">
            <h1 class="text-4xl md:text-5xl font-bold text-base-content">
              Faites la différence avec
              <span class="text-primary">Benevoclic</span>
            </h1>
            <p class="text-lg text-base-content/80 max-w-xl">
              Découvrez des événements et missions qui correspondent à vos compétences, vos centres
              d'intérêt et vos disponibilités. Que vous soyez bénévole ou personne dans le besoin,
              rejoignez une communauté engagée et participez à des projets solidaires.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="#search-section" class="btn btn-primary group">
                Découvrir les événements
                <ArrowRight
                  class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                />
              </NuxtLink>
              <button class="btn btn-outline hover:scale-105 transition-transform duration-300">
                En savoir plus
              </button>
            </div>
          </div>
          <div class="relative slide-in-right visible delay-400 hidden lg:block">
            <img
              src="/images/volunteer-info.png"
              alt="Bénévoles en action"
              class="w-full h-auto rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
