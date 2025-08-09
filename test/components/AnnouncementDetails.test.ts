import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AnnouncementDetails from "../../components/event/association/AnnouncementDetails.vue";
import { EventStatus } from "../../common/enums/event.enum";

describe("AnnouncementDetails", () => {
  const mockAnnouncement = {
    _id: "1",
    nameEvent: "Test Event",
    description: "This is a test event description",
    dateEvent: "2024-12-25",
    hoursEvent: "14:30",
    status: EventStatus.ACTIVE,
    tags: ["Tag1", "Tag2", "Tag3"],
    addressAnnouncement: {
      city: "Paris",
      street: "123 Test Street",
      postalCode: "75001",
      address: "123 Test Street, Paris, 75001",
      country: "France",
    },
    datePublication: "2024-12-20",
    associationId: "assoc1",
    associationName: "Test Association",
    maxParticipants: 50,
    maxVolunteers: 10,
  };

  it("should render announcement details component", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".space-y-4").exists()).toBe(true);
  });

  it("should display announcement title", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    expect(wrapper.find("h1").text()).toBe("Test Event");
    expect(wrapper.find("h1").classes()).toContain("text-2xl");
    expect(wrapper.find("h1").classes()).toContain("font-bold");
  });

  it("should display edit button", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    const editButton = wrapper.find("button");
    expect(editButton.exists()).toBe(true);
    expect(editButton.text()).toBe("Modifier");
    expect(editButton.classes()).toContain("btn");
    expect(editButton.classes()).toContain("btn-primary");
  });

  it("should emit edit event when edit button is clicked", async () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("edit")).toBeTruthy();
  });

  it("should display date and time", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    const dateTimeText = wrapper.find(".text-gray-500").text();
    expect(dateTimeText).toBe("2024-12-25 à 14:30");
  });

  it("should display description", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    expect(wrapper.find(".text-base-content").text()).toBe(
      "This is a test event description",
    );
  });

  it("should display tags", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    const tags = wrapper.findAll(".badge");
    expect(tags).toHaveLength(3);
    expect(tags[0].text()).toBe("Tag1");
    expect(tags[1].text()).toBe("Tag2");
    expect(tags[2].text()).toBe("Tag3");
  });

  it("should have proper tag styling", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    const tags = wrapper.findAll(".badge");
    tags.forEach((tag) => {
      expect(tag.classes()).toContain("badge-outline");
      expect(tag.classes()).toContain("text-base-content");
      expect(tag.classes()).toContain("border-base-content");
    });
  });

  it("should display location", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    expect(wrapper.text()).toContain("Lieu :");
    expect(wrapper.text()).toContain("Paris");
  });

  it("should display status", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    expect(wrapper.text()).toContain("Statut :");
    expect(wrapper.text()).toContain("ACTIVE");
  });

  it("should display empty state when no announcement", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: null,
      },
    });

    expect(wrapper.find(".text-center").exists()).toBe(true);
    expect(wrapper.find(".text-gray-400").exists()).toBe(true);
    expect(wrapper.text()).toContain("Aucune annonce sélectionnée.");
  });

  it("should handle announcement without tags", () => {
    const announcementWithoutTags = {
      ...mockAnnouncement,
      tags: [],
    };

    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: announcementWithoutTags,
      },
    });

    const tags = wrapper.findAll(".badge");
    expect(tags).toHaveLength(0);
  });

  it("should handle announcement without address", () => {
    const announcementWithoutAddress = {
      ...mockAnnouncement,
      addressAnnouncement: undefined,
    };

    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: announcementWithoutAddress,
      },
    });

    expect(wrapper.text()).toContain("Lieu :");
    // Quand addressAnnouncement est null, la ville n'est pas affichée
  });

  it("should handle announcement with empty description", () => {
    const announcementWithEmptyDescription = {
      ...mockAnnouncement,
      description: "",
    };

    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: announcementWithEmptyDescription,
      },
    });

    expect(wrapper.find(".text-base-content").text()).toBe("");
  });

  it("should have proper layout structure", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    expect(wrapper.find(".flex.justify-between.items-center").exists()).toBe(
      true,
    );
    expect(wrapper.find(".flex.flex-wrap.gap-2.mt-2").exists()).toBe(true);
  });

  it("should have proper tag accessibility", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    const tags = wrapper.findAll(".badge");
    tags.forEach((tag, index) => {
      expect(tag.attributes("aria-label")).toBe(
        `Tag: ${mockAnnouncement.tags[index]}`,
      );
    });
  });

  it("should handle different announcement statuses", () => {
    const differentStatuses = ["ACTIVE", "INACTIVE", "COMPLETED"];

    differentStatuses.forEach((status) => {
      const announcementWithStatus = {
        ...mockAnnouncement,
        status: status as EventStatus,
      };

      const wrapper = mount(AnnouncementDetails, {
        props: {
          announcement: announcementWithStatus,
        },
      });

      expect(wrapper.text()).toContain(`Statut : ${status}`);
    });
  });

  it("should handle announcement with many tags", () => {
    const announcementWithManyTags = {
      ...mockAnnouncement,
      tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
    };

    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: announcementWithManyTags,
      },
    });

    const tags = wrapper.findAll(".badge");
    expect(tags).toHaveLength(6);
  });

  it("should maintain proper spacing", () => {
    const wrapper = mount(AnnouncementDetails, {
      props: {
        announcement: mockAnnouncement,
      },
    });

    expect(wrapper.find(".space-y-4").exists()).toBe(true);
  });
});
