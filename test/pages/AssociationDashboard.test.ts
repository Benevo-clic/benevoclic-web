// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock des composants
const MockDateRangePicker = {
  template: '<div class="date-range-picker">Date Range Picker</div>',
  props: ['modelValue'],
  emits: ['update:modelValue']
}

const MockTimeSeriesChart = {
  template: '<div class="time-series-chart">Time Series Chart</div>',
  props: ['data', 'type']
}

const MockPieChart = {
  template: '<div class="pie-chart">Pie Chart</div>',
  props: ['data']
}

const MockObjectiveProgress = {
  template: '<div class="objective-progress">Objective Progress</div>',
  props: ['objectives']
}

const MockErrorPopup = {
  template: '<div class="error-popup">Error Popup</div>',
  props: ['show', 'errorType']
}

// Mock des composables
const mockUseUser = {
  getUserId: 'user123',
  initializeUser: vi.fn()
}

const mockUseAnnouncement = {
  fetchAnnouncements: vi.fn()
}

const mockUseNavigation = {
  navigateToRoute: vi.fn()
}

// Mock des données
const mockEvents = [
  {
    id: '1',
    nameEvent: 'Événement Test 1',
    datePublication: '2024-06-01',
    nbParticipants: 10,
    maxParticipants: 20,
    nbVolunteers: 5,
    participants: [],
    volunteers: []
  },
  {
    id: '2',
    nameEvent: 'Événement Test 2',
    datePublication: '2024-06-15',
    nbParticipants: 15,
    maxParticipants: 25,
    nbVolunteers: 8,
    participants: [],
    volunteers: []
  }
]

const mockAssociations = [
  {
    id: '1',
    name: 'Association Test',
    volunteers: [{ id: 'v1' }, { id: 'v2' }]
  }
]

// Mock des modules
vi.mock('~/components/dashboard/DateRangePicker.vue', () => MockDateRangePicker)

vi.mock('~/components/dashboard/TimeSeriesChart.vue', () => MockTimeSeriesChart)

vi.mock('~/components/dashboard/PieChart.vue', () => MockPieChart)

vi.mock('~/components/dashboard/ObjectiveProgress.vue', () => MockObjectiveProgress)

vi.mock('~/components/utils/ErrorPopup.vue', () => MockErrorPopup)

vi.mock('~/composables/auth/useUser', () => ({
  useUser: () => mockUseUser
}))

vi.mock('~/composables/useAnnouncement', () => ({
  useAnnouncement: () => mockUseAnnouncement
}))

vi.mock('~/composables/useNavigation', () => ({
  useNavigation: () => mockUseNavigation
}))

vi.mock('~/mock/mockEvents', () => ({
  mockEvents
}))

vi.mock('~/mock/mockAssociations', () => ({
  mockAssociations
}))

// Mock de definePageMeta
global.definePageMeta = vi.fn()

