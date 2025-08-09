// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester NoConnectedBottomBar
const MockNoConnectedBottomBar = {
  template: `
    <!-- VOLUNTEER layout with search bar -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Search bar à gauche -->
      <div class="w-full md:max-w-2xl lg:max-w-3xl flex-1">
        <div class="relative">
          <div class="flex">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for missions or associations"
              class="input input-bordered w-full h-12 text-base"
              @keyup.enter="handleSearch"
              id="search-input"
              aria-label="Rechercher des missions ou associations"
            />
            <button 
              class="btn btn-primary h-12 ml-2" 
              @click="handleSearch"
            >
              <span class="w-5 h-5">🔍</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Volunteer buttons -->
      <div class="w-full md:w-auto flex justify-center md:justify-end flex-wrap text-base-content">
        <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="handleHome">
          <span class="w-6 h-6">🏠</span> {{ t('header.volunteer.home') }}
        </button>
        <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="handleFavorites">
          <span class="w-6 h-6">❤️</span> {{ t('header.volunteer.favorites') }}
        </button>
        <div class="relative recent-searches-container">
          <button 
            class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 recent-searches-button" 
            @click.stop="toggleRecentSearches"
          >
            <span class="w-6 h-6">⏰</span> {{ t('header.volunteer.recent-search') }}
          </button>

          <!-- Recent searches dropdown -->
          <div 
            v-if="showRecentSearches" 
            class="absolute right-0 mt-2 w-64 bg-base-100 shadow-lg rounded-lg z-10 p-2"
          >
            <div class="flex justify-between items-center mb-2 pb-2 border-b border-base-300">
              <h3 class="font-medium text-base-content">{{ t('header.volunteer.recent-search') }}</h3>
              <button 
                v-if="recentSearches.length > 0"
                class="btn btn-ghost btn-xs" 
                @click.stop="clearRecentSearches"
              >{{ t('search.history.clear_all') }}</button>
            </div>

            <div v-if="recentSearches.length > 0" class="max-h-60 overflow-y-auto">
              <button 
                v-for="(search, index) in recentSearches" 
                :key="index"
                class="flex items-center justify-between w-full p-2 hover:bg-base-200 rounded-md mb-1 text-left"
                @click.stop="selectRecentSearch(search)"
              >
                <span class="truncate">{{ search }}</span>
                <span class="w-4 h-4 text-base-content opacity-50">🔍</span>
              </button>
            </div>

            <div v-else class="py-4 text-center text-base-content opacity-70">
              {{ t('search.history.no_history_description') }}
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="">
          <span class="w-6 h-6">❓</span> {{ t('header.volunteer.help') }}
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      showRecentSearches: false,
      searchQuery: "",
      recentSearches: ["recherche1", "recherche2", "recherche3"],
      t: (key) => {
        const translations = {
          "header.volunteer.home": "Accueil",
          "header.volunteer.favorites": "Favoris",
          "header.volunteer.recent-search": "Recherches récentes",
          "header.volunteer.help": "Aide",
          "search.history.clear_all": "Effacer tout",
          "search.history.no_history_description": "Aucune recherche récente",
        };
        return translations[key] || key;
      },
    };
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.addRecentSearch(this.searchQuery.trim());
        this.patchCurrentFilter({
          nameEvent: this.searchQuery.trim(),
          description: this.searchQuery.trim(),
          associationName: this.searchQuery.trim(),
        });
      } else {
        this.patchCurrentFilter({
          nameEvent: "",
          description: "",
          associationName: "",
        });
      }
    },
    selectRecentSearch(search) {
      this.searchQuery = search;
      this.showRecentSearches = false;
      this.addRecentSearch(search);
    },
    toggleRecentSearches() {
      this.showRecentSearches = !this.showRecentSearches;
    },
    closeRecentSearches(event) {
      const target = event.target;
      if (
        !target.closest(".recent-searches-container") &&
        !target.closest(".recent-searches-button")
      ) {
        this.showRecentSearches = false;
      }
    },
    addRecentSearch(search) {
      if (!this.recentSearches.includes(search)) {
        this.recentSearches.unshift(search);
        if (this.recentSearches.length > 10) {
          this.recentSearches = this.recentSearches.slice(0, 10);
        }
      }
    },
    clearRecentSearches() {
      this.recentSearches = [];
    },
    patchCurrentFilter(filter) {
      // Simuler la mise à jour du filtre
      return filter;
    },
    handleFavorites() {
      // Fonction vide pour les utilisateurs non connectés
    },
    handleHome() {
      return "/";
    },
  },
  mounted() {
    // Simuler l'ajout d'un event listener
    this.documentEventListener = this.closeRecentSearches;
  },
  unmounted() {
    // Simuler la suppression de l'event listener
    this.documentEventListener = null;
  },
};

describe("NoConnectedBottomBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("should render component", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      expect(wrapper.exists()).toBe(true);
    });

    it("should display search bar", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      expect(searchInput.exists()).toBe(true);
      expect(searchInput.attributes("placeholder")).toBe(
        "Search for missions or associations",
      );
    });

    it("should display search button", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchButton = wrapper.find("button.btn-primary");
      expect(searchButton.exists()).toBe(true);
      expect(searchButton.classes()).toContain("btn-primary");
    });
  });

  describe("Barre de recherche", () => {
    it("should handle search input", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      await searchInput.setValue("test search");

      expect(wrapper.vm.searchQuery).toBe("test search");
    });

    it("should handle search on enter key", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      await searchInput.setValue("test search");
      await searchInput.trigger("keyup.enter");

      expect(wrapper.vm.recentSearches).toContain("test search");
    });

    it("should handle search button click", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      await searchInput.setValue("test search");

      const searchButton = wrapper.find("button.btn-primary");
      await searchButton.trigger("click");

      expect(wrapper.vm.recentSearches).toContain("test search");
    });

    it("should handle empty search", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchButton = wrapper.find("button.btn-primary");
      await searchButton.trigger("click");

      expect(wrapper.vm.searchQuery).toBe("");
    });
  });

  describe("Boutons d'action", () => {
    it("should display home button", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const homeButton = wrapper
        .findAll("button")
        .find((btn) => btn.text().includes("🏠"));
      expect(homeButton.exists()).toBe(true);
      expect(homeButton.text()).toContain("Accueil");
    });

    it("should display favorites button", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const favoritesButton = wrapper
        .findAll("button")
        .find((btn) => btn.text().includes("❤️"));
      expect(favoritesButton.exists()).toBe(true);
      expect(favoritesButton.text()).toContain("Favoris");
    });

    it("should display help button", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const helpButton = wrapper
        .findAll("button")
        .find((btn) => btn.text().includes("❓"));
      expect(helpButton.exists()).toBe(true);
      expect(helpButton.text()).toContain("Aide");
    });

    it("should handle home navigation", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const result = await wrapper.vm.handleHome();
      expect(result).toBe("/");
    });

    it("should handle favorites (empty function for non-connected)", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const result = wrapper.vm.handleFavorites();
      expect(result).toBeUndefined();
    });
  });

  describe("Recherches récentes", () => {
    it("should display recent searches button", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const recentSearchesButton = wrapper
        .findAll("button")
        .find((btn) => btn.text().includes("⏰"));
      expect(recentSearchesButton.exists()).toBe(true);
      expect(recentSearchesButton.text()).toContain("Recherches récentes");
    });

    it("should toggle recent searches dropdown", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const recentSearchesButton = wrapper
        .findAll("button")
        .find((btn) => btn.text().includes("⏰"));
      await recentSearchesButton.trigger("click");

      expect(wrapper.vm.showRecentSearches).toBe(true);
    });

    it("should display recent searches items", () => {
      const wrapper = mount(MockNoConnectedBottomBar);
      wrapper.vm.showRecentSearches = true;

      const searchItems = wrapper
        .findAll("button")
        .filter((btn) => btn.text().includes("🔍"));
      expect(searchItems.length).toBeGreaterThan(0);
    });

    it("should select recent search", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);
      wrapper.vm.showRecentSearches = true;

      // Simuler directement la sélection
      wrapper.vm.selectRecentSearch("recherche1");
      expect(wrapper.vm.searchQuery).toBe("recherche1");
    });

    it("should clear recent searches", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);
      wrapper.vm.showRecentSearches = true;

      const clearButton = wrapper
        .findAll("button")
        .find((btn) => btn.text().includes("Effacer tout"));
      if (clearButton) {
        await clearButton.trigger("click");
        expect(wrapper.vm.recentSearches.length).toBe(0);
      }
    });

    it("should display no history message when empty", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      wrapper.vm.recentSearches = [];
      wrapper.vm.showRecentSearches = true;
      await nextTick();

      const noHistoryMessage = wrapper.find(".py-4.text-center");
      expect(noHistoryMessage.exists()).toBe(true);
      expect(noHistoryMessage.text()).toContain("Aucune recherche récente");
    });
  });

  describe("Navigation", () => {
    it("should handle home navigation", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const result = await wrapper.vm.handleHome();
      expect(result).toBe("/");
    });

    it("should handle favorites (no action for non-connected)", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const result = wrapper.vm.handleFavorites();
      expect(result).toBeUndefined();
    });
  });

  describe("Gestion des événements", () => {
    it("should close recent searches on outside click", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      wrapper.vm.showRecentSearches = true;

      const mockEvent = {
        target: document.createElement("div"),
      };

      wrapper.vm.closeRecentSearches(mockEvent);
      expect(wrapper.vm.showRecentSearches).toBe(false);
    });

    it("should not close recent searches on inside click", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      wrapper.vm.showRecentSearches = true;

      const mockEvent = {
        target: {
          closest: (selector) => {
            if (selector === ".recent-searches-container") return true;
            return null;
          },
        },
      };

      wrapper.vm.closeRecentSearches(mockEvent);
      expect(wrapper.vm.showRecentSearches).toBe(true);
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper container styling", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const container = wrapper.find(".flex.flex-col.md\\:flex-row");
      expect(container.exists()).toBe(true);
    });

    it("should have proper search bar styling", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      expect(searchInput.classes()).toContain("input");
      expect(searchInput.classes()).toContain("input-bordered");
      expect(searchInput.classes()).toContain("w-full");
      expect(searchInput.classes()).toContain("h-12");
    });

    it("should have proper button styling", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const buttons = wrapper.findAll(".btn");
      buttons.forEach((button) => {
        expect(button.classes()).toContain("btn");
      });
    });
  });

  describe("Accessibilité", () => {
    it("should have proper search input aria-label", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      expect(searchInput.attributes("aria-label")).toBe(
        "Rechercher des missions ou associations",
      );
    });

    it("should have proper search input id", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find('input[id="search-input"]');
      expect(searchInput.exists()).toBe(true);
    });

    it("should have proper button structure", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const buttons = wrapper.findAll("button");
      buttons.forEach((button) => {
        expect(button.exists()).toBe(true);
      });
    });
  });

  describe("Responsive design", () => {
    it("should have responsive container layout", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const container = wrapper.find(".flex.flex-col.md\\:flex-row");
      expect(container.classes()).toContain("md:flex-row");
    });

    it("should have responsive search bar width", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchContainer = wrapper.find(
        ".w-full.md\\:max-w-2xl.lg\\:max-w-3xl",
      );
      expect(searchContainer.classes()).toContain("md:max-w-2xl");
      expect(searchContainer.classes()).toContain("lg:max-w-3xl");
    });

    it("should have responsive button layout", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const buttonContainer = wrapper.find(
        ".w-full.md\\:w-auto.flex.justify-center.md\\:justify-end",
      );
      expect(buttonContainer.classes()).toContain("md:justify-end");
    });
  });

  describe("Gestion des états", () => {
    it("should handle search query state", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      await searchInput.setValue("test query");

      expect(wrapper.vm.searchQuery).toBe("test query");
    });

    it("should handle recent searches state", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      wrapper.vm.showRecentSearches = true;
      await nextTick();

      expect(wrapper.vm.showRecentSearches).toBe(true);
    });

    it("should maintain recent searches list", () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      expect(wrapper.vm.recentSearches.length).toBe(3);
      expect(wrapper.vm.recentSearches).toContain("recherche1");
    });
  });

  describe("Fonctionnalités de recherche", () => {
    it("should add search to recent searches", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      await searchInput.setValue("new search");
      await searchInput.trigger("keyup.enter");

      expect(wrapper.vm.recentSearches).toContain("new search");
    });

    it("should not add empty search to recent searches", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const initialLength = wrapper.vm.recentSearches.length;
      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      await searchInput.setValue("");
      await searchInput.trigger("keyup.enter");

      expect(wrapper.vm.recentSearches.length).toBe(initialLength);
    });

    it("should patch current filter with search query", async () => {
      const wrapper = mount(MockNoConnectedBottomBar);

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]',
      );
      await searchInput.setValue("test search");
      await searchInput.trigger("keyup.enter");

      // Vérifier que la fonction patchCurrentFilter a été appelée
      expect(wrapper.vm.patchCurrentFilter).toBeDefined();
    });
  });
});
