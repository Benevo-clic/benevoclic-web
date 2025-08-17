<script setup lang="ts">
  import { Award, Clock, HeartHandshake, Search, Shield, Users } from 'lucide-vue-next'

  const { t } = useI18n()

  const props = defineProps<{
    startSearching: boolean
    isVisible: boolean
  }>()
</script>

<template>
  <div class="home-advantage">
    <section v-if="!props.startSearching" id="benefits-section" class="py-16 px-4 bg-base-200">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 slide-in-up" :class="{ visible: isVisible }">
          <h2 class="text-3xl font-bold mb-4">{{ t('advantage.title') }}</h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            {{ t('advantage.description') }}
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
                <h3 class="card-title text-xl">{{ t('advantage.cards.find.title') }}</h3>
              </div>
              <p class="text-base-content/70">
                {{ t('advantage.cards.find.description') }}
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
                <h3 class="card-title text-xl">{{ t('advantage.cards.time.title') }}</h3>
              </div>
              <p class="text-base-content/70">
                {{ t('advantage.cards.time.description') }}
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
                <h3 class="card-title text-xl">{{ t('advantage.cards.skills.title') }}</h3>
              </div>
              <p class="text-base-content/70">
                {{ t('advantage.cards.skills.description') }}
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
                <h3 class="card-title text-xl">{{ t('advantage.cards.community.title') }}</h3>
              </div>
              <p class="text-base-content/70">
                {{ t('advantage.cards.community.description') }}
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
                <h3 class="card-title text-xl">{{ t('advantage.cards.impact.title') }}</h3>
              </div>
              <p class="text-base-content/70">
                {{ t('advantage.cards.impact.description') }}
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
                <h3 class="card-title text-xl">{{ t('advantage.cards.security.title') }}</h3>
              </div>
              <p class="text-base-content/70">
                {{ t('advantage.cards.security.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