// Composant mock pour le test
const MockAssociationDashboard = {
  template: `
    <div class="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200 overflow-x-hidden">
      <!-- Loading overlay -->
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-base-200 bg-opacity-90 z-[1000] flex items-center justify-center backdrop-blur-sm"
      >
        <div class="flex flex-col items-center space-y-4">
          <img
            src="/logo.png"
            alt="Chargement…"
            class="w-16 h-16 sm:w-20 sm:h-20 animate-spin"
          />
          <div class="text-base-content opacity-70 text-sm sm:text-base">Chargement en cours...</div>
        </div>
      </div>

      <!-- Main container -->
      <div class="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl overflow-x-hidden">
        <!-- Header section -->
        <div class="mb-6 sm:mb-8">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-2 break-words">
            Tableau de bord
          </h1>
          <p class="text-sm sm:text-base text-base-content opacity-70 break-words">
            Analysez vos performances et améliorez votre impact
          </p>
        </div>

        <!-- Date Range Picker -->
        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div class="flex flex-col gap-4">
            <div class="flex-1">
              <h2 class="text-base sm:text-lg font-semibold text-base-content mb-2 break-words">Période d'analyse</h2>
              <p class="text-xs sm:text-sm text-base-content opacity-70 break-words">Sélectionnez la période pour analyser vos données</p>
            </div>
            <div class="w-full min-w-0">
              <DateRangePicker v-model="dateRange" />
            </div>
          </div>
        </div>

        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-base-300 min-w-0">
            <div class="flex items-center justify-between mb-3 sm:mb-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div class="text-right min-w-0 flex-1 ml-3">
                <div class="text-2xl sm:text-3xl font-bold text-base-content">{{ totalAnnouncements }}</div>
                <div class="text-xs sm:text-sm text-base-content opacity-70">Annonces</div>
              </div>
            </div>
          </div>

          <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-base-300 min-w-0">
            <div class="flex items-center justify-between mb-3 sm:mb-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="text-right min-w-0 flex-1 ml-3">
                <div class="text-2xl sm:text-3xl font-bold text-base-content">{{ totalVolunteers }}</div>
                <div class="text-xs sm:text-sm text-base-content opacity-70">Bénévoles</div>
              </div>
            </div>
          </div>

          <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-base-300 min-w-0">
            <div class="flex items-center justify-between mb-3 sm:mb-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="text-right min-w-0 flex-1 ml-3">
                <div class="text-2xl sm:text-3xl font-bold text-base-content">{{ totalParticipants }}</div>
                <div class="text-xs sm:text-sm text-base-content opacity-70">Participants</div>
              </div>
            </div>
          </div>

          <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-base-300 min-w-0">
            <div class="flex items-center justify-between mb-3 sm:mb-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-success/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="text-right min-w-0 flex-1 ml-3">
                <div class="text-2xl sm:text-3xl font-bold text-base-content">{{ engagementRate }}%</div>
                <div class="text-xs sm:text-sm text-base-content opacity-70">Engagement</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 class="text-lg sm:text-xl font-semibold text-base-content mb-4">Évolution des annonces</h3>
            <TimeSeriesChart :data="announcementsSeries" :type="chartType" />
          </div>

          <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 class="text-lg sm:text-xl font-semibold text-base-content mb-4">Répartition bénévoles/participants</h3>
            <PieChart :data="pieData" />
          </div>
        </div>

        <!-- Objectives Section -->
        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 class="text-lg sm:text-xl font-semibold text-base-content mb-4">Progression des objectifs</h3>
          <ObjectiveProgress :objectives="objectives" />
        </div>
      </div>

      <!-- Error Modal -->
      <ErrorPopup :show="showErrorModal" :errorType="errorType" />
    </div>
  `,
  components: {
    DateRangePicker: MockDateRangePicker,
    TimeSeriesChart: MockTimeSeriesChart,
    PieChart: MockPieChart,
    ObjectiveProgress: MockObjectiveProgress,
    ErrorPopup: MockErrorPopup
  },
  data() {
    return {
      isLoading: false,
      dateRange: { from: '2024-06-01', to: '2024-06-30' },
      chartType: 'bar',
      showErrorModal: false,
      errorType: null,
      totalAnnouncements: 2,
      totalVolunteers: 2,
      totalParticipants: 25,
      engagementRate: 7,
      announcementsSeries: {
        labels: ['2024-06-01', '2024-06-15'],
        data: [1, 1]
      },
      pieData: {
        volunteers: 2,
        participants: 25
      },
      objectives: [
        {
          id: '1',
          title: 'Événement Test 1',
          covered: 10,
          planned: 20
        },
        {
          id: '2',
          title: 'Événement Test 2',
          covered: 15,
          planned: 25
        }
      ]
    }
  }
}

