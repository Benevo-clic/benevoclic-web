// @ts-nocheck
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EventFiltersDrawer from "../../components/event/association/EventFiltersDrawer.vue";

describe("EventFiltersDrawer", () => {
  const mockFilters = {
    search: "",
    tags: "",
    status: "",
    city: "",
    postalCode: "",
    associationType: "",
    dateStart: "",
    dateEnd: "",
    timeStart: "",
    timeEnd: "",
  };

  it("should render filters drawer component", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("should display drawer when open is true", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    expect(wrapper.find("aside").exists()).toBe(true);
    expect(wrapper.find(".fixed.top-0.right-0").exists()).toBe(true);
  });

  it("should not display drawer when open is false", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: false,
        filters: mockFilters,
      },
    });

    expect(wrapper.find("aside").exists()).toBe(false);
  });

  it("should display drawer title", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    expect(wrapper.find(".font-bold.text-lg").text()).toBe("Filtres avancés");
  });

  it("should display close button", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const closeButton = wrapper.find(".btn.btn-ghost.btn-square");
    expect(closeButton.exists()).toBe(true);
  });

  it("should emit close event when close button is clicked", async () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const closeButton = wrapper.find(".btn.btn-ghost.btn-square");
    await closeButton.trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should emit close event when backdrop is clicked", async () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const backdrop = wrapper.find(".fixed.inset-0");
    await backdrop.trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should display search input", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const searchInput = wrapper.find('input[placeholder="Recherche..."]');
    expect(searchInput.exists()).toBe(true);
    expect(searchInput.attributes("type")).toBe("text");
  });

  it("should display tags input", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const tagsInput = wrapper.find('input[placeholder="Tags (virgules)"]');
    expect(tagsInput.exists()).toBe(true);
    expect(tagsInput.attributes("type")).toBe("text");
  });

  it("should display status select", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const statusSelect = wrapper.find("select");
    expect(statusSelect.exists()).toBe(true);
    expect(statusSelect.classes()).toContain("select");
    expect(statusSelect.classes()).toContain("select-bordered");
  });

  it("should have correct status options", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const statusSelect = wrapper.find("select");
    const options = statusSelect.findAll("option");

    expect(options).toHaveLength(4);
    expect(options[0].text()).toBe("Tous statuts");
    expect(options[1].text()).toBe("En attente");
    expect(options[2].text()).toBe("Active");
    expect(options[3].text()).toBe("Clôturée");
  });

  it("should display city input", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const cityInput = wrapper.find('input[placeholder="Ville"]');
    expect(cityInput.exists()).toBe(true);
  });

  it("should display postal code input", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const postalCodeInput = wrapper.find('input[placeholder="Code postal"]');
    expect(postalCodeInput.exists()).toBe(true);
  });

  it("should display association type select", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const associationTypeSelect = wrapper.findAll("select")[1];
    expect(associationTypeSelect.exists()).toBe(true);
  });

  it("should have correct association type options", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const associationTypeSelect = wrapper.findAll("select")[1];
    const options = associationTypeSelect.findAll("option");

    expect(options).toHaveLength(4);
    expect(options[0].text()).toBe("Tous types d'association");
    expect(options[1].text()).toBe("Solidaire");
    expect(options[2].text()).toBe("Sport");
    expect(options[3].text()).toBe("Culture");
  });

  it("should display date inputs", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const dateStartInput = wrapper.find('input[type="date"]');
    const dateEndInput = wrapper.findAll('input[type="date"]')[1];

    expect(dateStartInput.exists()).toBe(true);
    expect(dateEndInput.exists()).toBe(true);
  });

  it("should display time inputs", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const timeStartInput = wrapper.find('input[type="time"]');
    const timeEndInput = wrapper.findAll('input[type="time"]')[1];

    expect(timeStartInput.exists()).toBe(true);
    expect(timeEndInput.exists()).toBe(true);
  });

  it("should display date labels", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const labels = wrapper.findAll("label");
    expect(labels[0].text()).toBe("Date de début");
    expect(labels[1].text()).toBe("Date de fin");
  });

  it("should display time labels", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const labels = wrapper.findAll("label");
    expect(labels[2].text()).toBe("Heure de début");
    expect(labels[3].text()).toBe("Heure de fin");
  });

  it("should display action buttons", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const buttons = wrapper.findAll("button");
    const validateButton = buttons[1]; // After close button
    const cancelButton = buttons[2];

    expect(validateButton.text()).toBe("Valider");
    expect(cancelButton.text()).toBe("Annuler");
  });

  it("should have proper button styling", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const buttons = wrapper.findAll("button");
    const validateButton = buttons[1];
    const cancelButton = buttons[2];

    expect(validateButton.classes()).toContain("btn");
    expect(validateButton.classes()).toContain("btn-primary");
    expect(validateButton.classes()).toContain("flex-1");

    expect(cancelButton.classes()).toContain("btn");
    expect(cancelButton.classes()).toContain("btn-ghost");
    expect(cancelButton.classes()).toContain("flex-1");
  });

  it("should emit update:filters when validate button is clicked", async () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const validateButton = wrapper.findAll("button")[1];
    await validateButton.trigger("click");

    expect(wrapper.emitted("update:filters")).toBeTruthy();
  });

  it("should emit close when validate button is clicked", async () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const validateButton = wrapper.findAll("button")[1];
    await validateButton.trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should emit close when cancel button is clicked", async () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const cancelButton = wrapper.findAll("button")[2];
    await cancelButton.trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should handle tags as string and convert to array", async () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: {
          ...mockFilters,
          tags: "tag1, tag2, tag3",
        },
      },
    });

    const validateButton = wrapper.findAll("button")[1];
    await validateButton.trigger("click");

    const emittedFilters = wrapper.emitted("update:filters")?.[0][0];
    expect(emittedFilters.tags).toEqual(["tag1", "tag2", "tag3"]);
  });

  it("should handle empty tags", async () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: {
          ...mockFilters,
          tags: "",
        },
      },
    });

    const validateButton = wrapper.findAll("button")[1];
    await validateButton.trigger("click");

    const emittedFilters = wrapper.emitted("update:filters")?.[0][0];
    expect(emittedFilters.tags).toEqual([]);
  });

  it("should handle tags as array", async () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: {
          ...mockFilters,
          tags: ["tag1", "tag2"],
        },
      },
    });

    const validateButton = wrapper.findAll("button")[1];
    await validateButton.trigger("click");

    const emittedFilters = wrapper.emitted("update:filters")?.[0][0];
    expect(emittedFilters.tags).toEqual(["tag1", "tag2"]);
  });

  it("should have proper drawer styling", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const aside = wrapper.find("aside");
    expect(aside.classes()).toContain("fixed");
    expect(aside.classes()).toContain("top-0");
    expect(aside.classes()).toContain("right-0");
    expect(aside.classes()).toContain("h-screen");
    expect(aside.classes()).toContain("w-full");
    expect(aside.classes()).toContain("max-w-md");
    expect(aside.classes()).toContain("bg-base-100");
    expect(aside.classes()).toContain("shadow-lg");
    expect(aside.classes()).toContain("flex");
    expect(aside.classes()).toContain("flex-col");
    expect(aside.classes()).toContain("z-50");
    expect(aside.classes()).toContain("text-base-content");
  });

  it("should have proper backdrop styling", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const backdrop = wrapper.find(".fixed.inset-0");
    expect(backdrop.classes()).toContain("bg-black");
    expect(backdrop.classes()).toContain("bg-opacity-40");
    expect(backdrop.classes()).toContain("z-40");
  });

  it("should have proper input styling", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const inputs = wrapper.findAll("input");
    inputs.forEach((input) => {
      expect(input.classes()).toContain("input");
      expect(input.classes()).toContain("input-bordered");
      expect(input.classes()).toContain("w-full");
    });
  });

  it("should have proper accessibility attributes", () => {
    const wrapper = mount(EventFiltersDrawer, {
      props: {
        open: true,
        filters: mockFilters,
      },
    });

    const inputs = wrapper.findAll("input");
    const selects = wrapper.findAll("select");

    inputs.forEach((input) => {
      expect(input.attributes("aria-label")).toBe("Champ de saisie");
    });

    selects.forEach((select) => {
      expect(select.attributes("aria-label")).toBe("Sélection");
    });
  });
});
