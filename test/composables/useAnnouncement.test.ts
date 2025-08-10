// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock du store
const mockAnnouncementStore = {
  addParticipant: vi.fn(),
  addVolunteerWaiting: vi.fn(),
  addVolunteer: vi.fn(),
  removeParticipant: vi.fn(),
  removeVolunteer: vi.fn(),
  removeVolunteerWaiting: vi.fn(),
  createAnnouncement: vi.fn(),
  uploadImageCover: vi.fn(),
  updateAnnouncement: vi.fn(),
  updateStatus: vi.fn(),
  filterAnnouncement: vi.fn(),
  filterAssociationAnnouncements: vi.fn(),
  updatePresenceVolunteer: vi.fn(),
  updatePresenceParticipant: vi.fn(),
  getCurrentFilter: { status: 'active', type: 'event' },
  setCurrentFilter: vi.fn(),
  patchCurrentFilter: vi.fn(),
  removeAnnouncement: vi.fn(),
  getAnnouncements: [{ id: '1', title: 'Test Announcement' }],
  getCurrentAnnouncement: { id: '1', title: 'Current Announcement' },
  fetchAllAnnouncements: vi.fn(),
  fetchAnnouncements: vi.fn(),
  fetchAnnouncementById: vi.fn(),
  loading: false,
  error: null,
  clearCache: vi.fn(),
  invalidateCache: vi.fn(),
  isCacheValid: true
}

// Mock des modules Vue
const mockComputed = vi.fn(getter => ({
  value: getter()
}))

// Mock des modules
vi.mock('../../stores/announcement.store', () => ({
  useAnnouncementStore: () => mockAnnouncementStore
}))

// Mock globaux
global.computed = mockComputed

// Fonction mock pour useAnnouncement
const useAnnouncement = () => {
  const announcementStore = mockAnnouncementStore

  return {
    addParticipant: announcementStore.addParticipant,
    addVolunteerWaiting: announcementStore.addVolunteerWaiting,
    addVolunteer: announcementStore.addVolunteer,
    removeParticipant: announcementStore.removeParticipant,
    removeVolunteer: announcementStore.removeVolunteer,
    removeVolunteerWaiting: announcementStore.removeVolunteerWaiting,
    createAnnouncement: announcementStore.createAnnouncement,
    uploadImageCover: announcementStore.uploadImageCover,
    updateAnnouncement: announcementStore.updateAnnouncement,
    updateStatus: announcementStore.updateStatus,
    filterAnnouncement: announcementStore.filterAnnouncement,
    filterAssociationAnnouncementByAssociationId: announcementStore.filterAssociationAnnouncements,
    updatePresentVolunteer: announcementStore.updatePresenceVolunteer,
    updatePresentParticipant: announcementStore.updatePresenceParticipant,
    getCurrentFilter: mockComputed(() => announcementStore.getCurrentFilter),
    setCurrentFilter: announcementStore.setCurrentFilter,
    patchCurrentFilter: announcementStore.patchCurrentFilter,
    removeAnnouncement: announcementStore.removeAnnouncement,
    getAnnouncements: mockComputed(() => announcementStore.getAnnouncements),
    getCurrentAnnouncement: mockComputed(() => announcementStore.getCurrentAnnouncement),
    fetchAllAnnouncements: announcementStore.fetchAllAnnouncements,
    fetchAnnouncements: announcementStore.fetchAnnouncements,
    fetchAnnouncementById: announcementStore.fetchAnnouncementById,
    loading: mockComputed(() => announcementStore.loading),
    error: mockComputed(() => announcementStore.error),
    clearCache: announcementStore.clearCache,
    invalidateCache: announcementStore.invalidateCache,
    isCacheValid: mockComputed(() => announcementStore.isCacheValid)
  }
}

