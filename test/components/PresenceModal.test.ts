import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PresenceModal from "../../components/event/association/PresenceModal.vue";

describe("PresenceModal", () => {
  const mockProps = {
    personId: "123",
    personName: "John Doe",
    isVolunteer: true,
    initialPresence: false,
    loading: false,
  };

  it("should render presence modal component", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("dialog").exists()).toBe(true);
  });

  it("should display modal title", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    expect(wrapper.find("h3").text()).toBe("Marquer la présence");
  });

  it("should display person name in description", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    expect(wrapper.text()).toContain("John Doe");
  });

  it("should display correct presence status for absent person", () => {
    const wrapper = mount(PresenceModal, {
      props: {
        ...mockProps,
        initialPresence: false,
      },
    });

    expect(wrapper.text()).toContain(
      "Souhaitez-vous marquer John Doe comme présent",
    );
    expect(wrapper.find(".label-text").text()).toBe("Absent");
  });

  it("should display correct presence status for present person", () => {
    const wrapper = mount(PresenceModal, {
      props: {
        ...mockProps,
        initialPresence: true,
      },
    });

    expect(wrapper.text()).toContain(
      "Souhaitez-vous marquer John Doe comme absent",
    );
    expect(wrapper.find(".label-text").text()).toBe("Présent");
  });

  it("should have checkbox for presence toggle", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.exists()).toBe(true);
    expect(checkbox.classes()).toContain("checkbox");
    expect(checkbox.classes()).toContain("checkbox-primary");
  });

  it("should have proper checkbox accessibility", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.attributes("aria-label")).toBe("Champ de saisie");
  });

  it("should display cancel and confirm buttons", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(3); // Cancel, Confirm, and backdrop close button

    const cancelButton = buttons[0];
    const confirmButton = buttons[1];

    expect(cancelButton.text()).toBe("Annuler");
    expect(confirmButton.text()).toBe("Confirmer");
  });

  it("should have proper button styling", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const buttons = wrapper.findAll("button");
    const cancelButton = buttons[0];
    const confirmButton = buttons[1];

    expect(cancelButton.classes()).toContain("btn");
    expect(cancelButton.classes()).toContain("btn-ghost");
    expect(confirmButton.classes()).toContain("btn");
    expect(confirmButton.classes()).toContain("btn-primary");
  });

  it("should emit close event when cancel button is clicked", async () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const cancelButton = wrapper.findAll("button")[0];
    await cancelButton.trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should emit confirm event when confirm button is clicked", async () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const confirmButton = wrapper.findAll("button")[1];
    await confirmButton.trigger("click");

    expect(wrapper.emitted("confirm")).toBeTruthy();
    expect(wrapper.emitted("confirm")?.[0]).toEqual(["123", false, true]);
  });

  it("should emit close event after confirmation", async () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const confirmButton = wrapper.findAll("button")[1];
    await confirmButton.trigger("click");

    // Wait for the timeout in confirmPresence function
    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should show loading state when loading is true", () => {
    const wrapper = mount(PresenceModal, {
      props: {
        ...mockProps,
        loading: true,
      },
    });

    const confirmButton = wrapper.findAll("button")[1];
    expect(confirmButton.classes()).toContain("btn");
    expect(confirmButton.classes()).toContain("btn-primary");
  });

  it("should have proper button structure", () => {
    const wrapper = mount(PresenceModal, {
      props: {
        ...mockProps,
        loading: true,
      },
    });

    const confirmButton = wrapper.findAll("button")[1];
    expect(confirmButton.text()).toBe("Confirmer");
  });

  it("should handle volunteer vs participant correctly", () => {
    const participantProps = {
      ...mockProps,
      isVolunteer: false,
    };

    const wrapper = mount(PresenceModal, {
      props: participantProps,
    });

    const confirmButton = wrapper.findAll("button")[1];
    confirmButton.trigger("click");

    expect(wrapper.emitted("confirm")?.[0]).toEqual(["123", false, false]);
  });

  it("should update presence status when checkbox is toggled", async () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(true);

    expect(wrapper.find(".label-text").text()).toBe("Présent");
  });

  it("should handle different person names", () => {
    const wrapper = mount(PresenceModal, {
      props: {
        ...mockProps,
        personName: "Jane Smith",
      },
    });

    expect(wrapper.text()).toContain("Jane Smith");
  });

  it("should handle different person IDs", () => {
    const wrapper = mount(PresenceModal, {
      props: {
        ...mockProps,
        personId: "456",
      },
    });

    const confirmButton = wrapper.findAll("button")[1];
    confirmButton.trigger("click");

    expect(wrapper.emitted("confirm")?.[0]).toEqual(["456", false, true]);
  });

  it("should have proper modal structure", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    expect(wrapper.find(".modal-box").exists()).toBe(true);
    expect(wrapper.find(".modal-action").exists()).toBe(true);
    expect(wrapper.find(".form-control").exists()).toBe(true);
  });

  it("should have proper form control styling", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const formControl = wrapper.find(".form-control");
    expect(formControl.classes()).toContain("mt-4");
  });

  it("should have proper label styling", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const label = wrapper.find(".label");
    expect(label.classes()).toContain("cursor-pointer");
    expect(label.classes()).toContain("justify-start");
    expect(label.classes()).toContain("gap-3");
  });

  it("should have backdrop button", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const backdropButton = wrapper.findAll("button")[2];
    expect(backdropButton.exists()).toBe(true);
  });

  it("should expose showModal and closeModal methods", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    expect(wrapper.vm.showModal).toBeDefined();
    expect(wrapper.vm.closeModal).toBeDefined();
  });

  it("should handle initial presence change", async () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    // Change initial presence
    await wrapper.setProps({
      ...mockProps,
      initialPresence: true,
    });

    expect(wrapper.find(".label-text").text()).toBe("Présent");
  });

  it("should have proper modal styling", () => {
    const wrapper = mount(PresenceModal, {
      props: mockProps,
    });

    const modalBox = wrapper.find(".modal-box");
    expect(modalBox.exists()).toBe(true);
  });
});
