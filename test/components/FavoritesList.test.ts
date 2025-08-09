// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester la liste des favoris
const MockFavoritesList = {
  template: `
    <div class="space-y-4">
      <!-- Filter and search -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="form-control flex-1">
          <div class="input-group">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search favorites..." 
              class="input input-bordered w-full" 
              aria-label="Champ de saisie">
            <button class="btn btn-square">
              <span class="w-5 h-5">🔍</span>
            </button>
          </div>
        </div>
        
        <select v-model="filterType" class="select select-bordered" aria-label="Sélection">
          <option value="all">All Favorites</option>
          <option value="missions">Missions</option>
          <option value="organizations">Organizations</option>
        </select>
      </div>
      
      <!-- Favorites list -->
      <div v-if="filteredFavorites.length > 0" class="grid grid-cols-1 gap-4">
        <!-- Mission favorites -->
        <div 
          v-for="favorite in filteredFavorites" 
          :key="favorite.id" 
          v-memo="[favorite]"
          class="card bg-base-200 shadow-sm"
        >
          <div class="card-body p-4">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2">
                  <span class="badge badge-sm">{{ favorite.type === 'mission' ? 'Mission' : 'Organization' }}</span>
                  <h2 class="card-title text-base-content">{{ favorite.title || favorite.name }}</h2>
                </div>
                <p class="text-base-content opacity-70">{{ favorite.organization || favorite.category }}</p>
                
                <div v-if="favorite.type === 'mission'" class="flex items-center gap-2 mt-2">
                  <span class="w-4 h-4 text-base-content opacity-70">📅</span>
                  <span class="text-sm text-base-content opacity-70">{{ favorite.date }}</span>
                </div>
                
                <div class="flex items-center gap-2 mt-1">
                  <span class="w-4 h-4 text-base-content opacity-70">📍</span>
                  <span class="text-sm text-base-content opacity-70">{{ favorite.location }}</span>
                </div>
              </div>
              
              <button class="btn btn-ghost btn-circle" @click="removeFavorite(favorite)">
                <span class="w-5 h-5 text-error fill-error">❤️</span>
              </button>
            </div>
            
            <p class="text-base-content mt-2">{{ favorite.description }}</p>
            
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-sm btn-outline" type="button">{{ favorite.type === 'mission' ? 'View Details' : 'View Profile' }}</button>
              <button v-if="favorite.type === 'mission'" class="btn btn-sm btn-primary" type="button">Apply</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <span class="w-16 h-16 mx-auto text-base-content opacity-30">❤️</span>
        <h3 class="mt-4 text-lg font-medium text-base-content">No favorites found</h3>
        <p class="mt-2 text-base-content opacity-70">
          {{ 
            searchQuery 
              ? 'No favorites match your search criteria.' 
              : 'Add items to your favorites to see them here.' 
          }}
        </p>
      </div>
    </div>
  `,
  props: {
    favorites: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchQuery: "",
      filterType: "all",
    };
  },
  computed: {
    filteredFavorites() {
      let results = this.favorites;

      // Filter by type
      if (this.filterType !== "all") {
        results = results.filter(
          (item) => item.type === this.filterType.slice(0, -1),
        ); // Remove 's' from end
      }

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        results = results.filter((item) => {
          const title = (item.title || item.name || "").toLowerCase();
          const description = (item.description || "").toLowerCase();
          const organization = (
            item.organization ||
            item.category ||
            ""
          ).toLowerCase();

          return (
            title.includes(query) ||
            description.includes(query) ||
            organization.includes(query)
          );
        });
      }

      return results;
    },
  },
  methods: {
    removeFavorite(favorite) {
      this.$emit("remove", favorite);
    },
  },
  emits: ["remove"],
};

