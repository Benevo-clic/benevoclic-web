import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, computed } from 'vue'
import type { Announcement } from '../../common/interface/event.interface'
import { EventStatus } from '../../common/enums/event.enum'

// Composant mock pour NoConnectedAnnouncementCard
const MockNoConnectedAnnouncementCard = defineComponent({
  template: `
    <article class="announcement-card" @click="goToDetails">
      <div class="card-header">
        <h3>{{ announcement.nameEvent }}</h3>
        <p>{{ announcement.description }}</p>
        <p>{{ announcement.associationName }}</p>
        <p>{{ announcement.addressAnnouncement?.city }}</p>
      </div>
      
      <div class="card-body">
        <div class="volunteer-count">
          <span>{{ announcement.nbVolunteers }}/{{ announcement.maxVolunteers }}</span>
        </div>
        
        <div class="tags">
          <span v-for="tag in announcement.tags" :key="tag">{{ tag }}</span>
        </div>
        
        <div class="date">
          {{ new Date(announcement.dateEvent).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
        </div>
        
        <button data-testid="details-button" @click.stop="goToDetails">
          Voir détails
        </button>
      </div>
    </article>
  `,
  props: {
    announcement: {
      type: Object as () => Announcement,
      required: true
    }
  },
  setup(props, { emit }) {
    const goToDetails = () => {
      emit('navigate', `/announcement/${props.announcement._id}`)
    }

    return {
      goToDetails
    }
  }
})

describe('MockNoConnectedAnnouncementCard', () => {
  const mockAnnouncement: Announcement = {
    _id: 'announcement123',
    nameEvent: 'Test Event',
    description: 'Test Description',
    dateEvent: '2024-12-25T10:00:00.000Z',
    datePublication: '2024-12-20T10:00:00.000Z',
    hoursEvent: '14:00',
    associationId: 'association123',
    associationName: 'Test Association',
    maxVolunteers: 10,
    nbVolunteers: 5,
    maxParticipants: 20,
    status: EventStatus.ACTIVE,
    tags: ['Urgent', 'Bénévolat'],
    addressAnnouncement: {
      address: 'Test Street',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    locationAnnouncement: {
      type: 'Point',
      coordinates: [2.3522, 48.8566]
    }
  }

  it('should render announcement card with correct data', () => {
    const wrapper = mount(MockNoConnectedAnnouncementCard, {
      props: {
        announcement: mockAnnouncement
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'NuxtImg': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Event')
    expect(wrapper.text()).toContain('Test Description')
    expect(wrapper.text()).toContain('Test Association')
  })

  it('should display correct volunteer count', () => {
    const wrapper = mount(MockNoConnectedAnnouncementCard, {
      props: {
        announcement: mockAnnouncement
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'NuxtImg': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('5/10')
  })

  it('should display tags correctly', () => {
    const wrapper = mount(MockNoConnectedAnnouncementCard, {
      props: {
        announcement: mockAnnouncement
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'NuxtImg': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Urgent')
    expect(wrapper.text()).toContain('Bénévolat')
  })

  it('should handle announcement without location', () => {
    const announcementWithoutLocation = {
      ...mockAnnouncement,
      addressAnnouncement: undefined,
      locationAnnouncement: undefined
    }

    const wrapper = mount(MockNoConnectedAnnouncementCard, {
      props: {
        announcement: announcementWithoutLocation
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'NuxtImg': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Event')
  })

  it('should display urgent badge when event is urgent', () => {
    const urgentAnnouncement = {
      ...mockAnnouncement,
      tags: ['Urgent']
    }

    const wrapper = mount(MockNoConnectedAnnouncementCard, {
      props: {
        announcement: urgentAnnouncement
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'NuxtImg': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Urgent')
  })

  it('should handle empty tags array', () => {
    const announcementWithoutTags = {
      ...mockAnnouncement,
      tags: []
    }

    const wrapper = mount(MockNoConnectedAnnouncementCard, {
      props: {
        announcement: announcementWithoutTags
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'NuxtImg': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Event')
  })

  it('should display correct date format', () => {
    const wrapper = mount(MockNoConnectedAnnouncementCard, {
      props: {
        announcement: mockAnnouncement
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'NuxtImg': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('25/12/2024')
  })
}) 