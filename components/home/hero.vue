<script setup lang="ts">
  import { ArrowRight } from 'lucide-vue-next'

  const props = defineProps<{
    startSearching: boolean
  }>()

  const { t } = useI18n()
</script>

<template>
  <div class="hero">
    <ClientOnly>
      <section
        v-if="!props.startSearching"
        id="hero-section"
        class="hero min-h-[70vh] bg-gradient-to-br from-primary/10 to-secondary/10 py-16 px-4 flex items-center relative"
      >
        <div class="max-w-6xl mx-auto w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-6 slide-in-left visible">
              <h1 class="text-4xl md:text-5xl font-bold text-base-content">
                {{ t('hero.title.main') }}
                <span class="text-primary">{{ t('hero.title.brand') }}</span>
              </h1>
              <p class="text-lg text-base-content/80 max-w-xl">
                {{ t('hero.description') }}
              </p>
              <div class="flex flex-wrap gap-4">
                <NuxtLink to="#search-section" class="btn btn-primary group">
                  {{ t('hero.actions.discover_events') }}
                  <ArrowRight
                    class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  />
                </NuxtLink>
              </div>
            </div>
            <div class="relative slide-in-right visible delay-400 hidden lg:block">
              <img
                src="/images/volunteer-info.png"
                :alt="t('hero.image.alt')"
                class="w-full h-auto rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>
  </div>
</template>

<style scoped></style>
