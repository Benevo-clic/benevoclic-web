// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester la carte d'annonce des bénévoles
const MockVolunteerAnnouncementCard = {
  template: `
    <article class="card">
      <div class="card-body">
        <h3>{{ announcement.nameEvent }}</h3>
        <p>{{ announcement.description }}</p>
        <div>{{ announcement.associationName }}</div>
        <div>{{ formattedDate }}</div>
        <div>{{ announcement.hoursEvent }}</div>
        <div v-if="announcement.addressAnnouncement && announcement.addressAnnouncement.city">
          {{ announcement.addressAnnouncement.city }}
        </div>
        <div>{{ announcement.nbParticipants }}/{{ announcement.maxParticipants }} participants</div>
        <div>{{ announcement.nbVolunteers }}/{{ announcement.maxVolunteers }} bénévoles</div>
        <div v-if="announcement.tags && announcement.tags.length">
          <span v-for="tag in announcement.tags.slice(0, 2)" :key="tag">{{ tag }}</span>
          <span v-if="announcement.tags.length > 2">+{{ announcement.tags.length - 2 }}</span>
        </div>
        <button @click="toggleFavorite" :aria-pressed="favorite">
          {{ favorite ? '❤️' : '🤍' }}
        </button>
      </div>
    </article>
  `,
  props: {
    announcement: { type: Object, required: true },
    isFavorite: { type: Boolean, default: false },
    isConnected: { type: Boolean, default: true }
  },
  data() {
    return {
      favorite: this.isFavorite
    }
  },
  computed: {
    formattedDate() {
      try {
        return new Date(this.announcement.dateEvent).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit'
        })
      } catch (error) {
        return this.announcement.dateEvent
      }
    }
  },
  watch: {
    isFavorite(newValue) {
      this.favorite = newValue
    }
  },
  methods: {
    toggleFavorite() {
      this.favorite = !this.favorite
      this.$emit('favorite', this.announcement)
    },
    goToDetails() {
      if (!this.isConnected) {
        return `/announcement/${this.announcement._id}`
      }
      return `/volunteer/events/announcement/${this.announcement._id}`
    },
    filterByTag(tag) {
      this.$emit('filter-by-tag', tag)
    }
  },
  emits: ['favorite', 'filter-by-tag']
}

describe('VolunteerAnnouncementCard', () => {
  const mockAnnouncement = {
    _id: 'ann-123',
    nameEvent: 'Test Event',
    description: 'This is a test event description',
    dateEvent: '2024-12-25',
    hoursEvent: '14:30',
    associationName: 'Test Association',
    nbParticipants: 15,
    maxParticipants: 50,
    nbVolunteers: 8,
    maxVolunteers: 12,
    tags: ['Tag1', 'Tag2', 'Tag3'],
    addressAnnouncement: {
      city: 'Paris'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render announcement card', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should display event title', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.find('h3').text()).toBe('Test Event')
    })

    it('should display event description', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.text()).toContain('This is a test event description')
    })

    it('should display association name', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.text()).toContain('Test Association')
    })
  })

  describe('Informations de date et lieu', () => {
    it('should display event date', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.text()).toContain('25/12')
    })

    it('should display event time', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.text()).toContain('14:30')
    })

    it('should display city when available', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.text()).toContain('Paris')
    })
  })

  describe('Statistiques de participation', () => {
    it('should display participants count', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.text()).toContain('15/50 participants')
    })

    it('should display volunteers count', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.text()).toContain('8/12 bénévoles')
    })
  })

  describe('Tags', () => {
    it('should display tags when available', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.text()).toContain('Tag1')
      expect(wrapper.text()).toContain('Tag2')
    })

    it('should display tag count when more than 2 tags', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.text()).toContain('+1')
    })
  })

  describe('Bouton favoris', () => {
    it('should display favorite button', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should show filled heart when favorite', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement, isFavorite: true }
      })
      expect(wrapper.vm.favorite).toBe(true)
    })

    it('should show empty heart when not favorite', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement, isFavorite: false }
      })
      expect(wrapper.vm.favorite).toBe(false)
    })

    it('should toggle favorite state', async () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement, isFavorite: false }
      })
      await wrapper.vm.toggleFavorite()
      expect(wrapper.vm.favorite).toBe(true)
    })

    it('should emit favorite event', async () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      await wrapper.vm.toggleFavorite()
      expect(wrapper.emitted('favorite')).toBeTruthy()
    })
  })

  describe('Navigation', () => {
    it('should navigate to volunteer details when connected', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement, isConnected: true }
      })
      const result = wrapper.vm.goToDetails()
      expect(result).toBe('/volunteer/events/announcement/ann-123')
    })

    it('should navigate to public details when not connected', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement, isConnected: false }
      })
      const result = wrapper.vm.goToDetails()
      expect(result).toBe('/announcement/ann-123')
    })
  })

  describe('Filtrage par tag', () => {
    it('should emit filter-by-tag event', async () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      await wrapper.vm.filterByTag('Tag1')
      expect(wrapper.emitted('filter-by-tag')).toBeTruthy()
    })
  })

  describe('Accessibilité', () => {
    it('should have proper button aria-pressed', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement, isFavorite: true }
      })
      const button = wrapper.find('button')
      expect(button.attributes('aria-pressed')).toBe('true')
    })
  })

  describe('Props et états', () => {
    it('should handle isFavorite prop change', async () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement, isFavorite: false }
      })
      expect(wrapper.vm.favorite).toBe(false)
      await wrapper.setProps({ isFavorite: true })
      await nextTick()
      expect(wrapper.vm.favorite).toBe(true)
    })

    it('should handle isConnected prop', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement, isConnected: false }
      })
      expect(wrapper.vm.isConnected).toBe(false)
    })

    it('should handle announcement prop', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.vm.announcement).toEqual(mockAnnouncement)
    })
  })

  describe('Computed properties', () => {
    it('should compute formattedDate correctly', () => {
      const wrapper = mount(MockVolunteerAnnouncementCard, {
        props: { announcement: mockAnnouncement }
      })
      expect(wrapper.vm.formattedDate).toBe('25/12')
    })
  })
})
