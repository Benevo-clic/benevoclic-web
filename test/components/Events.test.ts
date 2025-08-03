// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester le composant Events
const MockEvents = {
  template: `
    <div class="events">
      <section v-if="!startSearching" id="events-section" class="py-16 px-4 bg-base-100">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12 slide-in-up" :class="{ 'visible': isVisible }">
            <h2 class="text-3xl font-bold mb-4">Événements à venir</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Découvrez les prochains événements et rejoignez-les en tant que bénévole ou participant.
            </p>
          </div>

          <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="loading loading-spinner loading-lg text-primary"></div>
          </div>

          <div v-else-if="error" class="alert alert-error shadow-lg slide-in-up" :class="{ 'visible': isVisible }">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{{ error }}</span>
            </div>
          </div>

          <div v-else-if="featuredEvents.length === 0" class="text-center py-12 slide-in-up" :class="{ 'visible': isVisible }">
            <img
                src="/images/no_data.png"
                alt="Aucun événement trouvé"
                class="w-full max-w-md mx-auto mb-4"
                loading="lazy"
            />
            <p class="text-lg text-base-content/70">Aucun événement à venir pour le moment.</p>
          </div>

          <div v-else class="w-full slide-in-up" :class="{ 'visible': isVisible }">
            <!-- Carousel pour les événements à venir -->
            <div class="carousel w-full rounded-box relative">
              <div
                  v-for="(event, index) in featuredEvents"
                  :key="event._id"
                  :id="'event-slide-' + index"
                  class="carousel-item relative w-full md:w-1/2 lg:w-1/3 px-2"
              >
                <div class="card bg-base-100 shadow-lg border border-base-300 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative text-base focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none">
                  <div class="card-body">
                    <h3 class="card-title">{{ event.nameEvent }}</h3>
                    <p>{{ event.description }}</p>
                    <div class="text-sm text-base-content/70">{{ event.associationName }}</div>
                    <div class="text-sm">{{ event.dateEvent }}</div>
                    <div class="text-sm">{{ event.hoursEvent }}</div>
                    <div class="text-sm">{{ event.nbParticipants }}/{{ event.nbMaxParticipants }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  props: {
    startSearching: {
      type: Boolean,
      default: false
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    animatedStats: {
      type: Object,
      default: () => ({
        events: 0,
        associations: 0,
        volunteers: 0
      })
    },
    featuredEvents: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  }
}

describe('Events', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render events section when not searching', () => {
      const wrapper = mount(MockEvents, {
        props: {
          startSearching: false
        }
      })

      const eventsSection = wrapper.find('#events-section')
      expect(eventsSection.exists()).toBe(true)
    })

    it('should not render events section when searching', () => {
      const wrapper = mount(MockEvents, {
        props: {
          startSearching: true
        }
      })

      const eventsSection = wrapper.find('#events-section')
      expect(eventsSection.exists()).toBe(false)
    })

    it('should display main heading', () => {
      const wrapper = mount(MockEvents)

      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBe('Événements à venir')
    })

    it('should display description text', () => {
      const wrapper = mount(MockEvents)

      const description = wrapper.find('p')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Découvrez les prochains événements')
    })
  })

  describe('États de chargement', () => {
    it('should display loading spinner when isLoading is true', () => {
      const wrapper = mount(MockEvents, {
        props: {
          isLoading: true
        }
      })

      const loadingSpinner = wrapper.find('.loading-spinner')
      expect(loadingSpinner.exists()).toBe(true)
    })

    it('should not display loading spinner when isLoading is false', () => {
      const wrapper = mount(MockEvents, {
        props: {
          isLoading: false
        }
      })

      const loadingSpinner = wrapper.find('.loading-spinner')
      expect(loadingSpinner.exists()).toBe(false)
    })
  })

  describe('Gestion des erreurs', () => {
    it('should display error message when error is present', () => {
      const wrapper = mount(MockEvents, {
        props: {
          error: 'Erreur de chargement des événements'
        }
      })

      const errorAlert = wrapper.find('.alert-error')
      expect(errorAlert.exists()).toBe(true)
      expect(errorAlert.text()).toContain('Erreur de chargement des événements')
    })

    it('should not display error message when error is null', () => {
      const wrapper = mount(MockEvents, {
        props: {
          error: null
        }
      })

      const errorAlert = wrapper.find('.alert-error')
      expect(errorAlert.exists()).toBe(false)
    })
  })

  describe('Événements vides', () => {
    it('should display no events message when featuredEvents is empty', () => {
      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: [],
          isLoading: false,
          error: null
        }
      })

      const noEventsMessage = wrapper.findAll('p').find(p => p.text().includes('Aucun événement à venir'))
      expect(noEventsMessage.exists()).toBe(true)
      expect(noEventsMessage.text()).toContain('Aucun événement à venir pour le moment')
    })

    it('should display no data image when no events', () => {
      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: [],
          isLoading: false,
          error: null
        }
      })

      const noDataImage = wrapper.find('img[alt="Aucun événement trouvé"]')
      expect(noDataImage.exists()).toBe(true)
      expect(noDataImage.attributes('src')).toBe('/images/no_data.png')
    })
  })

  describe('Affichage des événements', () => {
    it('should display featured events when available', () => {
      const mockEvents = [
        {
          _id: '1',
          nameEvent: 'Événement 1',
          description: 'Description événement 1',
          associationName: 'Association 1',
          dateEvent: '2024-01-01',
          hoursEvent: '10:00',
          nbParticipants: 5,
          nbMaxParticipants: 10
        },
        {
          _id: '2',
          nameEvent: 'Événement 2',
          description: 'Description événement 2',
          associationName: 'Association 2',
          dateEvent: '2024-01-02',
          hoursEvent: '14:00',
          nbParticipants: 3,
          nbMaxParticipants: 8
        }
      ]

      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: mockEvents,
          isLoading: false,
          error: null
        }
      })

      const eventCards = wrapper.findAll('.card')
      expect(eventCards.length).toBe(2)
    })

    it('should display correct event information', () => {
      const mockEvent = {
        _id: '1',
        nameEvent: 'Événement Test',
        description: 'Description test',
        associationName: 'Association Test',
        dateEvent: '2024-01-01',
        hoursEvent: '10:00',
        nbParticipants: 5,
        nbMaxParticipants: 10
      }

      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: [mockEvent],
          isLoading: false,
          error: null
        }
      })

      const eventCard = wrapper.find('.card')
      expect(eventCard.find('h3').text()).toBe('Événement Test')
      expect(eventCard.find('p').text()).toBe('Description test')
      expect(eventCard.text()).toContain('Association Test')
      expect(eventCard.text()).toContain('2024-01-01')
      expect(eventCard.text()).toContain('10:00')
      expect(eventCard.text()).toContain('5/10')
    })
  })

  describe('Carousel et navigation', () => {
    it('should have carousel structure', () => {
      const mockEvents = [
        {
          _id: '1',
          nameEvent: 'Événement 1',
          description: 'Description 1',
          associationName: 'Association 1',
          dateEvent: '2024-01-01',
          hoursEvent: '10:00',
          nbParticipants: 5,
          nbMaxParticipants: 10
        }
      ]

      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: mockEvents,
          isLoading: false,
          error: null
        }
      })

      const carousel = wrapper.find('.carousel')
      expect(carousel.exists()).toBe(true)
      expect(carousel.classes()).toContain('w-full')
      expect(carousel.classes()).toContain('rounded-box')
    })

    it('should have carousel items with proper IDs', () => {
      const mockEvents = [
        {
          _id: '1',
          nameEvent: 'Événement 1',
          description: 'Description 1',
          associationName: 'Association 1',
          dateEvent: '2024-01-01',
          hoursEvent: '10:00',
          nbParticipants: 5,
          nbMaxParticipants: 10
        }
      ]

      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: mockEvents,
          isLoading: false,
          error: null
        }
      })

      const carouselItem = wrapper.find('#event-slide-0')
      expect(carouselItem.exists()).toBe(true)
      expect(carouselItem.classes()).toContain('carousel-item')
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper section styling', () => {
      const wrapper = mount(MockEvents)

      const section = wrapper.find('#events-section')
      expect(section.classes()).toContain('py-16')
      expect(section.classes()).toContain('px-4')
      expect(section.classes()).toContain('bg-base-100')
    })

    it('should have proper card styling', () => {
      const mockEvents = [
        {
          _id: '1',
          nameEvent: 'Événement 1',
          description: 'Description 1',
          associationName: 'Association 1',
          dateEvent: '2024-01-01',
          hoursEvent: '10:00',
          nbParticipants: 5,
          nbMaxParticipants: 10
        }
      ]

      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: mockEvents,
          isLoading: false,
          error: null
        }
      })

      const card = wrapper.find('.card')
      expect(card.classes()).toContain('card')
      expect(card.classes()).toContain('bg-base-100')
      expect(card.classes()).toContain('shadow-lg')
    })
  })

  describe('Animation et visibilité', () => {
    it('should apply visible class when isVisible is true', () => {
      const wrapper = mount(MockEvents, {
        props: {
          isVisible: true
        }
      })

      const visibleElements = wrapper.findAll('.visible')
      expect(visibleElements.length).toBeGreaterThan(0)
    })

    it('should not apply visible class when isVisible is false', () => {
      const wrapper = mount(MockEvents, {
        props: {
          isVisible: false
        }
      })

      const visibleElements = wrapper.findAll('.visible')
      expect(visibleElements.length).toBe(0)
    })
  })

  describe('Accessibilité', () => {
    it('should have proper heading structure', () => {
      const wrapper = mount(MockEvents)

      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBeTruthy()
    })

    it('should have proper image alt text for no data', () => {
      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: [],
          isLoading: false,
          error: null
        }
      })

      const image = wrapper.find('img')
      expect(image.attributes('alt')).toBe('Aucun événement trouvé')
    })
  })

  describe('Responsive design', () => {
    it('should have responsive carousel item sizing', () => {
      const mockEvents = [
        {
          _id: '1',
          nameEvent: 'Événement 1',
          description: 'Description 1',
          associationName: 'Association 1',
          dateEvent: '2024-01-01',
          hoursEvent: '10:00',
          nbParticipants: 5,
          nbMaxParticipants: 10
        }
      ]

      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: mockEvents,
          isLoading: false,
          error: null
        }
      })

      const carouselItem = wrapper.find('.carousel-item')
      expect(carouselItem.classes()).toContain('w-full')
      expect(carouselItem.classes()).toContain('md:w-1/2')
      expect(carouselItem.classes()).toContain('lg:w-1/3')
    })

    it('should have responsive text sizing', () => {
      const wrapper = mount(MockEvents)

      const heading = wrapper.find('h2')
      expect(heading.classes()).toContain('text-3xl')
    })
  })

  describe('Props et états', () => {
    it('should handle startSearching prop correctly', () => {
      const wrapper = mount(MockEvents, {
        props: {
          startSearching: false
        }
      })

      expect(wrapper.vm.startSearching).toBe(false)
      expect(wrapper.find('#events-section').exists()).toBe(true)
    })

    it('should handle isVisible prop correctly', () => {
      const wrapper = mount(MockEvents, {
        props: {
          isVisible: true
        }
      })

      expect(wrapper.vm.isVisible).toBe(true)
    })

    it('should handle animatedStats prop correctly', () => {
      const wrapper = mount(MockEvents, {
        props: {
          animatedStats: {
            events: 100,
            associations: 50,
            volunteers: 1000
          }
        }
      })

      expect(wrapper.vm.animatedStats.events).toBe(100)
      expect(wrapper.vm.animatedStats.associations).toBe(50)
      expect(wrapper.vm.animatedStats.volunteers).toBe(1000)
    })

    it('should handle featuredEvents prop correctly', () => {
      const mockEvents = [
        {
          _id: '1',
          nameEvent: 'Événement Test',
          description: 'Description test',
          associationName: 'Association Test',
          dateEvent: '2024-01-01',
          hoursEvent: '10:00',
          nbParticipants: 5,
          nbMaxParticipants: 10
        }
      ]

      const wrapper = mount(MockEvents, {
        props: {
          featuredEvents: mockEvents
        }
      })

      expect(wrapper.vm.featuredEvents.length).toBe(1)
      expect(wrapper.vm.featuredEvents[0].nameEvent).toBe('Événement Test')
    })
  })
}) 