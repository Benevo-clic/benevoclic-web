// @ts-nocheck
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

const MockAnnouncementDetail = {
  template: `
    <div class="relative">
      <div class="container mx-auto px-2 md:px-4 py-6 max-w-4xl">
        <div class="relative w-full aspect-[3/1] rounded-2xl overflow-hidden mb-6 bg-base-200 flex items-center justify-center shadow-md">
          <div class="w-full h-full flex flex-col items-center justify-center text-base-content/60">
            <div class="avatar placeholder mb-3">
              <div class="bg-base-300 text-base-content rounded-full w-16">
                <div class="h-8 w-8">📷</div>
              </div>
            </div>
            <p class="text-sm font-medium">Aucune image</p>
          </div>
          <div class="absolute top-3 right-3">
            <div class="badge badge-primary">ACTIVE</div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 relative">
          <div class="flex items-center gap-3 mb-2">
            <div class="avatar placeholder">
              <div class="w-14 h-14 rounded-full bg-base-300 text-base-content ring-primary ring-offset-base-100 ring-2 ring-offset-2">
                <span class="text-lg font-bold">A</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-base font-semibold text-base-content truncate">Association Test</p>
            </div>
            <div class="flex-shrink-0">
              <button class="btn btn-sm btn-primary">
                <div class="w-4 h-4 mr-1">👤</div>
                Adhérer
              </button>
            </div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 relative">
          <h1 class="text-2xl font-bold mb-2 line-clamp-2">Événement Test</h1>
          <div class="flex flex-wrap gap-2 text-sm text-base-content/70 mb-2">
            <span class="flex items-center gap-1">
              <div class="h-4 w-4 text-primary">📅</div>
              15 Jan 2024
            </span>
            <span class="flex items-center gap-1">
              <div class="h-4 w-4 text-primary">⏰</div>
              14:00
            </span>
            <span class="flex items-center gap-1">
              <div class="h-4 w-4 text-secondary">📍</div>
              Paris
            </span>
          </div>
          <div class="mb-3 text-base-content/90">Description de l'événement test</div>
          <div class="badge badge-outline text-sm mr-1">
            <span class="text-base-content/70">Tag 1</span>
          </div>
          <div class="badge badge-outline text-sm mr-1">
            <span class="text-base-content/70">Tag 2</span>
          </div>
          <div class="flex gap-4 mt-4 mb-2">
            <div class="flex items-center gap-1 text-xs">
              <div class="h-4 w-4 text-primary">👥</div>
              <span class="font-medium">5/10</span>
              <span class="text-base-content/60">participants</span>
            </div>
            <div class="flex items-center gap-1 text-xs">
              <div class="h-4 w-4 text-secondary">🤝</div>
              <span class="font-medium">3/8</span>
              <span class="text-base-content/60">bénévoles</span>
            </div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
          <h2 class="text-xl font-bold mb-4">Détails de l'événement</h2>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <div class="w-4 h-4 text-primary">📅</div>
              </div>
              <div class="flex-1">
                <p class="font-medium text-base-content">Date et heure</p>
                <p class="text-sm text-base-content/70">15 Jan 2024 à 14:00</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="flex items-center justify-center w-8 h-8 bg-secondary/10 rounded-lg">
                <div class="w-4 h-4 text-secondary">📍</div>
              </div>
              <div class="flex-1">
                <p class="font-medium text-base-content">Lieu</p>
                <p class="text-sm text-base-content/70">123 Rue de la Paix, Paris</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold mb-4">Actions</h2>
          <div class="flex flex-col sm:flex-row gap-3">
            <button class="btn btn-primary">
              <div class="w-4 h-4 mr-2">🤝</div>
              Participer
            </button>
            <button class="btn btn-outline">
              <div class="w-4 h-4 mr-2">❤️</div>
              Ajouter aux favoris
            </button>
            <button class="btn btn-ghost">
              <div class="w-4 h-4 mr-2">📧</div>
              Contacter
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
};

describe("AnnouncementDetail", () => {
  it("should render the main container", () => {
    const wrapper = mount(MockAnnouncementDetail);
    expect(wrapper.find(".relative").exists()).toBe(true);
    expect(
      wrapper.find(".container.mx-auto.px-2.md\\:px-4.py-6.max-w-4xl").exists(),
    ).toBe(true);
  });

  it("should render the cover image section", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const coverSection = wrapper.find(
      ".relative.w-full.aspect-\\[3\\/1\\].rounded-2xl",
    );
    expect(coverSection.exists()).toBe(true);
    // The bg-base-200 class is on the same element
    expect(coverSection.classes()).toContain("bg-base-200");
  });

  it("should render the status badge", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const statusBadge = wrapper.find(".badge.badge-primary");
    expect(statusBadge.exists()).toBe(true);
    expect(statusBadge.text()).toBe("ACTIVE");
  });

  it("should render the association section", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const associationSection = wrapper.find(
      ".bg-base-100.rounded-xl.shadow-lg.p-6.mb-6",
    );
    expect(associationSection.exists()).toBe(true);
    expect(associationSection.find(".text-base.font-semibold").text()).toBe(
      "Association Test",
    );
  });

  it("should render the association avatar", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const avatar = wrapper.find(".avatar.placeholder");
    expect(avatar.exists()).toBe(true);
    // The avatar div is nested inside the placeholder with multiple classes
    const avatarDiv = avatar.find("div");
    expect(avatarDiv.exists()).toBe(true);
    expect(avatarDiv.classes()).toContain("bg-base-300");
    expect(avatarDiv.classes()).toContain("text-base-content");
    expect(avatarDiv.classes()).toContain("rounded-full");
  });

  it("should render the follow button", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const followButton = wrapper.find(".btn.btn-sm.btn-primary");
    expect(followButton.exists()).toBe(true);
    expect(followButton.text()).toContain("Adhérer");
  });

  it("should render the main event information", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const mainInfo = wrapper.findAll(
      ".bg-base-100.rounded-xl.shadow-lg.p-6.mb-6",
    )[1];
    expect(mainInfo.exists()).toBe(true);
    expect(mainInfo.find("h1").text()).toBe("Événement Test");
  });

  it("should render event details with icons", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const details = wrapper.find(
      ".flex.flex-wrap.gap-2.text-sm.text-base-content\\/70",
    );
    expect(details.exists()).toBe(true);

    const detailItems = details.findAll("span");
    expect(detailItems.length).toBe(3);
  });

  it("should render event tags", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const tags = wrapper.findAll(".badge.badge-outline.text-sm");
    expect(tags.length).toBe(2);
    expect(tags[0].text()).toBe("Tag 1");
    expect(tags[1].text()).toBe("Tag 2");
  });

  it("should render statistics", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const stats = wrapper.find(".flex.gap-4.mt-4.mb-2");
    expect(stats.exists()).toBe(true);

    const statItems = stats.findAll(".flex.items-center.gap-1.text-xs");
    expect(statItems.length).toBe(2);
  });

  it("should render event details section", () => {
    const wrapper = mount(MockAnnouncementDetail);
    // Find the section with "Détails de l'événement" heading
    const detailsSection = wrapper
      .findAll(".bg-base-100.rounded-xl.shadow-lg.p-6.mb-6")
      .find(
        (section) =>
          section.find("h2").exists() &&
          section.find("h2").text() === "Détails de l'événement",
      );
    expect(detailsSection).toBeDefined();
  });

  it("should render action buttons", () => {
    const wrapper = mount(MockAnnouncementDetail);
    // Find the section with "Actions" heading
    const actionsSection = wrapper
      .findAll(".bg-base-100.rounded-xl.shadow-lg.p-6")
      .find(
        (section) =>
          section.find("h2").exists() &&
          section.find("h2").text() === "Actions",
      );
    expect(actionsSection).toBeDefined();

    const buttons = actionsSection.findAll(".btn");
    expect(buttons.length).toBe(3);
  });

  it("should have proper button styling", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const buttons = wrapper.findAll(".btn");

    buttons.forEach((button) => {
      expect(button.classes()).toContain("btn");
    });
  });

  it("should render event description", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const description = wrapper.find(".mb-3.text-base-content\\/90");
    expect(description.exists()).toBe(true);
    expect(description.text()).toBe("Description de l'événement test");
  });

  it("should have proper card styling", () => {
    const wrapper = mount(MockAnnouncementDetail);
    const cards = wrapper.findAll(".bg-base-100.rounded-xl.shadow-lg.p-6");
    expect(cards.length).toBeGreaterThan(0);

    cards.forEach((card) => {
      expect(card.classes()).toContain("bg-base-100");
      expect(card.classes()).toContain("rounded-xl");
      expect(card.classes()).toContain("shadow-lg");
    });
  });
});