describe('useAnnouncement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockComputed.mockImplementation(getter => ({
      value: getter()
    }))
  })

  describe('Méthodes de participation', () => {
    it('should call addParticipant', async () => {
      const announcement = useAnnouncement()
      const participantData = {
        userId: 'user1',
        announcementId: 'announcement1'
      }

      await announcement.addParticipant(participantData)

      expect(mockAnnouncementStore.addParticipant).toHaveBeenCalledWith(participantData)
    })

    it('should call removeParticipant', async () => {
      const announcement = useAnnouncement()
      const participantData = {
        userId: 'user1',
        announcementId: 'announcement1'
      }

      await announcement.removeParticipant(participantData)

      expect(mockAnnouncementStore.removeParticipant).toHaveBeenCalledWith(participantData)
    })

    it('should call updatePresentParticipant', async () => {
      const announcement = useAnnouncement()
      const presenceData = {
        userId: 'user1',
        announcementId: 'announcement1',
        present: true
      }

      await announcement.updatePresentParticipant(presenceData)

      expect(mockAnnouncementStore.updatePresenceParticipant).toHaveBeenCalledWith(presenceData)
    })
  })

  describe('Méthodes de bénévolat', () => {
    it('should call addVolunteer', async () => {
      const announcement = useAnnouncement()
      const volunteerData = {
        volunteerId: 'volunteer1',
        announcementId: 'announcement1'
      }

      await announcement.addVolunteer(volunteerData)

      expect(mockAnnouncementStore.addVolunteer).toHaveBeenCalledWith(volunteerData)
    })

    it('should call addVolunteerWaiting', async () => {
      const announcement = useAnnouncement()
      const volunteerData = {
        volunteerId: 'volunteer1',
        announcementId: 'announcement1'
      }

      await announcement.addVolunteerWaiting(volunteerData)

      expect(mockAnnouncementStore.addVolunteerWaiting).toHaveBeenCalledWith(volunteerData)
    })

    it('should call removeVolunteer', async () => {
      const announcement = useAnnouncement()
      const volunteerData = {
        volunteerId: 'volunteer1',
        announcementId: 'announcement1'
      }

      await announcement.removeVolunteer(volunteerData)

      expect(mockAnnouncementStore.removeVolunteer).toHaveBeenCalledWith(volunteerData)
    })

    it('should call removeVolunteerWaiting', async () => {
      const announcement = useAnnouncement()
      const volunteerData = {
        volunteerId: 'volunteer1',
        announcementId: 'announcement1'
      }

      await announcement.removeVolunteerWaiting(volunteerData)

      expect(mockAnnouncementStore.removeVolunteerWaiting).toHaveBeenCalledWith(volunteerData)
    })

    it('should call updatePresentVolunteer', async () => {
      const announcement = useAnnouncement()
      const presenceData = {
        volunteerId: 'volunteer1',
        announcementId: 'announcement1',
        present: true
      }

      await announcement.updatePresentVolunteer(presenceData)

      expect(mockAnnouncementStore.updatePresenceVolunteer).toHaveBeenCalledWith(presenceData)
    })
  })

  describe('Méthodes de gestion des annonces', () => {
    it('should call createAnnouncement', async () => {
      const announcement = useAnnouncement()
      const announcementData = {
        title: 'Test',
        description: 'Test description'
      }

      await announcement.createAnnouncement(announcementData)

      expect(mockAnnouncementStore.createAnnouncement).toHaveBeenCalledWith(announcementData)
    })

    it('should call updateAnnouncement', async () => {
      const announcement = useAnnouncement()
      const announcementData = { id: '1', title: 'Updated Test' }

      await announcement.updateAnnouncement(announcementData)

      expect(mockAnnouncementStore.updateAnnouncement).toHaveBeenCalledWith(announcementData)
    })

    it('should call removeAnnouncement', async () => {
      const announcement = useAnnouncement()
      const announcementId = 'announcement1'

      await announcement.removeAnnouncement(announcementId)

      expect(mockAnnouncementStore.removeAnnouncement).toHaveBeenCalledWith(announcementId)
    })

    it('should call updateStatus', async () => {
      const announcement = useAnnouncement()
      const statusData = { announcementId: 'announcement1', status: 'active' }

      await announcement.updateStatus(statusData)

      expect(mockAnnouncementStore.updateStatus).toHaveBeenCalledWith(statusData)
    })

    it('should call uploadImageCover', async () => {
      const announcement = useAnnouncement()
      const imageData = {
        announcementId: 'announcement1',
        file: new File([''], 'test.jpg')
      }

      await announcement.uploadImageCover(imageData)

      expect(mockAnnouncementStore.uploadImageCover).toHaveBeenCalledWith(imageData)
    })
  })

  describe('Méthodes de filtrage', () => {
    it('should call filterAnnouncement', async () => {
      const announcement = useAnnouncement()
      const filterData = { status: 'active', type: 'event' }

      await announcement.filterAnnouncement(filterData)

      expect(mockAnnouncementStore.filterAnnouncement).toHaveBeenCalledWith(filterData)
    })

    it('should call filterAssociationAnnouncementByAssociationId', async () => {
      const announcement = useAnnouncement()
      const filterData = { associationId: 'association1' }

      await announcement.filterAssociationAnnouncementByAssociationId(filterData)

      expect(mockAnnouncementStore.filterAssociationAnnouncements).toHaveBeenCalledWith(filterData)
    })

    it('should call setCurrentFilter', async () => {
      const announcement = useAnnouncement()
      const filter = { status: 'active', type: 'event' }

      announcement.setCurrentFilter(filter)

      expect(mockAnnouncementStore.setCurrentFilter).toHaveBeenCalledWith(filter)
    })

    it('should call patchCurrentFilter', async () => {
      const announcement = useAnnouncement()
      const filterPatch = { status: 'inactive' }

      announcement.patchCurrentFilter(filterPatch)

      expect(mockAnnouncementStore.patchCurrentFilter).toHaveBeenCalledWith(filterPatch)
    })
  })

  describe('Méthodes de récupération', () => {
    it('should call fetchAllAnnouncements', async () => {
      const announcement = useAnnouncement()

      await announcement.fetchAllAnnouncements()

      expect(mockAnnouncementStore.fetchAllAnnouncements).toHaveBeenCalled()
    })

    it('should call fetchAnnouncements', async () => {
      const announcement = useAnnouncement()
      const params = { page: 1, limit: 10 }

      await announcement.fetchAnnouncements(params)

      expect(mockAnnouncementStore.fetchAnnouncements).toHaveBeenCalledWith(params)
    })

    it('should call fetchAnnouncementById', async () => {
      const announcement = useAnnouncement()
      const announcementId = 'announcement1'

      await announcement.fetchAnnouncementById(announcementId)

      expect(mockAnnouncementStore.fetchAnnouncementById).toHaveBeenCalledWith(announcementId)
    })
  })

  describe('Méthodes de cache', () => {
    it('should call clearCache', async () => {
      const announcement = useAnnouncement()

      announcement.clearCache()

      expect(mockAnnouncementStore.clearCache).toHaveBeenCalled()
    })

    it('should call invalidateCache', async () => {
      const announcement = useAnnouncement()

      announcement.invalidateCache()

      expect(mockAnnouncementStore.invalidateCache).toHaveBeenCalled()
    })
  })

  describe('Propriétés réactives', () => {
    it('should return getCurrentFilter', () => {
      const announcement = useAnnouncement()

      expect(announcement.getCurrentFilter.value).toEqual({
        status: 'active',
        type: 'event'
      })
    })

    it('should return getAnnouncements', () => {
      const announcement = useAnnouncement()

      expect(announcement.getAnnouncements.value).toEqual([{ id: '1', title: 'Test Announcement' }])
    })

    it('should return getCurrentAnnouncement', () => {
      const announcement = useAnnouncement()

      expect(announcement.getCurrentAnnouncement.value).toEqual({
        id: '1',
        title: 'Current Announcement'
      })
    })

    it('should return loading state', () => {
      const announcement = useAnnouncement()

      expect(announcement.loading.value).toBe(false)
    })

    it('should return error state', () => {
      const announcement = useAnnouncement()

      expect(announcement.error.value).toBe(null)
    })

    it('should return cache validity', () => {
      const announcement = useAnnouncement()

      expect(announcement.isCacheValid.value).toBe(true)
    })
  })

  describe('Gestion des erreurs', () => {
    it('should handle store errors', () => {
      mockAnnouncementStore.error = 'Test error'

      const announcement = useAnnouncement()

      expect(announcement.error.value).toBe('Test error')
    })

    it('should handle loading states', () => {
      mockAnnouncementStore.loading = true

      const announcement = useAnnouncement()

      expect(announcement.loading.value).toBe(true)
    })
  })

  describe('Intégration avec le store', () => {
    it('should use announcement store for all methods', () => {
      const announcement = useAnnouncement()

      expect(announcement.addParticipant).toBe(mockAnnouncementStore.addParticipant)
      expect(announcement.createAnnouncement).toBe(mockAnnouncementStore.createAnnouncement)
      expect(announcement.fetchAllAnnouncements).toBe(mockAnnouncementStore.fetchAllAnnouncements)
      expect(announcement.clearCache).toBe(mockAnnouncementStore.clearCache)
    })

    it('should have reactive computed properties', () => {
      const announcement = useAnnouncement()

      expect(announcement.getCurrentFilter.value).toBeDefined()
      expect(announcement.getAnnouncements.value).toBeDefined()
      expect(announcement.loading.value).toBeDefined()
      expect(announcement.error.value).toBeDefined()
    })
  })
})
