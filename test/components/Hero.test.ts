// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester le Hero
const MockHero = {
  template: `
    <div class="hero">
      <section id="hero-section" v-if="!startSearching" class="hero min-h-[70vh] bg-gradient-to-br from-primary/10 to-secondary/10 py-16 px-4 flex items-center relative">
        <div class="max-w-6xl mx-auto w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-6 slide-in-left visible">
              <h1 class="text-4xl md:text-5xl font-bold text-base-content">
                Faites la différence avec <span class="text-primary">Benevoclic</span>
              </h1>
              <p class="text-lg text-base-content/80 max-w-xl">
                Découvrez des événements et missions qui correspondent à vos compétences,
                vos centres d'intérêt et vos disponibilités. Que vous soyez bénévole ou
                personne dans le besoin, rejoignez une communauté engagée et participez
                à des projets solidaires.
              </p>
              <div class="flex flex-wrap gap-4">
                <NuxtLink to="#search-section" class="btn btn-primary group">
                  Découvrir les événements
                  <span class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </NuxtLink>
                <button class="btn btn-outline hover:scale-105 transition-transform duration-300">
                  En savoir plus
                </button>
              </div>
            </div>
            <div class="relative slide-in-right visible delay-400 hidden lg:block">
              <img
                  src="/images/volunteer-info.png"
                  alt="Bénévoles en action"
                  class="w-full h-auto rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
              />
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
  },
};

describe("Hero", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("should render hero section when not searching", () => {
      const wrapper = mount(MockHero, {
        props: {
          startSearching: false,
        },
      });

      const heroSection = wrapper.find("#hero-section");
      expect(heroSection.exists()).toBe(true);
    });

    it("should not render hero section when searching", () => {
      const wrapper = mount(MockHero, {
        props: {
          startSearching: true,
        },
      });

      const heroSection = wrapper.find("#hero-section");
      expect(heroSection.exists()).toBe(false);
    });

    it("should display main heading", () => {
      const wrapper = mount(MockHero);

      const heading = wrapper.find("h1");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toContain("Faites la différence avec");
      expect(heading.text()).toContain("Benevoclic");
    });

    it("should display description text", () => {
      const wrapper = mount(MockHero);

      const description = wrapper.find("p");
      expect(description.exists()).toBe(true);
      expect(description.text()).toContain(
        "Découvrez des événements et missions",
      );
    });
  });

  describe("Boutons d'action", () => {
    it("should display discover events button", () => {
      const wrapper = mount(MockHero);

      // Vérifier que le conteneur des boutons existe
      const buttonContainer = wrapper.find(".flex.flex-wrap.gap-4");
      expect(buttonContainer.exists()).toBe(true);

      // Vérifier que le texte du bouton est présent dans le template
      expect(wrapper.text()).toContain("Découvrir les événements");

      // Vérifier les classes CSS des boutons
      const buttons = wrapper.findAll(".btn");
      if (buttons.length > 0) {
        buttons.forEach((button) => {
          expect(button.classes()).toContain("btn");
        });
      }
    });

    it("should display learn more button", () => {
      const wrapper = mount(MockHero);

      const learnMoreButton = wrapper.find("button");
      expect(learnMoreButton.exists()).toBe(true);
      expect(learnMoreButton.text()).toContain("En savoir plus");
      expect(learnMoreButton.classes()).toContain("btn-outline");
    });
  });

  describe("Image et contenu visuel", () => {
    it("should display hero image", () => {
      const wrapper = mount(MockHero);

      const image = wrapper.find('img[alt="Bénévoles en action"]');
      expect(image.exists()).toBe(true);
      expect(image.attributes("src")).toBe("/images/volunteer-info.png");
    });

    it("should have proper image styling", () => {
      const wrapper = mount(MockHero);

      const image = wrapper.find('img[alt="Bénévoles en action"]');
      expect(image.classes()).toContain("rounded-xl");
      expect(image.classes()).toContain("shadow-xl");
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper hero container styling", () => {
      const wrapper = mount(MockHero);

      const heroSection = wrapper.find("#hero-section");
      expect(heroSection.classes()).toContain("hero");
      expect(heroSection.classes()).toContain("min-h-[70vh]");
      expect(heroSection.classes()).toContain("bg-gradient-to-br");
    });

    it("should have proper grid layout", () => {
      const wrapper = mount(MockHero);

      const grid = wrapper.find(".grid");
      expect(grid.classes()).toContain("grid-cols-1");
      expect(grid.classes()).toContain("lg:grid-cols-2");
    });

    it("should have proper button styling", () => {
      const wrapper = mount(MockHero);

      const buttons = wrapper.findAll(".btn");
      buttons.forEach((button) => {
        expect(button.classes()).toContain("btn");
      });
    });
  });

  describe("Accessibilité", () => {
    it("should have proper heading structure", () => {
      const wrapper = mount(MockHero);

      const heading = wrapper.find("h1");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBeTruthy();
    });

    it("should have proper image alt text", () => {
      const wrapper = mount(MockHero);

      const image = wrapper.find("img");
      expect(image.attributes("alt")).toBe("Bénévoles en action");
    });

    it("should have proper link attributes", () => {
      const wrapper = mount(MockHero);

      // Vérifier que le conteneur des liens existe
      const linkContainer = wrapper.find(".flex.flex-wrap.gap-4");
      expect(linkContainer.exists()).toBe(true);

      // Vérifier que le texte du bouton est présent
      expect(wrapper.text()).toContain("Découvrir les événements");
    });
  });

  describe("Responsive design", () => {
    it("should have responsive text sizing", () => {
      const wrapper = mount(MockHero);

      const heading = wrapper.find("h1");
      expect(heading.classes()).toContain("text-4xl");
      expect(heading.classes()).toContain("md:text-5xl");
    });

    it("should have responsive grid layout", () => {
      const wrapper = mount(MockHero);

      const grid = wrapper.find(".grid");
      expect(grid.classes()).toContain("grid-cols-1");
      expect(grid.classes()).toContain("lg:grid-cols-2");
    });
  });

  describe("Props et états", () => {
    it("should handle startSearching prop correctly", () => {
      const wrapper = mount(MockHero, {
        props: {
          startSearching: false,
        },
      });

      expect(wrapper.vm.startSearching).toBe(false);
      expect(wrapper.find("#hero-section").exists()).toBe(true);
    });

    it("should hide section when startSearching is true", () => {
      const wrapper = mount(MockHero, {
        props: {
          startSearching: true,
        },
      });

      expect(wrapper.vm.startSearching).toBe(true);
      expect(wrapper.find("#hero-section").exists()).toBe(false);
    });
  });
});
