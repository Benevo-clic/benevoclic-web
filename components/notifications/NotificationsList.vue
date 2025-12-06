<template>
  <div class="bg-base-100 rounded-xl shadow-sm border border-base-200">
    <!-- Header simple -->
    <div class="p-4 border-b border-base-200 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-bold text-base-content">
          {{ t('notifications.title') }}
        </h2>
        <span v-if="unreadCount > 0" class="badge badge-primary badge-sm">
          {{ unreadCount }} {{ t('notifications.new') }}
        </span>
      </div>

      <div class="flex items-center gap-2">
         <!-- Sort Dropdown -->
         <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm text-base-content/70">
              <ArrowUpDown class="w-4 h-4 mr-1" />
              <span class="hidden sm:inline">{{ sortBy === 'recent' ? t('notifications.sort.recent') : t('notifications.sort.oldest') }}</span>
            </div>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a @click="sortBy = 'recent'" :class="{ 'active': sortBy === 'recent' }">{{ t('notifications.sort.recent') }}</a></li>
              <li><a @click="sortBy = 'oldest'" :class="{ 'active': sortBy === 'oldest' }">{{ t('notifications.sort.oldest') }}</a></li>
            </ul>
         </div>

         <div class="divider divider-horizontal mx-0 h-6"></div>

         <button
            v-if="hasUnread"
            class="btn btn-ghost btn-sm text-primary hover:bg-primary/10"
            :disabled="isLoading"
            @click="markAllAsRead"
          >
            <Check class="w-4 h-4 mr-2" />
            <span class="hidden sm:inline">{{ t('notifications.mark_all_read') }}</span>
            <span class="sm:hidden">{{ t('notifications.mark_read') }}</span>
          </button>
          <button
            class="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-error"
            :title="t('notifications.refresh')"
            @click="refresh"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
          </button>
      </div>
    </div>

    <!-- Filtres (Tabs) -->
    <div class="px-4 pt-2 border-b border-base-200 bg-base-50/50 overflow-x-auto">
      <div class="flex gap-6">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="pb-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2"
          :class="activeFilter === filter.value 
            ? 'border-primary text-primary' 
            : 'border-transparent text-base-content/60 hover:text-base-content hover:border-base-300'"
          @click="activeFilter = filter.value"
        >
          <component :is="filter.icon" class="w-4 h-4" />
          {{ filter.label }}
          <span 
            class="badge badge-sm"
            :class="activeFilter === filter.value ? 'badge-primary' : 'badge-ghost'"
          >
            {{ filter.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Liste -->
    <div class="divide-y divide-base-200 min-h-[300px]">
      <div v-if="isLoading" class="flex flex-col items-center justify-center h-64 text-base-content/50">
        <span class="loading loading-spinner loading-md mb-2"></span>
        <span>Chargement...</span>
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center h-64 text-base-content/50">
        <div class="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-base-content/30">
          <Bell class="w-8 h-8" />
        </div>
        <p>{{ getEmptyStateMessage() }}</p>
      </div>

      <TransitionGroup name="list" tag="div" v-else>
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          class="group p-4 hover:bg-base-50 transition-colors relative"
          :class="{ 'bg-primary/5': !notification.isRead }"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              :class="!notification.isRead ? 'bg-primary/20 text-primary' : 'bg-base-200 text-base-content/50'"
            >
              <component :is="getIconForType(notification)" class="w-5 h-5" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start gap-2">
                <h3 
                  class="font-medium text-base-content"
                  :class="{ 'font-bold': !notification.isRead }"
                >
                  {{ notification.message }}
                </h3>
                <span class="text-xs text-base-content/50 whitespace-nowrap flex-shrink-0">
                  {{ formatRelative(notification.createdAt) }}
                </span>
              </div>
              
              <p class="text-sm text-base-content/70 mt-1 line-clamp-2">
                {{ notification.message }}
              </p>

              <!-- Actions Contextuelles -->
               <div class="flex items-center gap-3 mt-3">
                  <button 
                    v-if="notification.redirectUrl"
                    class="btn btn-xs btn-primary btn-outline"
                    @click="() => navigateTo(notification.redirectUrl!)"
                  >
                    {{ t('notifications.view') }}
                  </button>
                  
                  <div class="flex-1"></div>

                  <!-- Quick Actions (Hover) -->
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                     <button 
                        v-if="!notification.isRead"
                        class="btn btn-ghost btn-xs text-primary"
                        :title="t('notifications.mark_read')"
                        @click.stop="markAsRead(notification)"
                      >
                        <Check class="w-4 h-4" />
                      </button>
                      <button 
                        class="btn btn-ghost btn-xs text-base-content/50 hover:text-error"
                        :title="t('notifications.delete')"
                        @click.stop="removeNotification(notification.id)"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import {
    Bell,
    Check,
    X,
    MessageSquare,
    Calendar,
    Award,
    AlertCircle,
    Clock,
    Trash2,
    MapPin,
    RefreshCw,
    UserPlus,
    Handshake,
    ArrowUpDown
  } from 'lucide-vue-next'
  import { navigateTo } from '#app'
  import type { Notification } from '~/composables/useNotifications'

  const { t } = useI18n()
  
  // Props
  const props = defineProps<{
    notifications: Notification[]
    isLoading: boolean
    userRole?: string
  }>()

  // Emits
  const emit = defineEmits<{
    (e: 'mark-as-read', id: string): void
    (e: 'mark-all-read'): void
    (e: 'delete', id: string): void
    (e: 'refresh'): void
  }>()

  // State
  const activeFilter = ref('all')
  const sortBy = ref<'recent' | 'oldest'>('recent')

  // Computed properties
  const unreadCount = computed(() => {
    return props.notifications.filter(notification => !notification.isRead).length
  })

  const hasUnread = computed(() => {
    return unreadCount.value > 0
  })

  // Helper to get count by type (using standard types)
  function getCountByType(type: string): number {
    return props.notifications.filter(notification => getNotificationTypeCategory(notification) === type).length
  }

  // Derive category from notification type or content
  function getNotificationTypeCategory(notification: Notification): string {
    // Map backend types to frontend categories
    if (notification.type.includes('MESSAGE')) return 'message'
    
    // Membership: Requests for Assoc, Approved/Rejected for Volunteer
    if (notification.type.includes('MEMBERSHIP')) {
        return 'membership'
    }

    // Participation: Volunteer requests for Assoc, Approved/Rejected for Volunteer
    if (notification.type.includes('VOLUNTEER') || notification.type.includes('PARTICIPANT')) {
        // For Association, incoming requests are often grouped. 
        // But per USER request "separation des notification d'acceptation d'adhesion et aussi d'acception de demande de particiaption" for VOLUNTEER.
        // So for VOLUNTEER, these are 'participation'.
        // For Association, usually these are requests. 
        // Let's keep it simple: if it's volunteer/participant related, it's 'participation' category mostly.
        // However, in previous step we put VOLUNTEER_REQUEST in 'membership' for Association (Adhesions). 
        // Wait, the user said "pour les volunteer... separation des notification d'acceptation d'adhesion et aussi d'acception de demande de particiaption".
        
        // Let's look at types again:
        // VOLUNTEER_REQUEST (Assoc receives) -> arguably "Adhésion" to assoc or "Participation"? 
        // Usually Adhesion is being a member. Participation is joining an event.
        // But `MEMBERSHIP_REQUEST` is definitely Adhesion.
        // `VOLUNTEER_REQUEST` is usually "Je veux rejoindre l'asso" (General volunteer) OR "Je veux aider sur cet event".
        // In this system `VOLUNTEER_REQUEST` seems to be distinct from `PARTICIPANT_REQUEST` (Event).
        
        // Let's strictly follow the plan:
        // MEMBERSHIP_* -> membership
        // VOLUNTEER_*, PARTICIPANT_* -> participation
        return 'participation' 
    }

    if (notification.type.includes('EVENT') || notification.type.includes('REQUEST')) return 'event'
    
    if (notification.type.includes('MISSION')) return 'mission'
    if (notification.type.includes('ACHIEVEMENT')) return 'achievement'
    return 'alert' // default
  }

  const filters = computed(() => {
    const baseFilters = [
        {
        value: 'all',
        label: 'Toutes',
        icon: Bell,
        count: props.notifications.length
        },
        {
        value: 'unread',
        label: 'Non lues',
        icon: AlertCircle,
        count: unreadCount.value
        }
    ]

    // Role-specific tabs
    if (props.userRole === 'ASSOCIATION') {
        baseFilters.push({
            value: 'membership',
            label: t('notifications.tabs.membership'), // "Adhésions"
            icon: UserPlus,
            count: getCountByType('membership') + getCountByType('participation') // Grouping requests for now? 
            // Wait, previous step we had: 
            // if (type.includes('MEMBERSHIP') || type.includes('VOLUNTEER_REQUEST')) return 'membership'
            // Now we separated them. 
            // If the user wants separate tabs for VOLUNTEER too, we should respect that.
            // But for ASSOCIATION, the "Adhésions" tab usually contained requests.
            // If I change 'participation' category, I might break ASSOCIATION view if I don't include it. 
            // Let's make ASSOCIATION 'membership' tab include both membership and participation requests if that was the previous behavior logic, 
            // OR we can add a 'Participation' tab for Association too? 
            // The user request specifically mentioned "pour les volunteer". 
            // For ASSOCIATION, we previously successfully added "Adhésion".
            // Let's keep 'membership' for MEMBERSHIP types. 
            // And 'participation' for VOLUNTEER/PARTICIPANT types.
            // And for ASSOCIATION, maybe show both? Or group them?
            // "onglet adhesion ... qui contiendra les demande d'adhesion a l'association" -> strictly MEMBERSHIP_REQUEST.
            // What about VOLUNTEER_REQUEST? 
            // Let's assume 'membership' = MEMBERSHIP types.
            // 'participation' = VOLUNTEER/PARTICIPANT types.
        })
        // NOTE: For Association, maybe they want 'Participations' too? 
        // For now, let's just add 'Adhésions' (Membership) and maybe 'Participations' if meaningful?
        // Actually, let's stick to the prompt for VOLUNTEER.
        // For Association, I'll add 'participation' tab too if they have those notifications.
         baseFilters.push({
            value: 'participation',
            label: t('notifications.tabs.participation'),
            icon: Handshake,
            count: getCountByType('participation')
        })
    } else if (props.userRole === 'VOLUNTEER') {
         baseFilters.push({
            value: 'membership',
            label: t('notifications.tabs.membership'),
            icon: UserPlus,
            count: getCountByType('membership')
        })
         baseFilters.push({
            value: 'participation',
            label: t('notifications.tabs.participation'),
            icon: Handshake,
            count: getCountByType('participation')
        })
    }
    
    // Common tabs
    baseFilters.push({
        value: 'event',
        label: 'Événements',
        icon: Calendar,
        count: getCountByType('event')
    })

    baseFilters.push({
        value: 'message',
        label: 'Messages',
        icon: MessageSquare,
        count: getCountByType('message')
    })
    
    return baseFilters
  })

  const filteredNotifications = computed(() => {
    let result: Notification[] = []

    // 1. Filter
    if (activeFilter.value === 'all') {
      result = [...props.notifications]
    } else if (activeFilter.value === 'unread') {
      result = props.notifications.filter(notification => !notification.isRead)
    } else {
      result = props.notifications.filter(notification => getNotificationTypeCategory(notification) === activeFilter.value)
    }

    // 2. Sort
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy.value === 'recent' ? dateB - dateA : dateA - dateB
    })
  })

  // Methods
  function markAsRead(notification: Notification) {
    emit('mark-as-read', notification.id)
  }

  function markAllAsRead() {
    emit('mark-all-read')
  }

  function removeNotification(id: string) {
    emit('delete', id)
  }
  
  function refresh() {
    emit('refresh')
  }

  const { formatRelative, formatDate: formatDateFull } = useDate()


  function getIconForType(notification: Notification) {
    const category = getNotificationTypeCategory(notification)
    switch (category) {
      case 'message':
        return MessageSquare
      case 'event':
        return Calendar
      case 'achievement':
        return Award
      case 'mission':
        return MapPin
      case 'membership':
        return UserPlus
      case 'participation':
        return Handshake
      default:
        return Bell
    }
  }

  function getEmptyStateMessage(): string {
    switch (activeFilter.value) {
      case 'all':
        return "Vous n'avez aucune notification pour le moment."
      case 'unread':
        return "Vous n'avez aucune notification non lue."
      default:
        return `Vous n'avez aucune notification de ce type.`
    }
  }
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
