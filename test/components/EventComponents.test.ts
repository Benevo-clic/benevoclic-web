// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// Composant simple pour tester les événements
const SimpleEventCard = {
  template: `
    <div class="event-card" @click="handleClick">
      <h3 class="event-title">{{ title }}</h3>
      <p class="event-description">{{ description }}</p>
      <div class="event-meta">
        <span class="event-date">{{ formatDate(date) }}</span>
        <span class="event-location">{{ location }}</span>
      </div>
      <button class="favorite-btn" @click.stop="toggleFavorite" :class="{ 'is-favorite': isFavorite }">
        {{ isFavorite ? '❤️' : '🤍' }}
      </button>
    </div>
  `,
  props: {
    title: String,
    description: String,
    date: String,
    location: String,
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'favorite'],
  methods: {
    handleClick() {
      this.$emit('click', this.title)
    },
    toggleFavorite() {
      this.$emit('favorite', this.title)
    },
    formatDate(date: string) {
      return new Date(date).toLocaleDateString('fr-FR')
    }
  }
}

describe('Event Components', () => {
  describe('SimpleEventCard', () => {
    const mockEvent = {
      title: 'Test Event',
      description: 'This is a test event description',
      date: '2024-12-25T10:00:00Z',
      location: 'Paris, France'
    }

    it('should render event card component', () => {
      const wrapper = mount(SimpleEventCard, {
        props: mockEvent
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.event-card').exists()).toBe(true)
    })

    it('should display event information correctly', () => {
      const wrapper = mount(SimpleEventCard, {
        props: mockEvent
      })

      expect(wrapper.find('.event-title').text()).toBe('Test Event')
      expect(wrapper.find('.event-description').text()).toBe('This is a test event description')
      expect(wrapper.find('.event-location').text()).toBe('Paris, France')
    })

    it('should format date correctly', () => {
      const wrapper = mount(SimpleEventCard, {
        props: mockEvent
      })

      expect(wrapper.find('.event-date').text()).toBe('25/12/2024')
    })

    it('should emit click event when card is clicked', async () => {
      const wrapper = mount(SimpleEventCard, {
        props: mockEvent
      })

      await wrapper.find('.event-card').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.[0]).toEqual(['Test Event'])
    })

    it('should emit favorite event when favorite button is clicked', async () => {
      const wrapper = mount(SimpleEventCard, {
        props: mockEvent
      })

      await wrapper.find('.favorite-btn').trigger('click')

      expect(wrapper.emitted('favorite')).toBeTruthy()
      expect(wrapper.emitted('favorite')?.[0]).toEqual(['Test Event'])
    })

    it('should show favorite state correctly', () => {
      const wrapper = mount(SimpleEventCard, {
        props: {
          ...mockEvent,
          isFavorite: true
        }
      })

      const favoriteBtn = wrapper.find('.favorite-btn')
      expect(favoriteBtn.classes()).toContain('is-favorite')
      expect(favoriteBtn.text()).toBe('❤️')
    })

    it('should show unfavorite state correctly', () => {
      const wrapper = mount(SimpleEventCard, {
        props: {
          ...mockEvent,
          isFavorite: false
        }
      })

      const favoriteBtn = wrapper.find('.favorite-btn')
      expect(favoriteBtn.classes()).not.toContain('is-favorite')
      expect(favoriteBtn.text()).toBe('🤍')
    })

    it('should handle different event data', () => {
      const differentEvent = {
        title: 'Another Event',
        description: 'Different description',
        date: '2024-01-01T00:00:00Z',
        location: 'Lyon, France'
      }

      const wrapper = mount(SimpleEventCard, {
        props: differentEvent
      })

      expect(wrapper.find('.event-title').text()).toBe('Another Event')
      expect(wrapper.find('.event-description').text()).toBe('Different description')
      expect(wrapper.find('.event-location').text()).toBe('Lyon, France')
      expect(wrapper.find('.event-date').text()).toBe('01/01/2024')
    })

    it('should have proper CSS classes', () => {
      const wrapper = mount(SimpleEventCard, {
        props: mockEvent
      })

      expect(wrapper.find('.event-card').exists()).toBe(true)
      expect(wrapper.find('.event-title').exists()).toBe(true)
      expect(wrapper.find('.event-description').exists()).toBe(true)
      expect(wrapper.find('.event-meta').exists()).toBe(true)
      expect(wrapper.find('.event-date').exists()).toBe(true)
      expect(wrapper.find('.event-location').exists()).toBe(true)
      expect(wrapper.find('.favorite-btn').exists()).toBe(true)
    })

    it('should handle empty description', () => {
      const eventWithoutDescription = {
        ...mockEvent,
        description: ''
      }

      const wrapper = mount(SimpleEventCard, {
        props: eventWithoutDescription
      })

      expect(wrapper.find('.event-description').text()).toBe('')
    })

    it('should handle missing location', () => {
      const eventWithoutLocation = {
        ...mockEvent,
        location: ''
      }

      const wrapper = mount(SimpleEventCard, {
        props: eventWithoutLocation
      })

      expect(wrapper.find('.event-location').text()).toBe('')
    })

    it('should handle invalid date gracefully', () => {
      const eventWithInvalidDate = {
        ...mockEvent,
        date: 'invalid-date'
      }

      const wrapper = mount(SimpleEventCard, {
        props: eventWithInvalidDate
      })

      expect(wrapper.find('.event-date').text()).toBe('Invalid Date')
    })

    it('should prevent event bubbling on favorite button click', async () => {
      const wrapper = mount(SimpleEventCard, {
        props: mockEvent
      })

      await wrapper.find('.favorite-btn').trigger('click')

      // Le clic sur le bouton favorite ne devrait pas déclencher le clic sur la carte
      expect(wrapper.emitted('favorite')).toBeTruthy()
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Event List Component', () => {
    const SimpleEventList = {
      template: `
        <div class="event-list">
          <h2 class="list-title">{{ title }}</h2>
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="events.length === 0" class="empty-state">
            <p>No events found</p>
          </div>
          <div v-else class="events-grid">
            <SimpleEventCard
              v-for="event in events"
              :key="event.id"
              v-bind="event"
              @click="handleEventClick"
              @favorite="handleFavorite"
            />
          </div>
        </div>
      `,
      components: {
        SimpleEventCard
      },
      props: {
        title: String,
        events: {
          type: Array,
          default: () => []
        },
        loading: {
          type: Boolean,
          default: false
        }
      },
      emits: ['eventClick', 'favorite'],
      methods: {
        handleEventClick(eventTitle: string) {
          this.$emit('eventClick', eventTitle)
        },
        handleFavorite(eventTitle: string) {
          this.$emit('favorite', eventTitle)
        }
      }
    }

    const mockEvents = [
      {
        id: '1',
        title: 'Event 1',
        description: 'Description 1',
        date: '2024-12-25T10:00:00Z',
        location: 'Paris'
      },
      {
        id: '2',
        title: 'Event 2',
        description: 'Description 2',
        date: '2024-12-26T10:00:00Z',
        location: 'Lyon'
      }
    ]

    it('should render event list component', () => {
      const wrapper = mount(SimpleEventList, {
        props: {
          title: 'Test Announcements',
          events: mockEvents
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.event-list').exists()).toBe(true)
    })

    it('should display list title', () => {
      const wrapper = mount(SimpleEventList, {
        props: {
          title: 'Test Announcements',
          events: mockEvents
        }
      })

      expect(wrapper.find('.list-title').text()).toBe('Test Announcements')
    })

    it('should display loading state', () => {
      const wrapper = mount(SimpleEventList, {
        props: {
          title: 'Test Announcements',
          events: [],
          loading: true
        }
      })

      expect(wrapper.find('.loading').exists()).toBe(true)
      expect(wrapper.find('.loading').text()).toBe('Loading...')
    })

    it('should display empty state when no events', () => {
      const wrapper = mount(SimpleEventList, {
        props: {
          title: 'Test Announcements',
          events: [],
          loading: false
        }
      })

      expect(wrapper.find('.empty-state').exists()).toBe(true)
      expect(wrapper.find('.empty-state p').text()).toBe('No events found')
    })

    it('should render correct number of event cards', () => {
      const wrapper = mount(SimpleEventList, {
        props: {
          title: 'Test Announcements',
          events: mockEvents
        }
      })

      const eventCards = wrapper.findAll('.event-card')
      expect(eventCards).toHaveLength(2)
    })

    it('should emit events from child components', async () => {
      const wrapper = mount(SimpleEventList, {
        props: {
          title: 'Test Announcements',
          events: mockEvents
        }
      })

      const eventCards = wrapper.findAll('.event-card')
      await eventCards[0].trigger('click')

      expect(wrapper.emitted('eventClick')).toBeTruthy()
      expect(wrapper.emitted('eventClick')?.[0]).toEqual(['Event 1'])
    })
  })
})
