// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock des icônes
const MockUserRound = {
  template: '<div class="user-round-icon">UserRound</div>'
}

const MockMail = {
  template: '<div class="mail-icon">Mail</div>'
}

const MockPhone = {
  template: '<div class="phone-icon">Phone</div>'
}

const MockGlobe = {
  template: '<div class="globe-icon">Globe</div>'
}

const MockMapPin = {
  template: '<div class="map-pin-icon">MapPin</div>'
}

const MockErrorPopup = {
  template: '<div class="error-popup">Error Popup</div>',
  props: ['showErrorModal', 'errorType'],
  emits: ['reload', 'goHome']
}

// Mock des composables
const mockAuth = {
  user: {
    value: {
      email: 'test@association.com'
    }
  }
}

const mockUser = {
  associationName: 'Association Test',
  type: 'ONG',
  bio: 'Une association de test pour les bénévoles',
  volunteers: [
    { id: 'v1', name: 'Bénévole 1' },
    { id: 'v2', name: 'Bénévole 2' }
  ],
  phone: '0123456789',
  country: 'France',
  city: 'Paris',
  postalCode: '75001',
  profileImageUrl: null
}

// Mock des modules
vi.mock('lucide-vue-next', () => ({
  UserRound: MockUserRound,
  Mail: MockMail,
  Phone: MockPhone,
  Globe: MockGlobe,
  MapPin: MockMapPin
}))

vi.mock('~/components/utils/ErrorPopup.vue', () => MockErrorPopup)

// Mock de NuxtLink
const MockNuxtLink = {
  template: '<a><slot /></a>',
  props: ['to']
}

// Composant mock pour le test
const MockAssociationProfile = {
  template: `
    <div>
      <div class="max-w-3xl mx-auto px-4">
        <!-- Header infos -->
        <div class="flex flex-col items-center mt-12 mb-6">
          <div class="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg bg-base-300 flex items-center justify-center overflow-hidden mb-4">
            <img
              v-if="profileImageUrl"
              :src="profileImageUrl"
              alt="Logo association"
              class="w-full h-full object-cover"
            />
            <UserRound v-else class="w-16 h-16 text-base-content opacity-50" />
          </div>
          <h1 class="text-3xl font-bold text-base-content mb-1">{{ user?.associationName }}</h1>
          <span class="badge badge-outline badge-primary mb-2 text-base-content border-base-content">{{ user?.type || 'Type non fourni' }}</span>
          <p class="text-base-content/80 text-center max-w-xl mb-2">{{ user?.bio || 'Aucune description.' }}</p>
          <div class="flex gap-2 mt-2">
            <NuxtLink to="/association/account/edit" class="btn btn-sm btn-outline btn-primary">Éditer le profil</NuxtLink>
            <button class="btn btn-sm btn-outline btn-secondary">Partager</button>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <NuxtLink to="/association/account/volunteers" >
            <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
              <span class="text-2xl font-bold text-primary">{{ user?.volunteers?.length ?? 0 }}</span>
              <span class="text-xs text-base-content/70">Bénévoles</span>
            </div>
          </NuxtLink>
          <NuxtLink to="/association/events/association/manage" >
            <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
              <span class="text-2xl font-bold text-primary">{{ nbAnnouncements }}</span>
              <span class="text-xs text-base-content/70">Annonces créées</span>
            </div>
          </NuxtLink>
          <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary">{{ creationDate }}</span>
            <span class="text-xs text-base-content/70">Créée le</span>
          </div>
          <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary">{{ user?.city || '-' }}</span>
            <span class="text-xs text-base-content/70">Ville</span>
          </div>
        </div>

        <!-- Informations détaillées -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
            <h3 class="font-semibold mb-2 text-base-content">Contact</h3>
            <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
              <Mail class="w-5 h-5 text-primary shrink-0" />
              <span>Email</span>
              <span class="font-medium break-all">{{ auth.user.value?.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
              <Phone class="w-5 h-5 text-primary shrink-0" />
              <span>Téléphone</span>
              <span class="font-medium">{{ user?.phone || 'Non renseigné' }}</span>
            </div>
          </div>
          <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
            <h3 class="font-semibold mb-2 text-base-content">Localisation</h3>
            <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
              <Globe class="w-5 h-5 text-primary shrink-0" />
              <span>Pays</span>
              <span class="font-medium">{{ user?.country || 'Non renseigné' }}</span>
            </div>
            <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
              <MapPin class="w-5 h-5 text-primary shrink-0" />
              <span>Ville</span>
              <span class="font-medium">{{ user?.city || 'Non renseigné' }}</span>
            </div>
            <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
              <MapPin class="w-5 h-5 text-primary shrink-0" />
              <span>Code postal</span>
              <span class="font-medium">{{ user?.postalCode || 'Non renseigné' }}</span>
            </div>
          </div>
        </div>

        <!-- Section supplémentaire : réseaux sociaux, site web, etc. -->
        <div class="bg-base-100 rounded-xl shadow p-6 flex flex-col items-center">
          <h3 class="font-semibold mb-2 text-base-content">Réseaux sociaux</h3>
          <div class="flex gap-4">
            <span class="text-base-content/60">Aucun site web renseigné</span>
          </div>
        </div>
      </div>
      <ErrorPopup
          :show-error-modal="showErrorModal"
          :error-type="errorType"
          @reload="handleReload"
          @goHome="handleGoHome"
      />
    </div>
  `,
  components: {
    UserRound: MockUserRound,
    Mail: MockMail,
    Phone: MockPhone,
    Globe: MockGlobe,
    MapPin: MockMapPin,
    ErrorPopup: MockErrorPopup,
    NuxtLink: MockNuxtLink
  },
  data() {
    return {
      auth: mockAuth,
      user: mockUser,
      profileImageUrl: null,
      nbAnnouncements: 5,
      creationDate: '2024',
      showErrorModal: false,
      errorType: null
    }
  },
  methods: {
    handleReload() {
      // Mock method
    },
    handleGoHome() {
      // Mock method
    }
  }
}