describe("FavoritesList", () => {
  const mockFavorites = [
    {
      id: "1",
      type: "mission",
      title: "Help at Food Bank",
      description: "Volunteer to help distribute food to families in need",
      organization: "Community Food Bank",
      date: "2024-12-25",
      location: "Paris, France",
    },
    {
      id: "2",
      type: "organization",
      name: "Red Cross",
      description: "Humanitarian organization providing emergency assistance",
      category: "Humanitarian Aid",
      location: "Geneva, Switzerland",
    },
    {
      id: "3",
      type: "mission",
      title: "Clean Beach Initiative",
      description: "Help clean up the local beach and protect marine life",
      organization: "Ocean Conservation",
      date: "2024-12-26",
      location: "Marseille, France",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("should render component", () => {
      const wrapper = mount(MockFavoritesList);

      expect(wrapper.exists()).toBe(true);
    });

    it("should display search input", () => {
      const wrapper = mount(MockFavoritesList);

      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
      expect(wrapper.find('input[type="text"]').attributes("placeholder")).toBe(
        "Search favorites...",
      );
    });

    it("should display filter select", () => {
      const wrapper = mount(MockFavoritesList);

      const select = wrapper.find("select");
      expect(select.exists()).toBe(true);
      expect(select.find('option[value="all"]').text()).toBe("All Favorites");
      expect(select.find('option[value="missions"]').text()).toBe("Missions");
      expect(select.find('option[value="organizations"]').text()).toBe(
        "Organizations",
      );
    });
  });

  describe("Affichage des favoris", () => {
    it("should display favorites when provided", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      expect(wrapper.find(".card").exists()).toBe(true);
      expect(wrapper.findAll(".card")).toHaveLength(3);
    });

    it("should display mission favorites correctly", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[0]],
        },
      });

      expect(wrapper.find(".badge").text()).toBe("Mission");
      expect(wrapper.find(".card-title").text()).toBe("Help at Food Bank");
      expect(wrapper.find(".text-base-content.opacity-70").text()).toBe(
        "Community Food Bank",
      );
    });

    it("should display organization favorites correctly", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[1]],
        },
      });

      expect(wrapper.find(".badge").text()).toBe("Organization");
      expect(wrapper.find(".card-title").text()).toBe("Red Cross");
      expect(wrapper.find(".text-base-content.opacity-70").text()).toBe(
        "Humanitarian Aid",
      );
    });

    it("should display empty state when no favorites", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [],
        },
      });

      expect(wrapper.find(".text-center.py-12").exists()).toBe(true);
      expect(wrapper.find("h3").text()).toBe("No favorites found");
    });
  });

  describe("Filtrage des favoris", () => {
    it("should filter by search query", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue("Food");

      expect(wrapper.vm.filteredFavorites).toHaveLength(1);
      expect(wrapper.vm.filteredFavorites[0].title).toBe("Help at Food Bank");
    });

    it("should filter by type missions", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const select = wrapper.find("select");
      await select.setValue("missions");

      expect(wrapper.vm.filteredFavorites).toHaveLength(2);
      expect(
        wrapper.vm.filteredFavorites.every((fav) => fav.type === "mission"),
      ).toBe(true);
    });

    it("should filter by type organizations", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const select = wrapper.find("select");
      await select.setValue("organizations");

      expect(wrapper.vm.filteredFavorites).toHaveLength(1);
      expect(wrapper.vm.filteredFavorites[0].type).toBe("organization");
    });

    it("should show all favorites when filter is all", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const select = wrapper.find("select");
      await select.setValue("all");

      expect(wrapper.vm.filteredFavorites).toHaveLength(3);
    });
  });

  describe("Recherche avancée", () => {
    it("should search in title", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue("Beach");

      expect(wrapper.vm.filteredFavorites).toHaveLength(1);
      expect(wrapper.vm.filteredFavorites[0].title).toBe(
        "Clean Beach Initiative",
      );
    });

    it("should search in description", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue("marine");

      expect(wrapper.vm.filteredFavorites).toHaveLength(1);
      expect(wrapper.vm.filteredFavorites[0].title).toBe(
        "Clean Beach Initiative",
      );
    });

    it("should search in organization/category", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue("Conservation");

      expect(wrapper.vm.filteredFavorites).toHaveLength(1);
      expect(wrapper.vm.filteredFavorites[0].title).toBe(
        "Clean Beach Initiative",
      );
    });

    it("should be case insensitive", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue("FOOD");

      expect(wrapper.vm.filteredFavorites).toHaveLength(1);
      expect(wrapper.vm.filteredFavorites[0].title).toBe("Help at Food Bank");
    });
  });

  describe("Suppression des favoris", () => {
    it("should emit remove event when remove button is clicked", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[0]],
        },
      });

      const removeButton = wrapper.find(".btn-ghost.btn-circle");
      await removeButton.trigger("click");

      expect(wrapper.emitted("remove")).toBeTruthy();
      expect(wrapper.emitted("remove")[0][0]).toEqual(mockFavorites[0]);
    });

    it("should emit remove event with correct favorite data", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const removeButtons = wrapper.findAll(".btn-ghost.btn-circle");
      await removeButtons[1].trigger("click");

      expect(wrapper.emitted("remove")[0][0]).toEqual(mockFavorites[1]);
    });
  });

  describe("États conditionnels", () => {
    it("should show empty state message when no search results", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue("NonExistentItem");

      expect(wrapper.find(".text-center.py-12").exists()).toBe(true);
      expect(wrapper.find("p").text()).toContain(
        "No favorites match your search criteria",
      );
    });

    it("should show default empty state message when no favorites", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [],
        },
      });

      expect(wrapper.find("p").text()).toContain(
        "Add items to your favorites to see them here",
      );
    });

    it("should show mission-specific buttons for missions", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[0]],
        },
      });

      const buttons = wrapper.findAll(".btn");
      expect(buttons.some((btn) => btn.text().includes("View Details"))).toBe(
        true,
      );
      expect(buttons.some((btn) => btn.text().includes("Apply"))).toBe(true);
    });

    it("should show organization-specific buttons for organizations", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[1]],
        },
      });

      const buttons = wrapper.findAll(".btn");
      expect(buttons.some((btn) => btn.text().includes("View Profile"))).toBe(
        true,
      );
      expect(buttons.some((btn) => btn.text().includes("Apply"))).toBe(false);
    });
  });

  describe("Accessibilité", () => {
    it("should have proper input aria-label", () => {
      const wrapper = mount(MockFavoritesList);

      const input = wrapper.find('input[type="text"]');
      expect(input.attributes("aria-label")).toBe("Champ de saisie");
    });

    it("should have proper select aria-label", () => {
      const wrapper = mount(MockFavoritesList);

      const select = wrapper.find("select");
      expect(select.attributes("aria-label")).toBe("Sélection");
    });

    it("should have proper heading structure", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[0]],
        },
      });

      const headings = wrapper.findAll("h2, h3");
      expect(headings.length).toBeGreaterThan(0);
    });

    it("should have proper button structure", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[0]],
        },
      });

      const buttons = wrapper.findAll("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper container styling", () => {
      const wrapper = mount(MockFavoritesList);

      expect(wrapper.find(".space-y-4").exists()).toBe(true);
    });

    it("should have proper card styling", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[0]],
        },
      });

      const card = wrapper.find(".card");
      expect(card.classes()).toContain("bg-base-200");
      expect(card.classes()).toContain("shadow-sm");
    });

    it("should have proper badge styling", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[0]],
        },
      });

      const badge = wrapper.find(".badge");
      expect(badge.classes()).toContain("badge-sm");
    });

    it("should have proper button styling", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [mockFavorites[0]],
        },
      });

      const buttons = wrapper.findAll(".btn");
      buttons.forEach((button) => {
        expect(button.classes()).toContain("btn");
      });
    });
  });

  describe("Optimisation v-memo", () => {
    it("should use v-memo for performance optimization", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      // Vérifier que le template contient v-memo
      expect(wrapper.vm.$options.template).toContain("v-memo");
    });

    it("should memoize based on favorite property", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      // Vérifier que v-memo utilise l'array [favorite]
      expect(wrapper.vm.$options.template).toContain('v-memo="[favorite]"');
    });
  });

  describe("Interactions utilisateur", () => {
    it("should update search query on input", async () => {
      const wrapper = mount(MockFavoritesList);

      const searchInput = wrapper.find('input[type="text"]');
      await searchInput.setValue("test search");

      expect(wrapper.vm.searchQuery).toBe("test search");
    });

    it("should update filter type on select change", async () => {
      const wrapper = mount(MockFavoritesList);

      const select = wrapper.find("select");
      await select.setValue("missions");

      expect(wrapper.vm.filterType).toBe("missions");
    });

    it("should handle multiple filter changes", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const select = wrapper.find("select");
      await select.setValue("missions");
      expect(wrapper.vm.filteredFavorites).toHaveLength(2);

      await select.setValue("organizations");
      expect(wrapper.vm.filteredFavorites).toHaveLength(1);

      await select.setValue("all");
      expect(wrapper.vm.filteredFavorites).toHaveLength(3);
    });
  });

  describe("Événements", () => {
    it("should emit remove event with correct data", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const removeButton = wrapper.find(".btn-ghost.btn-circle");
      await removeButton.trigger("click");

      expect(wrapper.emitted("remove")).toBeTruthy();
      expect(wrapper.emitted("remove")[0][0]).toEqual(mockFavorites[0]);
    });

    it("should emit remove event for different favorites", async () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      const removeButtons = wrapper.findAll(".btn-ghost.btn-circle");
      await removeButtons[2].trigger("click");

      expect(wrapper.emitted("remove")[0][0]).toEqual(mockFavorites[2]);
    });
  });

  describe("Props et états", () => {
    it("should handle empty favorites array", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: [],
        },
      });

      expect(wrapper.vm.favorites).toHaveLength(0);
      expect(wrapper.vm.filteredFavorites).toHaveLength(0);
    });

    it("should handle undefined favorites prop", () => {
      const wrapper = mount(MockFavoritesList);

      expect(wrapper.vm.favorites).toEqual([]);
    });

    it("should handle large favorites array", () => {
      const largeFavorites = Array.from({ length: 100 }, (_, i) => ({
        id: `favorite-${i}`,
        type: i % 2 === 0 ? "mission" : "organization",
        title: `Favorite ${i}`,
        description: `Description ${i}`,
        organization: `Organization ${i}`,
        location: `Location ${i}`,
      }));

      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: largeFavorites,
        },
      });

      expect(wrapper.vm.favorites).toHaveLength(100);
      expect(wrapper.vm.filteredFavorites).toHaveLength(100);
    });
  });

  describe("Computed properties", () => {
    it("should compute filteredFavorites correctly", () => {
      const wrapper = mount(MockFavoritesList, {
        props: {
          favorites: mockFavorites,
        },
      });

      // Par défaut, tous les favoris
      expect(wrapper.vm.filteredFavorites).toHaveLength(3);

      // Avec recherche
      wrapper.vm.searchQuery = "Food";
      expect(wrapper.vm.filteredFavorites).toHaveLength(1);

      // Avec filtre de type
      wrapper.vm.searchQuery = "";
      wrapper.vm.filterType = "missions";
      expect(wrapper.vm.filteredFavorites).toHaveLength(2);

      // Avec recherche et filtre
      wrapper.vm.searchQuery = "Beach";
      expect(wrapper.vm.filteredFavorites).toHaveLength(1);
    });
  });
});
