<script setup lang="ts">

import VolunteerAnnouncementCard from "~/components/event/volunteer/VolunteerAnnouncementCard.vue";
import type {Announcement} from "~/common/interface/event.interface";

const props = defineProps<{
  startSearching: boolean;
  isVisible: boolean;
  animatedStats: {
    events: number;
    associations: number;
    volunteers: number;
  };
  featuredEvents: Announcement[];
  isLoading: boolean;
  error: string | null;
}>();

</script>

<template>
  <div class="events">
    <section v-if="!props.startSearching" id="events-section" class="py-16 px-4 bg-base-100">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 slide-in-up" :class="{ 'visible': props.isVisible }">
          <h2 class="text-3xl font-bold mb-4">Événements à venir</h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            Découvrez les prochains événements et rejoignez-les en tant que bénévole ou participant.
          </p>
        </div>

        <div v-if="props.isLoading" class="flex justify-center items-center h-64">
          <div class="loading loading-spinner loading-lg text-primary"></div>
        </div>

        <div v-else-if="props.error" class="alert alert-error shadow-lg slide-in-up" :class="{ 'visible': props.isVisible }">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ props.error }}</span>
          </div>
        </div>

        <div v-else-if="props.featuredEvents.length === 0" class="text-center py-12 slide-in-up" :class="{ 'visible': props.isVisible }">
          <img
              src="/images/no_data.png"
              alt="Aucun événement trouvé"
              class="w-full max-w-md mx-auto mb-4"
              loading="lazy"
          />
          <p class="text-lg text-base-content/70">Aucun événement à venir pour le moment.</p>
        </div>

        <div v-else class="w-full slide-in-up" :class="{ 'visible': props.isVisible }">
          <!-- Carousel pour les événements à venir -->
          <div class="carousel w-full rounded-box relative">
            <div
                v-for="(event, index) in props.featuredEvents"
                :key="event._id"
                :id="`event-slide-${index}`"
                class="carousel-item relative w-full md:w-1/2 lg:w-1/3 px-2"
            >
              <VolunteerAnnouncementCard
                  :announcement="event"
                  class="w-full h-full"
                  :is-connected="false"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>