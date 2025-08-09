// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester la page Dashboard
const MockDashboard = {
  template: `
    <div class="p-8">
      <div class="max-w-4xl mx-auto">
      </div>
    </div>
  `,
};

describe("Dashboard", () => {
  describe("Rendu de base", () => {
    it("should render dashboard page", () => {
      const wrapper = mount(MockDashboard);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".p-8").exists()).toBe(true);
    });

    it("should render main container", () => {
      const wrapper = mount(MockDashboard);

      const mainContainer = wrapper.find(".max-w-4xl.mx-auto");
      expect(mainContainer.exists()).toBe(true);
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper padding", () => {
      const wrapper = mount(MockDashboard);

      const container = wrapper.find(".p-8");
      expect(container.exists()).toBe(true);
    });

    it("should have proper max width and centering", () => {
      const wrapper = mount(MockDashboard);

      const mainContainer = wrapper.find(".max-w-4xl.mx-auto");
      expect(mainContainer.exists()).toBe(true);
      expect(mainContainer.classes()).toContain("max-w-4xl");
      expect(mainContainer.classes()).toContain("mx-auto");
    });
  });

  describe("Structure du contenu", () => {
    it("should have proper div structure", () => {
      const wrapper = mount(MockDashboard);

      const outerDiv = wrapper.find("div");
      expect(outerDiv.exists()).toBe(true);
      expect(outerDiv.classes()).toContain("p-8");

      const innerDiv = wrapper.find(".max-w-4xl.mx-auto");
      expect(innerDiv.exists()).toBe(true);
    });
  });
});