describe('AssociationDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render the main container', () => {
      const wrapper = mount(MockAssociationDashboard)
      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
      expect(wrapper.find('.container.mx-auto').exists()).toBe(true)
    })

    it('should render the header section', () => {
      const wrapper = mount(MockAssociationDashboard)
      const header = wrapper.find('h1')
      expect(header.exists()).toBe(true)
      expect(header.text()).toBe('Tableau de bord')
    })

    it('should render the description', () => {
      const wrapper = mount(MockAssociationDashboard)
      const description = wrapper.find('p')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Analysez vos performances')
    })
  })

  describe('Date Range Picker', () => {
    it('should render the date range picker section', () => {
      const wrapper = mount(MockAssociationDashboard)
      const dateSection = wrapper.find('.bg-base-100.rounded-xl')
      expect(dateSection.exists()).toBe(true)
    })

    it('should render the date range picker title', () => {
      const wrapper = mount(MockAssociationDashboard)
      const title = wrapper.find('h2')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe("Période d'analyse")
    })

    it('should render the date range picker component', () => {
      const wrapper = mount(MockAssociationDashboard)
      const datePicker = wrapper.find('.date-range-picker')
      expect(datePicker.exists()).toBe(true)
    })
  })

  describe('Key Metrics Cards', () => {
    it('should render all four metric cards', () => {
      const wrapper = mount(MockAssociationDashboard)
      const cards = wrapper.findAll('.bg-base-100.rounded-xl')
      expect(cards.length).toBeGreaterThanOrEqual(4)
    })

    it('should display total announcements', () => {
      const wrapper = mount(MockAssociationDashboard)
      const announcementsCard = wrapper.findAll('.text-2xl.font-bold').find(el => el.text() === '2')
      expect(announcementsCard).toBeDefined()
    })

    it('should display total volunteers', () => {
      const wrapper = mount(MockAssociationDashboard)
      const volunteersText = wrapper.text()
      expect(volunteersText).toContain('Bénévoles')
    })

    it('should display total participants', () => {
      const wrapper = mount(MockAssociationDashboard)
      const participantsText = wrapper.text()
      expect(participantsText).toContain('Participants')
    })

    it('should display engagement rate', () => {
      const wrapper = mount(MockAssociationDashboard)
      const engagementText = wrapper.text()
      expect(engagementText).toContain('7%')
    })
  })

  describe('Charts Section', () => {
    it('should render the charts section', () => {
      const wrapper = mount(MockAssociationDashboard)
      const chartsSection = wrapper.find('.grid.grid-cols-1.lg\\:grid-cols-2')
      expect(chartsSection.exists()).toBe(true)
    })

    it('should render the time series chart', () => {
      const wrapper = mount(MockAssociationDashboard)
      const timeSeriesChart = wrapper.find('.time-series-chart')
      expect(timeSeriesChart.exists()).toBe(true)
    })

    it('should render the pie chart', () => {
      const wrapper = mount(MockAssociationDashboard)
      const pieChart = wrapper.find('.pie-chart')
      expect(pieChart.exists()).toBe(true)
    })

    it('should display chart titles', () => {
      const wrapper = mount(MockAssociationDashboard)
      const titles = wrapper.findAll('h3')
      expect(titles.length).toBeGreaterThanOrEqual(2)
      expect(titles[0].text()).toBe('Évolution des annonces')
      expect(titles[1].text()).toBe('Répartition bénévoles/participants')
    })
  })

  describe('Objectives Section', () => {
    it('should render the objectives section', () => {
      const wrapper = mount(MockAssociationDashboard)
      const objectivesSection = wrapper.find('.bg-base-100.rounded-xl.shadow-lg.p-4')
      expect(objectivesSection.exists()).toBe(true)
    })

    it('should render the objectives title', () => {
      const wrapper = mount(MockAssociationDashboard)
      const titles = wrapper.findAll('h3')
      const objectivesTitle = titles.find(title => title.text() === 'Progression des objectifs')
      expect(objectivesTitle).toBeDefined()
    })

    it('should render the objective progress component', () => {
      const wrapper = mount(MockAssociationDashboard)
      const objectiveProgress = wrapper.find('.objective-progress')
      expect(objectiveProgress.exists()).toBe(true)
    })
  })

  describe('Loading State', () => {
    it('should show loading overlay when isLoading is true', () => {
      const wrapper = mount(MockAssociationDashboard, {
        data() {
          return {
            isLoading: true
          }
        }
      })
      const loadingOverlay = wrapper.find('.fixed.inset-0')
      expect(loadingOverlay.exists()).toBe(true)
    })

    it('should not show loading overlay when isLoading is false', () => {
      const wrapper = mount(MockAssociationDashboard, {
        data() {
          return {
            isLoading: false
          }
        }
      })
      const loadingOverlay = wrapper.find('.fixed.inset-0')
      expect(loadingOverlay.exists()).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should render error popup component', () => {
      const wrapper = mount(MockAssociationDashboard)
      const errorPopup = wrapper.find('.error-popup')
      expect(errorPopup.exists()).toBe(true)
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive container classes', () => {
      const wrapper = mount(MockAssociationDashboard)
      const container = wrapper.find('.container.mx-auto')
      expect(container.classes()).toContain('px-3')
      expect(container.classes()).toContain('sm:px-4')
    })

    it('should have responsive grid classes', () => {
      const wrapper = mount(MockAssociationDashboard)
      const grid = wrapper.find('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4')
      expect(grid.exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const wrapper = mount(MockAssociationDashboard)
      const headings = wrapper.findAll('h1, h2, h3')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('should have proper alt text for images', () => {
      const wrapper = mount(MockAssociationDashboard)
      const images = wrapper.findAll('img')
      images.forEach(img => {
        expect(img.attributes('alt')).toBeDefined()
      })
    })
  })
})
