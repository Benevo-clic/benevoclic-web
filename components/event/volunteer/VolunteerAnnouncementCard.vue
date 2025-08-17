<template>
  <article
    class="group card bg-base-100 shadow-lg border border-base-300 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative text-base focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
    tabindex="0"
    role="button"
    :aria-label="
      t('volunteerAnnouncementCard.aria.event_details', {
        eventName: announcement.nameEvent,
        associationName: announcement.associationName
      })
    "
    :aria-describedby="`event-description-${announcement._id}`"
    @click="goToDetails"
    @keyup.enter="goToDetails"
    @keyup.space.prevent="goToDetails"
  >
    <!-- Image de couverture -->
    <div class="relative overflow-hidden">
      <figure class="h-36 bg-gradient-to-br from-base-200 to-base-300">
        <img
          v-if="announcement.announcementImage"
          :src="coverImageUrl"
          :alt="
            announcement.announcementImage
              ? t('volunteerAnnouncementCard.aria.event_image', {
                  eventName: announcement.nameEvent
                })
              : t('volunteerAnnouncementCard.aria.no_event_image')
          "
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width="400"
          height="144"
          loading="lazy"
          decoding="async"
        />
        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center text-base-content/60"
          :aria-label="t('volunteerAnnouncementCard.aria.no_image_available')"
        >
          <div class="avatar placeholder mb-2">
            <div class="bg-base-300 text-base-content rounded-full w-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium">{{ t('volunteerAnnouncementCard.content.no_image') }}</p>
        </div>
      </figure>

      <!-- Bouton favoris -->
      <button
        class="absolute top-2 right-2 z-10 btn btn-circle btn-sm bg-base-100/80 hover:bg-error/20 transition focus-visible:ring-2 focus-visible:ring-error ring-offset-2"
        :aria-pressed="favorite ? 'true' : 'false'"
        :aria-label="
          favorite
            ? t('volunteerAnnouncementCard.aria.remove_favorites')
            : t('volunteerAnnouncementCard.aria.add_favorites')
        "
        @click.stop="toggleFavorite"
        @keyup.enter="toggleFavorite"
        @keyup.space.prevent="toggleFavorite"
      >
        <span v-if="favorite">
          <Heart class="w-6 h-6 text-error fill-error" aria-hidden="true" />
        </span>
        <span v-else>
          <Heart class="h-6 w-6 text-base-content/60" aria-hidden="true" />
        </span>
      </button>
    </div>

    <div class="card-body p-5">
      <!-- Association info -->
      <div class="flex items-center gap-3 mb-2">
        <div class="avatar">
          <div class="w-12 h-12 rounded-full">
            <img
              v-if="announcement.associationLogo"
              :src="associationImageUrl"
              :alt="
                t('volunteerAnnouncementCard.aria.association_logo', {
                  associationName:
                    announcement.associationName ||
                    t('volunteerAnnouncementCard.content.association')
                })
              "
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
            />
            <div
              v-else
              class="w-full h-full bg-base-300 flex items-center justify-center"
              :aria-label="t('volunteerAnnouncementCard.aria.no_association_logo')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-base-content/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-sm">{{
            announcement.associationName || t('volunteerAnnouncementCard.content.association')
          }}</span>
          <span class="text-xs text-base-content/60">{{
            t('volunteerAnnouncementCard.content.organizer')
          }}</span>
        </div>
      </div>

      <!-- Titre -->
      <h3
        class="card-title text-lg font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors"
      >
        {{ announcement.nameEvent }}
      </h3>

      <!-- Description -->
      <p
        :id="`event-description-${announcement._id}`"
        class="text-sm text-base-content/70 mb-1 line-clamp-2 leading-relaxed"
      >
        {{ announcement.description }}
      </p>

      <!-- Date & Lieu -->
      <div class="flex items-center flex-wrap gap-4 mb-4 text-sm">
        <div
          class="flex items-center gap-2"
          :aria-label="t('volunteerAnnouncementCard.aria.event_date_time')"
        >
          <Calendar class="h-4 w-4 text-primary" aria-hidden="true" />
          <time :datetime="announcement.dateEvent" class="font-medium">
            {{
              new Date(announcement.dateEvent).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit'
              })
            }}
          </time>
          <span class="text-base-content/60" aria-hidden="true">•</span>
          <span>{{ announcement.hoursEvent }}</span>
        </div>
        <div
          v-if="announcement.addressAnnouncement?.city"
          class="flex items-center gap-2"
          :aria-label="t('volunteerAnnouncementCard.aria.event_location')"
        >
          <MapPin class="h-4 w-4 text-secondary" aria-hidden="true" />
          <span class="truncate max-w-[100px]">{{ announcement.addressAnnouncement.city }}</span>
        </div>
      </div>

      <!-- Participants & Bénévoles -->
      <div
        class="flex gap-6 mb-4 text-sm"
        role="group"
        :aria-label="t('volunteerAnnouncementCard.aria.participation_stats')"
      >
        <div
          class="flex items-center gap-2"
          :aria-label="t('volunteerAnnouncementCard.aria.participants_count')"
        >
          <Users class="h-4 w-4 text-primary" aria-hidden="true" />
          <span class="font-medium">{{ ParticipantAvailable(announcement as Announcement) }}</span>
          <span class="text-base-content/60">{{
            t('volunteerAnnouncementCard.content.participants')
          }}</span>
        </div>
        <div
          class="flex items-center gap-2"
          :aria-label="t('volunteerAnnouncementCard.aria.volunteers_count')"
        >
          <HeartHandshake class="h-4 w-4 text-secondary" aria-hidden="true" />
          <span class="font-medium"> {{ volunteerAvailable(announcement as Announcement) }} </span>
          <span class="text-base-content/60">{{
            t('volunteerAnnouncementCard.content.volunteers')
          }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex items-center justify-between">
        <!-- Tags -->
        <div
          v-if="announcement.tags?.length"
          class="flex flex-wrap gap-2"
          role="group"
          :aria-label="t('volunteerAnnouncementCard.aria.event_tags')"
        >
          <div
            v-for="tag in announcement.tags.slice(0, 2)"
            :key="tag"
            class="badge badge-outline text-sm hover:badge-primary transition-colors text-base-content border-base-content focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:bg-base-200 focus-visible:text-primary"
            tabindex="0"
            role="button"
            :aria-label="t('volunteerAnnouncementCard.aria.filter_by_tag', { tag })"
            @keyup.enter="filterByTag(tag)"
            @keyup.space.prevent="filterByTag(tag)"
          >
            <span class="text-base-content/70 group-hover:text-primary transition-colors">{{
              tag
            }}</span>
          </div>
          <div v-if="announcement.tags.length > 2" class="badge badge-ghost text-sm text-neutral">
            <span class="text-base-content/70 group-hover:text-primary transition-colors"
              >+{{ announcement.tags.length - 2 }}</span
            >
          </div>
        </div>

        <!-- Bouton Détails -->
        <div
          class="btn btn-primary btn-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        >
          {{ t('volunteerAnnouncementCard.content.details') }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { computed, watch, ref } from 'vue'
  import { Heart, HeartHandshake, Users, Calendar, MapPin } from 'lucide-vue-next'
  import { navigateTo } from '#app'
  import type { Announcement } from '~/common/interface/event.interface'

  const { t } = useI18n()

  const props = defineProps<{
    announcement: Announcement
    isFavorite?: boolean
    isConnected?: boolean
  }>()

  const favorite = ref(props.isFavorite)

  watch(
    () => props.isFavorite,
    newValue => {
      favorite.value = newValue
    },
    { immediate: true }
  )

  const coverImageUrl = computed(() => {
    return props.announcement.announcementImage
  })

  const associationImageUrl = computed(() => {
    return props.announcement.associationLogo
  })

  const emit = defineEmits(['favorite', 'participate', 'filter-by-tag'])

  function toggleFavorite() {
    favorite.value = !favorite.value
    emit('favorite', props.announcement)
  }

  function goToDetails() {
    if (!props.isConnected) {
      navigateTo(`/announcement/${props.announcement._id}`)
      return
    }
    navigateTo(`/volunteer/events/announcement/${props.announcement._id}`)
  }

  function volunteerAvailable(announcement: Announcement): string {
    if (announcement.maxVolunteers !== -1) {
      return `${announcement?.nbVolunteers}/${announcement?.maxVolunteers}`
    }
    return `${announcement?.nbVolunteers}`
  }

  function ParticipantAvailable(announcement: Announcement): string {
    if (announcement.maxParticipants !== -1) {
      return `${announcement?.nbParticipants}/${announcement?.maxParticipants}`
    }
    return `${announcement?.nbParticipants}`
  }

  function filterByTag(tag: string) {
    emit('filter-by-tag', tag)
  }
</script>
