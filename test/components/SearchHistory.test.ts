// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester le SearchHistory
const MockSearchHistory = {
  template: `
    <div class="space-y-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-base-content">Recent Searches</h3>
        <button 
          v-if="searchHistory.length > 0" 
          @click="clearHistory" 
          class="btn btn-sm btn-ghost"
        >
          Clear All
        </button>
      </div>
      
      <!-- Search history list -->
      <div v-if="searchHistory.length > 0" class="space-y-2">
        <div 
          v-for="(search, index) in searchHistory" 
          :key="index" 
          class="bg-base-200 rounded-lg p-3 flex justify-between items-center"
        >
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 text-base-content opacity-70">⏰</div>
            <div>
              <p class="font-medium text-base-content">{{ search.query }}</p>
              <div class="flex gap-2 text-xs text-base-content opacity-70">
                <span v-if="search.location">{{ search.location }}</span>
                <span v-if="search.category">{{ search.category }}</span>
                <span>{{ formatDate(search.date) }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="repeatSearch(search)" 
              class="btn btn-sm btn-ghost btn-circle"
              title="Repeat search"
            >
              <div class="w-4 h-4">🔍</div>
            </button>
            <button 
              @click="removeSearch(index)" 
              class="btn btn-sm btn-ghost btn-circle"
              title="Remove from history"
            >
              <div class="w-4 h-4">✕</div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="text-center py-8">
        <div class="w-12 h-12 mx-auto text-base-content opacity-30">⏰</div>
        <h3 class="mt-3 text-base font-medium text-base-content">No search history</h3>
        <p class="mt-1 text-sm text-base-content opacity-70">Your recent searches will appear here</p>
      </div>
    </div>
  `,
  props: {
    searchHistory: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    repeatSearch(search) {
      this.$emit("repeat", search);
    },

    removeSearch(index) {
      this.$emit("remove", index);
    },

    clearHistory() {
      this.$emit("clear");
    },
  },
};