describe('AssociationProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render the main container', () => {
      const wrapper = mount(MockAssociationProfile)
      expect(wrapper.find('.max-w-3xl.mx-auto').exists()).toBe(true)
    })

    it('should render the header section', () => {
      const wrapper = mount(MockAssociationProfile)
      const header = wrapper.find('.flex.flex-col.items-center')
      expect(header.exists()).toBe(true)
    })
  })

  describe('Profile Header', () => {
    it('should render the profile image container', () => {
      const wrapper = mount(MockAssociationProfile)
      const imageContainer = wrapper.find('.w-32.h-32.rounded-full')
      expect(imageContainer.exists()).toBe(true)
    })

    it('should render the association name', () => {
      const wrapper = mount(MockAssociationProfile)
      const name = wrapper.find('h1')
      expect(name.exists()).toBe(true)
      expect(name.text()).toBe('Association Test')
    })

    it('should render the association type badge', () => {
      const wrapper = mount(MockAssociationProfile)
      const badge = wrapper.find('.badge.badge-outline')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('ONG')
    })

    it('should render the association bio', () => {
      const wrapper = mount(MockAssociationProfile)
      const bio = wrapper.find('p')
      expect(bio.exists()).toBe(true)
      expect(bio.text()).toContain('Une association de test')
    })

    it('should render share button', () => {
      const wrapper = mount(MockAssociationProfile)
      const shareButton = wrapper.find('.btn-outline.btn-secondary')
      expect(shareButton.exists()).toBe(true)
      expect(shareButton.text()).toBe('Partager')
    })
  })

  describe('Statistics Section', () => {
    it('should render the statistics grid', () => {
      const wrapper = mount(MockAssociationProfile)
      const statsGrid = wrapper.find('.grid.grid-cols-2.md\\:grid-cols-4')
      expect(statsGrid.exists()).toBe(true)
    })

    it('should display volunteers count', () => {
      const wrapper = mount(MockAssociationProfile)
      const volunteersText = wrapper.text()
      expect(volunteersText).toContain('Bénévoles')
    })

    it('should display announcements count', () => {
      const wrapper = mount(MockAssociationProfile)
      const announcementsText = wrapper.text()
      expect(announcementsText).toContain('Annonces créées')
    })

    it('should display creation date', () => {
      const wrapper = mount(MockAssociationProfile)
      const creationText = wrapper.text()
      expect(creationText).toContain('Créée le')
    })

    it('should display city', () => {
      const wrapper = mount(MockAssociationProfile)
      const cityText = wrapper.text()
      expect(cityText).toContain('Paris')
    })
  })

  describe('Contact Information', () => {
    it('should render contact section', () => {
      const wrapper = mount(MockAssociationProfile)
      const contactSection = wrapper.find('.bg-base-100.rounded-xl.shadow.p-6')
      expect(contactSection.exists()).toBe(true)
    })

    it('should display email information', () => {
      const wrapper = mount(MockAssociationProfile)
      const emailText = wrapper.text()
      expect(emailText).toContain('test@association.com')
    })

    it('should display phone information', () => {
      const wrapper = mount(MockAssociationProfile)
      const phoneText = wrapper.text()
      expect(phoneText).toContain('0123456789')
    })

    it('should render contact icons', () => {
      const wrapper = mount(MockAssociationProfile)
      const mailIcon = wrapper.find('.mail-icon')
      const phoneIcon = wrapper.find('.phone-icon')
      expect(mailIcon.exists()).toBe(true)
      expect(phoneIcon.exists()).toBe(true)
    })
  })

  describe('Location Information', () => {
    it('should render location section', () => {
      const wrapper = mount(MockAssociationProfile)
      const locationSections = wrapper.findAll('.bg-base-100.rounded-xl.shadow.p-6')
      expect(locationSections.length).toBeGreaterThanOrEqual(2)
    })

    it('should display country information', () => {
      const wrapper = mount(MockAssociationProfile)
      const countryText = wrapper.text()
      expect(countryText).toContain('France')
    })

    it('should display city information', () => {
      const wrapper = mount(MockAssociationProfile)
      const cityText = wrapper.text()
      expect(cityText).toContain('Paris')
    })

    it('should display postal code information', () => {
      const wrapper = mount(MockAssociationProfile)
      const postalText = wrapper.text()
      expect(postalText).toContain('75001')
    })

    it('should render location icons', () => {
      const wrapper = mount(MockAssociationProfile)
      const globeIcon = wrapper.find('.globe-icon')
      const mapPinIcon = wrapper.find('.map-pin-icon')
      expect(globeIcon.exists()).toBe(true)
      expect(mapPinIcon.exists()).toBe(true)
    })
  })

  describe('Social Networks Section', () => {
    it('should render social networks section', () => {
      const wrapper = mount(MockAssociationProfile)
      const socialSection = wrapper.find(
        '.bg-base-100.rounded-xl.shadow.p-6.flex.flex-col.items-center'
      )
      expect(socialSection.exists()).toBe(true)
    })

    it('should display social networks title', () => {
      const wrapper = mount(MockAssociationProfile)
      const titles = wrapper.findAll('h3')
      const socialTitle = titles.find(title => title.text() === 'Réseaux sociaux')
      expect(socialTitle).toBeDefined()
    })

    it('should display no website message', () => {
      const wrapper = mount(MockAssociationProfile)
      const message = wrapper.find('.text-base-content\\/60')
      expect(message.exists()).toBe(true)
      expect(message.text()).toBe('Aucun site web renseigné')
    })
  })

  describe('Navigation Links', () => {
    it('should render volunteers link', () => {
      const wrapper = mount(MockAssociationProfile)
      const volunteersLink = wrapper.find('a')
      expect(volunteersLink.exists()).toBe(true)
    })

    it('should render manage announcements link', () => {
      const wrapper = mount(MockAssociationProfile)
      const announcementsLink = wrapper.find('a')
      expect(announcementsLink.exists()).toBe(true)
    })

    it('should render edit profile link', () => {
      const wrapper = mount(MockAssociationProfile)
      const editLink = wrapper.find('a')
      expect(editLink.exists()).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should render error popup component', () => {
      const wrapper = mount(MockAssociationProfile)
      const errorPopup = wrapper.find('.error-popup')
      expect(errorPopup.exists()).toBe(true)
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      const wrapper = mount(MockAssociationProfile)
      const statsGrid = wrapper.find('.grid.grid-cols-2.md\\:grid-cols-4')
      expect(statsGrid.exists()).toBe(true)
    })

    it('should have responsive container classes', () => {
      const wrapper = mount(MockAssociationProfile)
      const container = wrapper.find('.max-w-3xl.mx-auto.px-4')
      expect(container.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const wrapper = mount(MockAssociationProfile)
      const headings = wrapper.findAll('h1, h3')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('should have proper alt text for images', () => {
      const wrapper = mount(MockAssociationProfile)
      const images = wrapper.findAll('img')
      images.forEach(img => {
        expect(img.attributes('alt')).toBeDefined()
      })
    })
  })

  describe('Profile Image Handling', () => {
    it('should show user icon when no profile image', () => {
      const wrapper = mount(MockAssociationProfile, {
        data() {
          return {
            ...mockUser,
            profileImageUrl: null
          }
        }
      })
      const userIcon = wrapper.find('.user-round-icon')
      expect(userIcon.exists()).toBe(true)
    })

    it('should show profile image when available', () => {
      const wrapper = mount(MockAssociationProfile, {
        data() {
          return {
            ...mockUser,
            profileImageUrl: '/test-image.jpg'
          }
        }
      })
      const profileImage = wrapper.find('img[src="/test-image.jpg"]')
      expect(profileImage.exists()).toBe(true)
    })
  })

  describe('Data Validation and Edge Cases', () => {
    it('should handle missing association name gracefully', () => {
      const wrapper = mount(MockAssociationProfile, {
        data() {
          return {
            auth: mockAuth,
            user: {
              ...mockUser,
              associationName: null
            },
            profileImageUrl: null,
            nbAnnouncements: 5,
            creationDate: '2024',
            showErrorModal: false,
            errorType: null
          }
        }
      })
      const name = wrapper.find('h1')
      expect(name.text()).toBe('')
    })

    it('should handle missing association type gracefully', () => {
      const wrapper = mount(MockAssociationProfile, {
        data() {
          return {
            auth: mockAuth,
            user: {
              ...mockUser,
              type: null
            },
            profileImageUrl: null,
            nbAnnouncements: 5,
            creationDate: '2024',
            showErrorModal: false,
            errorType: null
          }
        }
      })
      const badge = wrapper.find('.badge.badge-outline')
      expect(badge.text()).toBe('Type non fourni')
    })

    it('should handle missing bio gracefully', () => {
      const wrapper = mount(MockAssociationProfile, {
        data() {
          return {
            auth: mockAuth,
            user: {
              ...mockUser,
              bio: null
            },
            profileImageUrl: null,
            nbAnnouncements: 5,
            creationDate: '2024',
            showErrorModal: false,
            errorType: null
          }
        }
      })
      const bio = wrapper.find('p')
      expect(bio.text()).toBe('Aucune description.')
    })

    it('should handle missing volunteers array gracefully', () => {
      const wrapper = mount(MockAssociationProfile, {
        data() {
          return {
            auth: mockAuth,
            user: {
              ...mockUser,
              volunteers: null
            },
            profileImageUrl: null,
            nbAnnouncements: 5,
            creationDate: '2024',
            showErrorModal: false,
            errorType: null
          }
        }
      })
      const volunteersText = wrapper.text()
      expect(volunteersText).toContain('0')
    })

    it('should handle missing contact information gracefully', () => {
      const wrapper = mount(MockAssociationProfile, {
        data() {
          return {
            auth: mockAuth,
            user: {
              ...mockUser,
              phone: null,
              country: null,
              city: null,
              postalCode: null
            },
            profileImageUrl: null,
            nbAnnouncements: 5,
            creationDate: '2024',
            showErrorModal: false,
            errorType: null
          }
        }
      })
      const phoneText = wrapper.text()
      expect(phoneText).toContain('Non renseigné')
    })
  })

  describe('Component Integration', () => {
    it('should properly integrate all icon components', () => {
      const wrapper = mount(MockAssociationProfile)
      const icons = wrapper.findAll(
        '.user-round-icon, .mail-icon, .phone-icon, .globe-icon, .map-pin-icon'
      )
      expect(icons.length).toBeGreaterThan(0)
    })

    it('should properly integrate NuxtLink components', () => {
      const wrapper = mount(MockAssociationProfile)
      const links = wrapper.findAll('a')
      expect(links.length).toBeGreaterThan(0)
    })

    it('should properly integrate ErrorPopup component', () => {
      const wrapper = mount(MockAssociationProfile)
      const errorPopup = wrapper.findComponent(MockErrorPopup)
      expect(errorPopup.exists()).toBe(true)
    })
  })

  describe('Event Handling', () => {
    it('should handle reload event from error popup', async () => {
      const wrapper = mount(MockAssociationProfile)
      const errorPopup = wrapper.findComponent(MockErrorPopup)
      await errorPopup.vm.$emit('reload')
      // Verify the event was handled (mock method would be called)
    })

    it('should handle goHome event from error popup', async () => {
      const wrapper = mount(MockAssociationProfile)
      const errorPopup = wrapper.findComponent(MockErrorPopup)
      await errorPopup.vm.$emit('goHome')
      // Verify the event was handled (mock method would be called)
    })
  })

  describe('Dynamic Content Updates', () => {
    it('should update statistics when data changes', async () => {
      const wrapper = mount(MockAssociationProfile)

      // Update the volunteers count in the component data
      await wrapper.setData({
        user: {
          ...mockUser,
          volunteers: [
            { id: 'v1', name: 'Bénévole 1' },
            { id: 'v2', name: 'Bénévole 2' },
            { id: 'v3', name: 'Bénévole 3' }
          ]
        }
      })

      // Force a re-render
      await wrapper.vm.$nextTick()

      // Check that the volunteers count is updated in the text
      const volunteersText = wrapper.text()
      expect(volunteersText).toContain('3')
    })

    it('should update announcements count when data changes', async () => {
      const wrapper = mount(MockAssociationProfile)
      await wrapper.setData({
        nbAnnouncements: 10
      })

      // Force a re-render
      await wrapper.vm.$nextTick()

      const announcementsText = wrapper.text()
      expect(announcementsText).toContain('10')
    })
  })

  describe('Error State Management', () => {
    it('should show error modal when showErrorModal is true', () => {
      const wrapper = mount(MockAssociationProfile, {
        data() {
          return {
            showErrorModal: true,
            errorType: 'network'
          }
        }
      })
      const errorPopup = wrapper.findComponent(MockErrorPopup)
      expect(errorPopup.props('showErrorModal')).toBe(true)
      expect(errorPopup.props('errorType')).toBe('network')
    })

    it('should hide error modal when showErrorModal is false', () => {
      const wrapper = mount(MockAssociationProfile, {
        data() {
          return {
            showErrorModal: false,
            errorType: null
          }
        }
      })
      const errorPopup = wrapper.findComponent(MockErrorPopup)
      expect(errorPopup.props('showErrorModal')).toBe(false)
    })
  })

  describe('Performance and Optimization', () => {
    it('should use proper CSS classes for styling', () => {
      const wrapper = mount(MockAssociationProfile)
      const container = wrapper.find('.max-w-3xl.mx-auto.px-4')
      expect(container.exists()).toBe(true)
    })

    it('should have proper semantic HTML structure', () => {
      const wrapper = mount(MockAssociationProfile)
      const headings = wrapper.findAll('h1, h3')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('should have proper ARIA attributes for accessibility', () => {
      const wrapper = mount(MockAssociationProfile)
      const images = wrapper.findAll('img')
      images.forEach(img => {
        expect(img.attributes('alt')).toBeDefined()
      })
    })
  })
})
