<template>
  <div
      class="card card-compact bg-base-100 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer hover:cursor-pointer"
      @click="goToDetails"
  >
    <!-- Announcement Image -->
    <figure v-if="announcement.announcementImage?.data">
      <img :src="coverImageUrl" alt="Announcement Image" class="w-full h-48 object-cover" />
    </figure>

    <div class="card-body">
      <div class="flex justify-between items-center">
        <!-- Association Logo and Name -->
        <div class="flex items-center gap-2">
          <div v-if="announcement.associationLogo?.data" class="avatar">
            <div class="w-10 h-10 rounded-full">
              <img :src="profileImageUrl" alt="Association Logo" />
            </div>
          </div>
<!--          <p class="text-sm font-medium">{{ announcement.associationName }}</p>-->
        </div>

        <!-- Status Badge -->
        <div class="badge badge-soft" :class="statusBadgeClass">{{ announcement.status }}</div>
      </div>
      <div class="divider mb-0 mt-0"></div>

      <h2 class="card-title justify-center">{{ announcement.nameEvent }}</h2>

      <p class="mb-1 text-sm text-base-content">
        {{ truncatedDescription }}
      </p>

      <div class="divider mb-1 mt-0"></div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="flex items-center">
          <Calendar class="h-4 w-4 mr-1"/>
          <strong>Date:</strong> {{ formatDate(announcement.dateEvent) }}
        </div>
        <div class="flex items-center">
          <HeartHandshake class="h-4 w-4 mr-1" />
          <strong> Bénévoles: </strong> {{announcement.nbVolunteers}}/{{ announcement.maxVolunteers }}
        </div>
        <div class="flex items-center">
          <Clock class="h-4 w-4 mr-1"/>
          <strong>Heure:</strong> {{ announcement.hoursEvent }}
        </div>
        <div class="flex items-center">
          <Users class="h-4 w-4 mr-1" />
          <strong> Participants: </strong> {{announcement.nbParticipants}}/{{ announcement.maxParticipants }}
        </div>
        <div v-if="announcement.locationAnnouncement" class="flex items-center">
          <MapPin class="h-4 w-4 mr-1"/>
          <strong>Lieu:</strong> {{ announcement.locationAnnouncement.city }}
        </div>

      </div>

      <!-- Tags -->
      <div class="card-actions justify-start mt-4">
        <div class="badge badge-outline" v-for="tag in announcement.tags" :key="tag">{{ tag }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Announcement } from '~/common/interface/event.interface';
import { EventStatus } from '~/common/enums/event.enum';
import {HeartHandshake,Users,Calendar,Clock,MapPin} from 'lucide-vue-next'
import { navigateTo } from '#app';

const props = defineProps<{
  announcement: Announcement;
}>();

const statusBadgeClass = computed(() => {
  switch (props.announcement.status) {
    case EventStatus.ACTIVE:
      return 'badge-success';
    case EventStatus.INACTIVE:
      return 'badge-warning';
    case EventStatus.COMPLETED:
      return 'badge-neutral';
    default:
      return 'badge-primary';
  }
});


const profileImageUrl = computed(() => {
  const img = props.announcement.associationLogo;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
})

const coverImageUrl = computed(() => {
  const img = props.announcement.announcementImage;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const MAX_LEN = 100

const truncatedDescription = computed(() => {
  const desc = props.announcement.description || ''
  return desc.length > MAX_LEN
      ? desc.substring(0, MAX_LEN) + '…'
      : desc
})

function goToDetails() {
  navigateTo(`/association/events/announcement/${props.announcement._id}`)
}
</script>