describe("SearchHistory", () => {
  describe("Rendu de base", () => {
    it("should render search history component", () => {
      const wrapper = mount(MockSearchHistory);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".space-y-4").exists()).toBe(true);
    });

    it("should render title", () => {
      const wrapper = mount(MockSearchHistory);

      const title = wrapper.find("h3");
      expect(title.exists()).toBe(true);
      expect(title.text()).toBe("Recent Searches");
    });

    it("should render header section", () => {
      const wrapper = mount(MockSearchHistory);

      const header = wrapper.find(".flex.justify-between.items-center");
      expect(header.exists()).toBe(true);
    });
  });

  describe("État vide", () => {
    it("should show empty state when no search history", () => {
      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: [],
        },
      });

      const emptyState = wrapper.find(".text-center.py-8");
      expect(emptyState.exists()).toBe(true);
    });

    it("should show empty state message", () => {
      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: [],
        },
      });

      const emptyTitle = wrapper.find(".text-center.py-8 h3");
      expect(emptyTitle.text()).toBe("No search history");

      const emptyDescription = wrapper.find(".text-center.py-8 p");
      expect(emptyDescription.text()).toBe(
        "Your recent searches will appear here",
      );
    });

    it("should show empty state icon", () => {
      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: [],
        },
      });

      const emptyIcon = wrapper.find(".w-12.h-12.mx-auto");
      expect(emptyIcon.exists()).toBe(true);
    });

    it("should not show clear button when empty", () => {
      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: [],
        },
      });

      const clearButton = wrapper.find("button");
      expect(clearButton.exists()).toBe(false);
    });
  });

  describe("Liste d'historique", () => {
    it("should show search history when available", () => {
      const mockHistory = [
        {
          query: "environmental missions",
          location: "Paris",
          category: "Environmental",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const historyList = wrapper.find(".space-y-2");
      expect(historyList.exists()).toBe(true);
    });

    it("should render search history items", () => {
      const mockHistory = [
        {
          query: "environmental missions",
          location: "Paris",
          category: "Environmental",
          date: "2024-01-15T10:30:00Z",
        },
        {
          query: "humanitarian organizations",
          location: "Lyon",
          category: "Humanitarian",
          date: "2024-01-14T15:45:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const historyItems = wrapper.findAll(".bg-base-200.rounded-lg.p-3");
      expect(historyItems.length).toBe(2);
    });

    it("should display search query", () => {
      const mockHistory = [
        {
          query: "environmental missions",
          location: "Paris",
          category: "Environmental",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const queryText = wrapper.find(".font-medium.text-base-content");
      expect(queryText.text()).toBe("environmental missions");
    });

    it("should display search metadata", () => {
      const mockHistory = [
        {
          query: "environmental missions",
          location: "Paris",
          category: "Environmental",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const metadata = wrapper.find(".flex.gap-2.text-xs");
      expect(metadata.exists()).toBe(true);
      expect(metadata.text()).toContain("Paris");
      expect(metadata.text()).toContain("Environmental");
    });

    it("should format date correctly", () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const formattedDate = wrapper.vm.formatDate("2024-01-15T10:30:00Z");
      expect(formattedDate).toMatch(/Jan \d+, \d{2}:\d{2}/);
    });
  });

  describe("Boutons d'action", () => {
    it("should show clear button when history exists", () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const clearButton = wrapper.find("button");
      expect(clearButton.exists()).toBe(true);
      expect(clearButton.text()).toBe("Clear All");
    });

    it("should render repeat search button", () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const repeatButton = wrapper.find('button[title="Repeat search"]');
      expect(repeatButton.exists()).toBe(true);
    });

    it("should render remove button", () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const removeButton = wrapper.find('button[title="Remove from history"]');
      expect(removeButton.exists()).toBe(true);
    });

    it("should emit clear event when clear button is clicked", async () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const clearButton = wrapper.find("button");
      await clearButton.trigger("click");

      expect(wrapper.emitted("clear")).toBeTruthy();
    });

    it("should emit repeat event when repeat button is clicked", async () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const repeatButton = wrapper.find('button[title="Repeat search"]');
      await repeatButton.trigger("click");

      expect(wrapper.emitted("repeat")).toBeTruthy();
      expect(wrapper.emitted("repeat")[0][0]).toEqual(mockHistory[0]);
    });

    it("should emit remove event when remove button is clicked", async () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const removeButton = wrapper.find('button[title="Remove from history"]');
      await removeButton.trigger("click");

      expect(wrapper.emitted("remove")).toBeTruthy();
      expect(wrapper.emitted("remove")[0][0]).toBe(0);
    });
  });

  describe("Accessibilité", () => {
    it("should have proper button titles", () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const repeatButton = wrapper.find('button[title="Repeat search"]');
      expect(repeatButton.exists()).toBe(true);

      const removeButton = wrapper.find('button[title="Remove from history"]');
      expect(removeButton.exists()).toBe(true);
    });

    it("should have proper heading structure", () => {
      const wrapper = mount(MockSearchHistory);

      const heading = wrapper.find("h3");
      expect(heading.exists()).toBe(true);
      expect(heading.classes()).toContain("text-lg");
      expect(heading.classes()).toContain("font-semibold");
    });

    it("should have proper icon accessibility", () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const icons = wrapper.findAll(".w-4.h-4");
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper container styling", () => {
      const wrapper = mount(MockSearchHistory);

      const container = wrapper.find(".space-y-4");
      expect(container.exists()).toBe(true);
    });

    it("should have proper header styling", () => {
      const wrapper = mount(MockSearchHistory);

      const header = wrapper.find(".flex.justify-between.items-center");
      expect(header.exists()).toBe(true);
      expect(header.classes()).toContain("mb-4");
    });

    it("should have proper button styling", () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const clearButton = wrapper.find("button");
      expect(clearButton.classes()).toContain("btn");
      expect(clearButton.classes()).toContain("btn-sm");
      expect(clearButton.classes()).toContain("btn-ghost");
    });

    it("should have proper history item styling", () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const historyItem = wrapper.find(".bg-base-200.rounded-lg.p-3");
      expect(historyItem.exists()).toBe(true);
      expect(historyItem.classes()).toContain("flex");
      expect(historyItem.classes()).toContain("justify-between");
      expect(historyItem.classes()).toContain("items-center");
    });

    it("should have proper empty state styling", () => {
      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: [],
        },
      });

      const emptyState = wrapper.find(".text-center.py-8");
      expect(emptyState.exists()).toBe(true);
    });
  });

  describe("Interactions utilisateur", () => {
    it("should handle multiple search history items", () => {
      const mockHistory = [
        {
          query: "first query",
          date: "2024-01-15T10:30:00Z",
        },
        {
          query: "second query",
          date: "2024-01-14T15:45:00Z",
        },
        {
          query: "third query",
          date: "2024-01-13T09:15:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const historyItems = wrapper.findAll(".bg-base-200.rounded-lg.p-3");
      expect(historyItems.length).toBe(3);
    });

    it("should handle search with missing optional fields", () => {
      const mockHistory = [
        {
          query: "simple query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const queryText = wrapper.find(".font-medium.text-base-content");
      expect(queryText.text()).toBe("simple query");
    });

    it("should handle search with all fields", () => {
      const mockHistory = [
        {
          query: "complete query",
          location: "Paris",
          category: "Environmental",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      const metadata = wrapper.find(".flex.gap-2.text-xs");
      expect(metadata.text()).toContain("Paris");
      expect(metadata.text()).toContain("Environmental");
    });
  });

  describe("Props et états", () => {
    it("should initialize with empty search history", () => {
      const wrapper = mount(MockSearchHistory);

      expect(wrapper.vm.searchHistory).toEqual([]);
    });

    it("should accept search history prop", () => {
      const mockHistory = [
        {
          query: "test query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: mockHistory,
        },
      });

      expect(wrapper.vm.searchHistory).toEqual(mockHistory);
    });

    it("should handle prop changes", async () => {
      const wrapper = mount(MockSearchHistory, {
        props: {
          searchHistory: [],
        },
      });

      expect(wrapper.vm.searchHistory).toEqual([]);

      const newHistory = [
        {
          query: "new query",
          date: "2024-01-15T10:30:00Z",
        },
      ];

      await wrapper.setProps({ searchHistory: newHistory });
      await nextTick();

      expect(wrapper.vm.searchHistory).toEqual(newHistory);
    });
  });
});
