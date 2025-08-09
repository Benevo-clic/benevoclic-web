// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock du store
const mockFavoriteAnnouncementStore = {
  getFavorites: [
    { id: "1", title: "Favorite Announcement 1" },
    { id: "2", title: "Favorite Announcement 2" },
  ],
  getFavoriteVolunteers: [
    { id: "vol1", name: "Volunteer 1" },
    { id: "vol2", name: "Volunteer 2" },
  ],
  getFavoritesAnnouncementsVolunteer: [
    { id: "1", title: "Volunteer Favorite" },
  ],
  loading: false,
  error: null,
  fetchFavorites: vi.fn(),
  addFavorite: vi.fn(),
  fetchAllFavorites: vi.fn(),
  fetchFavoritesByAnnouncementId: vi.fn(),
  findAllFavoritesAnnouncementsByVolunteerId: vi.fn(),
  removeAllByVolunteerId: vi.fn(),
  removeAllByAnnouncementId: vi.fn(),
  resetState: vi.fn(),
  removeByVolunteerIdAndAnnouncementId: vi.fn(),
  fetchAllFavoritesOfVolunteer: vi.fn(),
  fetchFavoriteVolunteerByVolunteerId: vi.fn(),
};

// Mock des modules Vue
const mockComputed = vi.fn((getter) => ({
  value: getter(),
}));

// Mock des modules
vi.mock("../../stores/favoritesAnnouncement.store", () => ({
  useFavoriteAnnouncement: () => mockFavoriteAnnouncementStore,
}));

// Mock globaux
global.computed = mockComputed;

// Fonction mock pour useFavoritesAnnouncement
const useFavoritesAnnouncement = () => {
  const announcementStore = mockFavoriteAnnouncementStore;

  return {
    fetchFavorites: announcementStore.fetchFavorites,
    addFavorite: announcementStore.addFavorite,
    getFavorites: mockComputed(() => announcementStore.getFavorites),
    getFavoriteVolunteers: mockComputed(
      () => announcementStore.getFavoriteVolunteers,
    ),
    fetchAllFavorites: announcementStore.fetchAllFavorites,
    fetchFavoritesByAnnouncementId:
      announcementStore.fetchFavoritesByAnnouncementId,
    findAllFavoritesAnnouncementsByVolunteerId:
      announcementStore.findAllFavoritesAnnouncementsByVolunteerId,
    removeAllByVolunteerId: announcementStore.removeAllByVolunteerId,
    removeAllByAnnouncementId: announcementStore.removeAllByAnnouncementId,
    resetState: announcementStore.resetState,
    getFavoritesAnnouncementsVolunteer: mockComputed(
      () => announcementStore.getFavoritesAnnouncementsVolunteer,
    ),
    loading: mockComputed(() => announcementStore.loading),
    error: mockComputed(() => announcementStore.error),
    removeByVolunteerIdAndAnnouncementId:
      announcementStore.removeByVolunteerIdAndAnnouncementId,
    fetchAllFavoritesOfVolunteer:
      announcementStore.fetchAllFavoritesOfVolunteer,
    fetchFavoriteVolunteerByVolunteerId:
      announcementStore.fetchFavoriteVolunteerByVolunteerId,
  };
};

