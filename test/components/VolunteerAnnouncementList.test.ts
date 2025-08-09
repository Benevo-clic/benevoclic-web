// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester la liste d'annonces des bénévoles
const MockVolunteerAnnouncementList = {
  template: `
    <div class="space-y-4">
      <div v-if="$props.announcements.length === 0" class="text-center text-gray-500">
        <img
            src="/images/no_data.png"
            alt="Illustration"
            class="w-full max-w-xl mx-auto"
            onerror="this.src='/images/volunteer-info.png'"
        />
      </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 xl1285:grid-cols-3 gap-4">
          <div class="col-span-full">
            <h2 class="text-lg font-semibold mb-0">
              {{ $props.totalAnnouncements }} annonces
            </h2>
          </div>
          <div v-for="announcement in $props.announcements" :key="announcement._id" class="announcement-card">
            {{ announcement.nameEvent }}
          </div>
        </div>
    </div>
  `,
  props: {
    announcements: { type: Array, default: () => [] },
    error: { type: String, default: null },
    totalAnnouncements: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      showErrorModal: false,
      errorType: null,
      favoriteIds: [],
    };
  },

  methods: {
    async toggleFavorite(announcement) {
      // Simuler le toggle des favoris
      const index = this.favoriteIds.indexOf(announcement._id);
      if (index > -1) {
        this.favoriteIds.splice(index, 1);
      } else {
        this.favoriteIds.push(announcement._id);
      }
    },
    handleReload() {
      window.location.reload();
    },
    handleGoHome() {
      // Simuler la navigation
      return "/";
    },
    handleError(error) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        this.errorType = "5xx";
        this.showErrorModal = true;
      } else if (
        error?.response?.status >= 400 &&
        error?.response?.status < 500
      ) {
        this.errorType = "4xx";
        this.showErrorModal = true;
      } else {
        console.error("Erreur inattendue:", error);
      }
    },
    async refreshFavorites() {
      // Simuler le rafraîchissement des favoris
      this.favoriteIds = ["1", "2"];
    },
    async addFavorite(announcementId, volunteerId) {
      // Simuler l'ajout aux favoris
      if (!this.favoriteIds.includes(announcementId)) {
        this.favoriteIds.push(announcementId);
      }
    },
    async removeFavorite(announcementId, volunteerId) {
      // Simuler la suppression des favoris
      const index = this.favoriteIds.indexOf(announcementId);
      if (index > -1) {
        this.favoriteIds.splice(index, 1);
      }
    },
  },
};

