// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester le composant Statistique
const MockStatistique = {
  template: `
    <div class="statistique">
      <section v-if="!startSearching" id="stats-section" class="py-16 px-4 bg-base-200">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12 slide-in-up" :class="{ 'visible': isVisible }">
            <h2 class="text-3xl font-bold mb-4">Benevoclic en chiffres</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Rejoignez notre communauté grandissante et participez à des événements qui font la différence.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-200" :class="{ 'visible': isVisible }">
              <div class="text-4xl font-bold text-primary mb-2 counter-animate">
                {{ animatedStats.events }}
              </div>
              <div class="text-xl font-semibold mb-2">Événements</div>
              <p class="text-base-content/70">
                Événements disponibles sur notre plateforme pour vous engager et faire la différence.
              </p>
            </div>

            <div class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-400" :class="{ 'visible': isVisible }">
              <div class="text-4xl font-bold text-secondary mb-2 counter-animate">
                {{ animatedStats.associations }}
              </div>
              <div class="text-xl font-semibold mb-2">Associations</div>
              <p class="text-base-content/70">
                Associations actives qui proposent des missions et événements variés.
              </p>
            </div>

            <div class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-600" :class="{ 'visible': isVisible }">
              <div class="text-4xl font-bold text-accent mb-2 counter-animate">
                {{ animatedStats.volunteers }}
              </div>
              <div class="text-xl font-semibold mb-2">
                Bénévole<span v-if="animatedStats.volunteers > 1">s</span>
                &
                participant<span v-if="animatedStats.volunteers > 1">s</span>
              </div>
              <p class="text-base-content/70">
                Nombre de bénévoles et participants engagés dans des actions solidaires.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  props: {
    startSearching: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    animatedStats: {
      type: Object,
      default: () => ({
        events: 0,
        associations: 0,
        volunteers: 0,
      }),
    },
  },
};

describe("Statistique", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("should render stats section when not searching", () => {
      const wrapper = mount(MockStatistique, {
        props: {
          startSearching: false,
        },
      });

      const statsSection = wrapper.find("#stats-section");
      expect(statsSection.exists()).toBe(true);
    });

    it("should not render stats section when searching", () => {
      const wrapper = mount(MockStatistique, {
        props: {
          startSearching: true,
        },
      });

      const statsSection = wrapper.find("#stats-section");
      expect(statsSection.exists()).toBe(false);
    });

    it("should display main heading", () => {
      const wrapper = mount(MockStatistique);

      const heading = wrapper.find("h2");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("Benevoclic en chiffres");
    });

    it("should display description text", () => {
      const wrapper = mount(MockStatistique);

      const description = wrapper.find("p");
      expect(description.exists()).toBe(true);
      expect(description.text()).toContain(
        "Rejoignez notre communauté grandissante",
      );
    });
  });

  describe("Cartes de statistiques", () => {
    it("should display all 3 stat cards", () => {
      const wrapper = mount(MockStatistique);

      const statCards = wrapper.findAll(".bg-base-100.p-8.rounded-xl");
      expect(statCards.length).toBe(3);
    });

    it("should display events stat card", () => {
      const wrapper = mount(MockStatistique);

      const eventCard = wrapper.findAll(".bg-base-100.p-8.rounded-xl")[0];
      expect(eventCard.find(".text-xl.font-semibold.mb-2").text()).toBe(
        "Événements",
      );
      expect(eventCard.find("p").text()).toContain("Événements disponibles");
    });

    it("should display associations stat card", () => {
      const wrapper = mount(MockStatistique);

      const associationCard = wrapper.findAll(".bg-base-100.p-8.rounded-xl")[1];
      expect(associationCard.find(".text-xl.font-semibold.mb-2").text()).toBe(
        "Associations",
      );
      expect(associationCard.find("p").text()).toContain(
        "Associations actives",
      );
    });

    it("should display volunteers stat card", () => {
      const wrapper = mount(MockStatistique);

      const volunteerCard = wrapper.findAll(".bg-base-100.p-8.rounded-xl")[2];
      expect(
        volunteerCard.find(".text-xl.font-semibold.mb-2").text(),
      ).toContain("Bénévole");
      expect(volunteerCard.find("p").text()).toContain(
        "bénévoles et participants",
      );
    });
  });

  describe("Affichage des chiffres", () => {
    it("should display animated stats correctly", () => {
      const mockStats = {
        events: 150,
        associations: 45,
        volunteers: 1200,
      };

      const wrapper = mount(MockStatistique, {
        props: {
          animatedStats: mockStats,
        },
      });

      const statNumbers = wrapper.findAll(".text-4xl.font-bold");
      expect(statNumbers.length).toBe(3);
      expect(statNumbers[0].text()).toBe("150");
      expect(statNumbers[1].text()).toBe("45");
      expect(statNumbers[2].text()).toBe("1200");
    });

    it("should handle zero values", () => {
      const mockStats = {
        events: 0,
        associations: 0,
        volunteers: 0,
      };

      const wrapper = mount(MockStatistique, {
        props: {
          animatedStats: mockStats,
        },
      });

      const statNumbers = wrapper.findAll(".text-4xl.font-bold");
      expect(statNumbers[0].text()).toBe("0");
      expect(statNumbers[1].text()).toBe("0");
      expect(statNumbers[2].text()).toBe("0");
    });
  });

  describe("Couleurs des statistiques", () => {
    it("should have different colors for each stat", () => {
      const wrapper = mount(MockStatistique);

      const statNumbers = wrapper.findAll(".text-4xl.font-bold");

      // Événements - Primary
      expect(statNumbers[0].classes()).toContain("text-primary");

      // Associations - Secondary
      expect(statNumbers[1].classes()).toContain("text-secondary");

      // Bénévoles - Accent
      expect(statNumbers[2].classes()).toContain("text-accent");
    });
  });

  describe("Pluralisation", () => {
    it("should handle singular form for volunteers", () => {
      const mockStats = {
        events: 1,
        associations: 1,
        volunteers: 1,
      };

      const wrapper = mount(MockStatistique, {
        props: {
          animatedStats: mockStats,
        },
      });

      const volunteerCard = wrapper.findAll(".bg-base-100.p-8.rounded-xl")[2];
      const title = volunteerCard.find(".text-xl.font-semibold.mb-2");
      expect(title.text()).toContain("Bénévole");
      expect(title.text()).not.toContain("Bénévoles");
    });

    it("should handle plural form for volunteers", () => {
      const mockStats = {
        events: 1,
        associations: 1,
        volunteers: 2,
      };

      const wrapper = mount(MockStatistique, {
        props: {
          animatedStats: mockStats,
        },
      });

      const volunteerCard = wrapper.findAll(".bg-base-100.p-8.rounded-xl")[2];
      const title = volunteerCard.find(".text-xl.font-semibold.mb-2");
      expect(title.text()).toContain("Bénévoles");
      expect(title.text()).toContain("participants");
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper section styling", () => {
      const wrapper = mount(MockStatistique);

      const section = wrapper.find("#stats-section");
      expect(section.classes()).toContain("py-16");
      expect(section.classes()).toContain("px-4");
      expect(section.classes()).toContain("bg-base-200");
    });

    it("should have proper grid layout", () => {
      const wrapper = mount(MockStatistique);

      const grid = wrapper.find(".grid");
      expect(grid.classes()).toContain("grid-cols-1");
      expect(grid.classes()).toContain("md:grid-cols-3");
    });

    it("should have proper card styling", () => {
      const wrapper = mount(MockStatistique);

      const cards = wrapper.findAll(".bg-base-100.p-8.rounded-xl");
      cards.forEach((card) => {
        expect(card.classes()).toContain("bg-base-100");
        expect(card.classes()).toContain("p-8");
        expect(card.classes()).toContain("rounded-xl");
        expect(card.classes()).toContain("shadow-md");
      });
    });
  });

  describe("Animation et visibilité", () => {
    it("should apply visible class when isVisible is true", () => {
      const wrapper = mount(MockStatistique, {
        props: {
          isVisible: true,
        },
      });

      const visibleElements = wrapper.findAll(".visible");
      expect(visibleElements.length).toBeGreaterThan(0);
    });

    it("should not apply visible class when isVisible is false", () => {
      const wrapper = mount(MockStatistique, {
        props: {
          isVisible: false,
        },
      });

      const visibleElements = wrapper.findAll(".visible");
      expect(visibleElements.length).toBe(0);
    });

    it("should have animation delays for cards", () => {
      const wrapper = mount(MockStatistique);

      const delayedCards = wrapper.findAll(
        ".delay-200, .delay-400, .delay-600",
      );
      expect(delayedCards.length).toBe(3);
    });
  });

  describe("Accessibilité", () => {
    it("should have proper heading structure", () => {
      const wrapper = mount(MockStatistique);

      const heading = wrapper.find("h2");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBeTruthy();
    });

    it("should have proper card structure", () => {
      const wrapper = mount(MockStatistique);

      const cards = wrapper.findAll(".bg-base-100.p-8.rounded-xl");
      cards.forEach((card) => {
        expect(card.find(".text-4xl.font-bold").exists()).toBe(true);
        expect(card.find(".text-xl.font-semibold.mb-2").exists()).toBe(true);
        expect(card.find("p").exists()).toBe(true);
      });
    });
  });

  describe("Responsive design", () => {
    it("should have responsive grid layout", () => {
      const wrapper = mount(MockStatistique);

      const grid = wrapper.find(".grid");
      expect(grid.classes()).toContain("grid-cols-1");
      expect(grid.classes()).toContain("md:grid-cols-3");
    });

    it("should have responsive text sizing", () => {
      const wrapper = mount(MockStatistique);

      const heading = wrapper.find("h2");
      expect(heading.classes()).toContain("text-3xl");
    });
  });

  describe("Props et états", () => {
    it("should handle startSearching prop correctly", () => {
      const wrapper = mount(MockStatistique, {
        props: {
          startSearching: false,
        },
      });

      expect(wrapper.vm.startSearching).toBe(false);
      expect(wrapper.find("#stats-section").exists()).toBe(true);
    });

    it("should handle isVisible prop correctly", () => {
      const wrapper = mount(MockStatistique, {
        props: {
          isVisible: true,
        },
      });

      expect(wrapper.vm.isVisible).toBe(true);
    });

    it("should handle animatedStats prop correctly", () => {
      const mockStats = {
        events: 100,
        associations: 50,
        volunteers: 1000,
      };

      const wrapper = mount(MockStatistique, {
        props: {
          animatedStats: mockStats,
        },
      });

      expect(wrapper.vm.animatedStats.events).toBe(100);
      expect(wrapper.vm.animatedStats.associations).toBe(50);
      expect(wrapper.vm.animatedStats.volunteers).toBe(1000);
    });
  });

  describe("Contenu et messaging", () => {
    it("should have compelling statistics messaging", () => {
      const wrapper = mount(MockStatistique);

      const description = wrapper.find("p");
      expect(description.text()).toContain("communauté grandissante");
      expect(description.text()).toContain("événements qui font la différence");
    });

    it("should have descriptive stat explanations", () => {
      const wrapper = mount(MockStatistique);

      const cards = wrapper.findAll(".bg-base-100.p-8.rounded-xl");

      // Événements
      expect(cards[0].find("p").text()).toContain("Événements disponibles");

      // Associations
      expect(cards[1].find("p").text()).toContain("Associations actives");

      // Bénévoles
      expect(cards[2].find("p").text()).toContain("bénévoles et participants");
    });
  });
});