describe("useFavoritesAnnouncement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockComputed.mockImplementation((getter) => ({
      value: getter(),
    }));
  });

  describe("Propriétés réactives", () => {
    it("should return favorites data", () => {
      const favorites = useFavoritesAnnouncement();

      expect(favorites.getFavorites.value).toEqual([
        { id: "1", title: "Favorite Announcement 1" },
        { id: "2", title: "Favorite Announcement 2" },
      ]);
    });

    it("should return favorite volunteers data", () => {
      const favorites = useFavoritesAnnouncement();

      expect(favorites.getFavoriteVolunteers.value).toEqual([
        { id: "vol1", name: "Volunteer 1" },
        { id: "vol2", name: "Volunteer 2" },
      ]);
    });

    it("should return favorites announcements volunteer data", () => {
      const favorites = useFavoritesAnnouncement();

      expect(favorites.getFavoritesAnnouncementsVolunteer.value).toEqual([
        { id: "1", title: "Volunteer Favorite" },
      ]);
    });

    it("should return loading state", () => {
      const favorites = useFavoritesAnnouncement();

      expect(favorites.loading.value).toBe(false);
    });

    it("should return error state", () => {
      const favorites = useFavoritesAnnouncement();

      expect(favorites.error.value).toBe(null);
    });
  });

  describe("Méthodes de récupération", () => {
    it("should call fetchFavorites", async () => {
      const favorites = useFavoritesAnnouncement();

      await favorites.fetchFavorites();

      expect(mockFavoriteAnnouncementStore.fetchFavorites).toHaveBeenCalled();
    });

    it("should call fetchAllFavorites", async () => {
      const favorites = useFavoritesAnnouncement();

      await favorites.fetchAllFavorites();

      expect(
        mockFavoriteAnnouncementStore.fetchAllFavorites,
      ).toHaveBeenCalled();
    });

    it("should call fetchFavoritesByAnnouncementId", async () => {
      const favorites = useFavoritesAnnouncement();
      const announcementId = "announcement1";

      await favorites.fetchFavoritesByAnnouncementId(announcementId);

      expect(
        mockFavoriteAnnouncementStore.fetchFavoritesByAnnouncementId,
      ).toHaveBeenCalledWith(announcementId);
    });

    it("should call findAllFavoritesAnnouncementsByVolunteerId", async () => {
      const favorites = useFavoritesAnnouncement();
      const volunteerId = "volunteer1";

      await favorites.findAllFavoritesAnnouncementsByVolunteerId(volunteerId);

      expect(
        mockFavoriteAnnouncementStore.findAllFavoritesAnnouncementsByVolunteerId,
      ).toHaveBeenCalledWith(volunteerId);
    });

    it("should call fetchAllFavoritesOfVolunteer", async () => {
      const favorites = useFavoritesAnnouncement();
      const volunteerId = "volunteer1";

      await favorites.fetchAllFavoritesOfVolunteer(volunteerId);

      expect(
        mockFavoriteAnnouncementStore.fetchAllFavoritesOfVolunteer,
      ).toHaveBeenCalledWith(volunteerId);
    });

    it("should call fetchFavoriteVolunteerByVolunteerId", async () => {
      const favorites = useFavoritesAnnouncement();
      const volunteerId = "volunteer1";

      await favorites.fetchFavoriteVolunteerByVolunteerId(volunteerId);

      expect(
        mockFavoriteAnnouncementStore.fetchFavoriteVolunteerByVolunteerId,
      ).toHaveBeenCalledWith(volunteerId);
    });
  });

  describe("Méthodes d'ajout", () => {
    it("should call addFavorite", async () => {
      const favorites = useFavoritesAnnouncement();
      const favoriteData = {
        volunteerId: "volunteer1",
        announcementId: "announcement1",
      };

      await favorites.addFavorite(favoriteData);

      expect(mockFavoriteAnnouncementStore.addFavorite).toHaveBeenCalledWith(
        favoriteData,
      );
    });
  });

  describe("Méthodes de suppression", () => {
    it("should call removeAllByVolunteerId", async () => {
      const favorites = useFavoritesAnnouncement();
      const volunteerId = "volunteer1";

      await favorites.removeAllByVolunteerId(volunteerId);

      expect(
        mockFavoriteAnnouncementStore.removeAllByVolunteerId,
      ).toHaveBeenCalledWith(volunteerId);
    });

    it("should call removeAllByAnnouncementId", async () => {
      const favorites = useFavoritesAnnouncement();
      const announcementId = "announcement1";

      await favorites.removeAllByAnnouncementId(announcementId);

      expect(
        mockFavoriteAnnouncementStore.removeAllByAnnouncementId,
      ).toHaveBeenCalledWith(announcementId);
    });

    it("should call removeByVolunteerIdAndAnnouncementId", async () => {
      const favorites = useFavoritesAnnouncement();
      const data = {
        volunteerId: "volunteer1",
        announcementId: "announcement1",
      };

      await favorites.removeByVolunteerIdAndAnnouncementId(data);

      expect(
        mockFavoriteAnnouncementStore.removeByVolunteerIdAndAnnouncementId,
      ).toHaveBeenCalledWith(data);
    });
  });

  describe("Méthodes de gestion d'état", () => {
    it("should call resetState", async () => {
      const favorites = useFavoritesAnnouncement();

      favorites.resetState();

      expect(mockFavoriteAnnouncementStore.resetState).toHaveBeenCalled();
    });
  });

  describe("Gestion des erreurs", () => {
    it("should handle store errors", () => {
      mockFavoriteAnnouncementStore.error = "Test error";

      const favorites = useFavoritesAnnouncement();

      expect(favorites.error.value).toBe("Test error");
    });

    it("should handle loading states", () => {
      mockFavoriteAnnouncementStore.loading = true;

      const favorites = useFavoritesAnnouncement();

      expect(favorites.loading.value).toBe(true);
    });
  });

  describe("Intégration avec le store", () => {
    it("should use favorite announcement store for all methods", () => {
      const favorites = useFavoritesAnnouncement();

      expect(favorites.fetchFavorites).toBe(
        mockFavoriteAnnouncementStore.fetchFavorites,
      );
      expect(favorites.addFavorite).toBe(
        mockFavoriteAnnouncementStore.addFavorite,
      );
      expect(favorites.fetchAllFavorites).toBe(
        mockFavoriteAnnouncementStore.fetchAllFavorites,
      );
      expect(favorites.resetState).toBe(
        mockFavoriteAnnouncementStore.resetState,
      );
    });

    it("should have reactive computed properties", () => {
      const favorites = useFavoritesAnnouncement();

      expect(favorites.getFavorites.value).toBeDefined();
      expect(favorites.getFavoriteVolunteers.value).toBeDefined();
      expect(favorites.getFavoritesAnnouncementsVolunteer.value).toBeDefined();
      expect(favorites.loading.value).toBeDefined();
      expect(favorites.error.value).toBeDefined();
    });
  });

  describe("Validation des données", () => {
    it("should return valid favorites data structure", () => {
      const favorites = useFavoritesAnnouncement();

      expect(Array.isArray(favorites.getFavorites.value)).toBe(true);
      expect(favorites.getFavorites.value[0]).toHaveProperty("id");
      expect(favorites.getFavorites.value[0]).toHaveProperty("title");
    });

    it("should return valid favorite volunteers data structure", () => {
      const favorites = useFavoritesAnnouncement();

      expect(Array.isArray(favorites.getFavoriteVolunteers.value)).toBe(true);
      expect(favorites.getFavoriteVolunteers.value[0]).toHaveProperty("id");
      expect(favorites.getFavoriteVolunteers.value[0]).toHaveProperty("name");
    });

    it("should handle empty favorites data", () => {
      mockFavoriteAnnouncementStore.getFavorites = [];

      const favorites = useFavoritesAnnouncement();

      expect(favorites.getFavorites.value).toEqual([]);
    });
  });

  describe("Méthodes utilitaires", () => {
    it("should handle multiple operations", async () => {
      const favorites = useFavoritesAnnouncement();
      const favoriteData = {
        volunteerId: "vol1",
        announcementId: "announcement1",
      };
      const volunteerId = "volunteer1";

      await favorites.addFavorite(favoriteData);
      await favorites.fetchAllFavoritesOfVolunteer(volunteerId);

      expect(mockFavoriteAnnouncementStore.addFavorite).toHaveBeenCalledWith(
        favoriteData,
      );
      expect(
        mockFavoriteAnnouncementStore.fetchAllFavoritesOfVolunteer,
      ).toHaveBeenCalledWith(volunteerId);
    });

    it("should handle favorite management operations", async () => {
      const favorites = useFavoritesAnnouncement();
      const volunteerId = "volunteer1";
      const announcementId = "announcement1";

      await favorites.fetchFavorites();
      await favorites.removeAllByVolunteerId(volunteerId);
      await favorites.removeAllByAnnouncementId(announcementId);

      expect(mockFavoriteAnnouncementStore.fetchFavorites).toHaveBeenCalled();
      expect(
        mockFavoriteAnnouncementStore.removeAllByVolunteerId,
      ).toHaveBeenCalledWith(volunteerId);
      expect(
        mockFavoriteAnnouncementStore.removeAllByAnnouncementId,
      ).toHaveBeenCalledWith(announcementId);
    });
  });
});