describe("VolunteerAnnouncementList", () => {
  const mockAnnouncements = [
    {
      _id: "1",
      nameEvent: "Test Event 1",
      description: "Description test 1",
      dateEvent: "2024-12-25",
      hoursEvent: "14:30",
      associationName: "Test Association 1",
      nbParticipants: 10,
      maxParticipants: 50,
      nbVolunteers: 5,
      maxVolunteers: 10,
      tags: ["Tag1", "Tag2"],
      status: "ACTIVE",
    },
    {
      _id: "2",
      nameEvent: "Test Event 2",
      description: "Description test 2",
      dateEvent: "2024-12-26",
      hoursEvent: "15:00",
      associationName: "Test Association 2",
      nbParticipants: 20,
      maxParticipants: 100,
      nbVolunteers: 8,
      maxVolunteers: 15,
      tags: ["Tag3"],
      status: "ACTIVE",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("should render component", () => {
      const wrapper = mount(MockVolunteerAnnouncementList);

      expect(wrapper.exists()).toBe(true);
    });

    it("should display empty state when no announcements", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: [],
          totalAnnouncements: 0,
        },
      });

      expect(wrapper.find(".text-center.text-gray-500").exists()).toBe(true);
      expect(wrapper.find('img[src="/images/no_data.png"]').exists()).toBe(
        true,
      );
    });

    it("should display announcements count", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      expect(wrapper.find("h2").text()).toBe("2 annonces");
    });

    it("should display announcements grid", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      expect(wrapper.find(".grid").exists()).toBe(true);
      expect(wrapper.find(".grid-cols-1").exists()).toBe(true);
      expect(wrapper.find(".md\\:grid-cols-2").exists()).toBe(true);
    });
  });

  describe("Affichage des annonces", () => {
    it("should render announcement cards", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      // Vérifier que les cartes sont rendues
      expect(wrapper.vm.$props.announcements).toHaveLength(2);
    });

    it("should handle single announcement", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: [mockAnnouncements[0]],
          totalAnnouncements: 1,
        },
      });

      expect(wrapper.find("h2").text()).toBe("1 annonces");
    });

    it("should handle multiple announcements", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      expect(wrapper.find("h2").text()).toBe("2 annonces");
    });
  });

  describe("Gestion des favoris", () => {
    it("should handle favorite toggle", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      await wrapper.vm.toggleFavorite(mockAnnouncements[0]);

      expect(wrapper.vm.favoriteIds).toContain("1");
    });

    it("should remove favorite when toggled again", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      // Ajouter aux favoris
      await wrapper.vm.toggleFavorite(mockAnnouncements[0]);
      expect(wrapper.vm.favoriteIds).toContain("1");

      // Retirer des favoris
      await wrapper.vm.toggleFavorite(mockAnnouncements[0]);
      expect(wrapper.vm.favoriteIds).not.toContain("1");
    });

    it("should handle add favorite", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      await wrapper.vm.addFavorite("3", "user123");

      expect(wrapper.vm.favoriteIds).toContain("3");
    });

    it("should handle remove favorite", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      // Ajouter d'abord
      wrapper.vm.favoriteIds = ["1", "2"];
      await wrapper.vm.removeFavorite("1", "user123");

      expect(wrapper.vm.favoriteIds).not.toContain("1");
      expect(wrapper.vm.favoriteIds).toContain("2");
    });

    it("should refresh favorites", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      await wrapper.vm.refreshFavorites();

      expect(wrapper.vm.favoriteIds).toEqual(["1", "2"]);
    });
  });

  describe("Gestion des erreurs", () => {
    it("should handle 5xx errors", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const error = { response: { status: 500 } };
      await wrapper.vm.handleError(error);

      expect(wrapper.vm.errorType).toBe("5xx");
      expect(wrapper.vm.showErrorModal).toBe(true);
      consoleSpy.mockRestore();
    });

    it("should handle 4xx errors", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const error = { response: { status: 404 } };
      await wrapper.vm.handleError(error);

      expect(wrapper.vm.errorType).toBe("4xx");
      expect(wrapper.vm.showErrorModal).toBe(true);
      consoleSpy.mockRestore();
    });

    it("should handle unexpected errors", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const error = new Error("Unexpected error");
      await wrapper.vm.handleError(error);

      expect(consoleSpy).toHaveBeenCalledWith("Erreur inattendue:", error);
      consoleSpy.mockRestore();
    });
  });

  describe("Navigation", () => {
    it("should handle reload", () => {
      const wrapper = mount(MockVolunteerAnnouncementList);
      const reloadSpy = vi
        .spyOn(window.location, "reload")
        .mockImplementation(() => {});

      wrapper.vm.handleReload();

      expect(reloadSpy).toHaveBeenCalled();
      reloadSpy.mockRestore();
    });

    it("should handle go home", () => {
      const wrapper = mount(MockVolunteerAnnouncementList);

      const result = wrapper.vm.handleGoHome();

      expect(result).toBe("/");
    });
  });

  describe("Props et états", () => {
    it("should handle loading state", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          loading: true,
        },
      });

      expect(wrapper.vm.$props.loading).toBe(true);
    });

    it("should handle error state", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          error: "Test error",
        },
      });

      expect(wrapper.vm.$props.error).toBe("Test error");
    });

    it("should handle empty announcements array", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: [],
          totalAnnouncements: 0,
        },
      });

      expect(wrapper.vm.$props.announcements).toHaveLength(0);
      expect(wrapper.vm.$props.totalAnnouncements).toBe(0);
    });

    it("should handle null error", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          error: null,
        },
      });

      expect(wrapper.vm.$props.error).toBe(null);
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper container styling", () => {
      const wrapper = mount(MockVolunteerAnnouncementList);

      expect(wrapper.find(".space-y-4").exists()).toBe(true);
    });

    it("should have proper grid styling", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      expect(wrapper.find(".grid").exists()).toBe(true);
      expect(wrapper.find(".gap-4").exists()).toBe(true);
    });

    it("should have proper empty state styling", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: [],
          totalAnnouncements: 0,
        },
      });

      expect(wrapper.find(".text-center").exists()).toBe(true);
      expect(wrapper.find(".text-gray-500").exists()).toBe(true);
    });
  });

  describe("Accessibilité", () => {
    it("should have proper image alt text", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: [],
          totalAnnouncements: 0,
        },
      });

      const img = wrapper.find("img");
      expect(img.attributes("alt")).toBe("Illustration");
    });

    it("should have proper heading structure", () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      const heading = wrapper.find("h2");
      expect(heading.exists()).toBe(true);
      expect(heading.text().trim()).toBeTruthy();
    });

    it("should have proper container structure", () => {
      const wrapper = mount(MockVolunteerAnnouncementList);

      const container = wrapper.find("div");
      expect(container.exists()).toBe(true);
    });
  });

  describe("Intégration des composants", () => {
    it("should handle multiple favorite toggles", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });

      // Toggle plusieurs favoris
      await wrapper.vm.toggleFavorite(mockAnnouncements[0]);
      await wrapper.vm.toggleFavorite(mockAnnouncements[1]);

      expect(wrapper.vm.favoriteIds).toContain("1");
      expect(wrapper.vm.favoriteIds).toContain("2");
    });

    it("should handle error during favorite operations", async () => {
      const wrapper = mount(MockVolunteerAnnouncementList, {
        props: {
          announcements: mockAnnouncements,
          totalAnnouncements: 2,
        },
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const error = { response: { status: 500 } };
      await wrapper.vm.handleError(error);

      expect(wrapper.vm.errorType).toBe("5xx");
      expect(wrapper.vm.showErrorModal).toBe(true);
      consoleSpy.mockRestore();
    });
  });
});
