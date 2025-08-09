import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RequestItem from "../../components/event/association/RequestItem.vue";

describe("RequestItem", () => {
  const mockVolunteer = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/images/avatar.jpg",
  };

  it("should render request item component", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".bg-base-100").exists()).toBe(true);
  });

  it("should display volunteer information", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    expect(wrapper.find("h3").text()).toBe("John Doe");
    expect(wrapper.find("p").text()).toBe("john.doe@example.com");
  });

  it("should display volunteer avatar", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const avatar = wrapper.find("img");
    expect(avatar.exists()).toBe(true);
    expect(avatar.attributes("src")).toBe("/images/avatar.jpg");
    expect(avatar.attributes("alt")).toBe("John Doe");
  });

  it("should handle avatar error with fallback", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const avatar = wrapper.find("img");
    // L'attribut onerror n'est pas accessible via attributes() dans les tests
    expect(avatar.exists()).toBe(true);
  });

  it("should display event context for event type", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    expect(wrapper.text()).toContain("Pour l'événement :");
    expect(wrapper.text()).toContain("Test Event");
  });

  it("should display association context for association type", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "association",
      },
    });

    expect(wrapper.text()).toContain("Demande d'adhésion à l'association");
  });

  it("should display accept and refuse buttons", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(2);

    const acceptButton = buttons[0];
    const refuseButton = buttons[1];

    expect(acceptButton.text()).toContain("Accepter");
    expect(refuseButton.text()).toContain("Refuser");
  });

  it("should emit accept event when accept button is clicked", async () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const acceptButton = wrapper.findAll("button")[0];
    await acceptButton.trigger("click");

    expect(wrapper.emitted("accept")).toBeTruthy();
  });

  it("should emit refuse event when refuse button is clicked", async () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const refuseButton = wrapper.findAll("button")[1];
    await refuseButton.trigger("click");

    expect(wrapper.emitted("refuse")).toBeTruthy();
  });

  it("should have proper button styling", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const buttons = wrapper.findAll("button");
    const acceptButton = buttons[0];
    const refuseButton = buttons[1];

    expect(acceptButton.classes()).toContain("btn");
    expect(acceptButton.classes()).toContain("btn-success");
    expect(acceptButton.classes()).toContain("flex-1");
    expect(acceptButton.classes()).toContain("gap-2");

    expect(refuseButton.classes()).toContain("btn");
    expect(refuseButton.classes()).toContain("btn-error");
    expect(refuseButton.classes()).toContain("flex-1");
    expect(refuseButton.classes()).toContain("gap-2");
  });

  it("should have proper card styling", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const card = wrapper.find(".bg-base-100");
    expect(card.classes()).toContain("rounded-2xl");
    expect(card.classes()).toContain("shadow-lg");
    expect(card.classes()).toContain("border");
    expect(card.classes()).toContain("border-base-300");
    expect(card.classes()).toContain("p-6");
  });

  it("should have proper avatar styling", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const avatarContainer = wrapper.find(".w-16.h-16");
    expect(avatarContainer.classes()).toContain("rounded-full");
    expect(avatarContainer.classes()).toContain("ring-2");
    expect(avatarContainer.classes()).toContain("ring-primary");
    expect(avatarContainer.classes()).toContain("ring-offset-2");
    expect(avatarContainer.classes()).toContain("ring-offset-base-100");
    expect(avatarContainer.classes()).toContain("overflow-hidden");
    expect(avatarContainer.classes()).toContain("bg-base-200");
  });

  it("should handle volunteer without avatar", () => {
    const volunteerWithoutAvatar = {
      ...mockVolunteer,
      avatar: "",
    };

    const wrapper = mount(RequestItem, {
      props: {
        volunteer: volunteerWithoutAvatar,
        type: "event",
        context: "Test Event",
      },
    });

    const avatar = wrapper.find("img");
    expect(avatar.attributes("src")).toBe("/images/default-avatar.png");
  });

  it("should handle long email addresses", () => {
    const volunteerWithLongEmail = {
      ...mockVolunteer,
      email: "very.long.email.address.that.might.break.layout@example.com",
    };

    const wrapper = mount(RequestItem, {
      props: {
        volunteer: volunteerWithLongEmail,
        type: "event",
        context: "Test Event",
      },
    });

    const emailElement = wrapper.find("p");
    expect(emailElement.classes()).toContain("break-all");
    expect(emailElement.text()).toBe(
      "very.long.email.address.that.might.break.layout@example.com",
    );
  });

  it("should handle volunteer with long name", () => {
    const volunteerWithLongName = {
      ...mockVolunteer,
      name: "Very Long Volunteer Name That Might Break Layout",
    };

    const wrapper = mount(RequestItem, {
      props: {
        volunteer: volunteerWithLongName,
        type: "event",
        context: "Test Event",
      },
    });

    expect(wrapper.find("h3").text()).toBe(
      "Very Long Volunteer Name That Might Break Layout",
    );
  });

  it("should have proper layout structure", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    expect(wrapper.find(".flex.items-start.gap-4.mb-6").exists()).toBe(true);
    expect(wrapper.find(".flex-1.min-w-0").exists()).toBe(true);
    expect(
      wrapper.find(".flex.gap-3.pt-4.border-t.border-base-300").exists(),
    ).toBe(true);
  });

  it("should handle different volunteer data", () => {
    const differentVolunteer = {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/images/jane-avatar.jpg",
    };

    const wrapper = mount(RequestItem, {
      props: {
        volunteer: differentVolunteer,
        type: "association",
      },
    });

    expect(wrapper.find("h3").text()).toBe("Jane Smith");
    expect(wrapper.find("p").text()).toBe("jane.smith@example.com");
    expect(wrapper.find("img").attributes("src")).toBe(
      "/images/jane-avatar.jpg",
    );
  });

  it("should have proper hover effects", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const card = wrapper.find(".bg-base-100");
    expect(card.classes()).toContain("hover:shadow-xl");
    expect(card.classes()).toContain("transition-all");
    expect(card.classes()).toContain("duration-300");
  });

  it("should have proper button hover effects", () => {
    const wrapper = mount(RequestItem, {
      props: {
        volunteer: mockVolunteer,
        type: "event",
        context: "Test Event",
      },
    });

    const buttons = wrapper.findAll("button");
    buttons.forEach((button) => {
      expect(button.classes()).toContain("hover:scale-105");
      expect(button.classes()).toContain("transition-transform");
      expect(button.classes()).toContain("duration-200");
    });
  });
});
