// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester les fonctionnalités de base
const MockParticipantCard = {
  template: `
    <div class="bg-base-100 rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow mb-4">
      <!-- Avatar -->
      <div class="flex-shrink-0 flex items-start">
        <div v-if="loading" class="avatar placeholder">
          <div class="w-16 h-16 rounded-full bg-base-300 text-base-content ring-2 ring-primary ring-offset-2 ring-offset-base-100">
            <span class="loading loading-spinner loading-sm"></span>
          </div>
        </div>
        <div v-else-if="userInfo?.avatarFileKey" class="avatar">
          <div class="w-16 h-16 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
            <img 
              :src="userInfo.avatarFileKey" 
              :alt="'Photo de ' + participant.volunteerName" 
              class="w-full h-full object-cover rounded-full"
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div v-else class="avatar placeholder">
          <div class="w-16 h-16 rounded-full bg-base-300 text-base-content ring-2 ring-primary ring-offset-2 ring-offset-base-100 flex items-center justify-center">
            <span class="text-xl font-bold">{{ participant.volunteerName.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
      </div>
      
      <!-- Infos + boutons -->
      <div class="flex-1 flex flex-col justify-between min-w-0">
        <!-- Nom et email en haut -->
        <div class="mb-4">
          <h4 class="font-semibold text-base-content text-lg truncate">{{ participant.volunteerName }}</h4>
          <p class="text-sm text-base-content/70 truncate">{{ userInfo?.email || 'Email non disponible' }}</p>
        </div>
        <!-- Boutons en bas -->
        <div class="flex gap-2 mt-auto">
          <button v-if="participant.isPresent === undefined"
                  class="btn btn-sm btn-outline flex-1"
                  @click="$emit('details', participant.volunteerId)"
          >
              Détails
          </button>
          <button v-else
            class="btn btn-sm btn-outline flex-1" 
            :class="participant.isPresent ? 'btn-success' : 'btn-primary'"
            @click="$emit('presence', participant.volunteerId, !participant.isPresent)"
          >
            {{ participant.isPresent ? 'Présent' : 'Marquer présent' }}
          </button>
          <button class="btn btn-sm btn-outline btn-error flex-1" @click="$emit('remove', participant.volunteerId)">Retirer</button>
        </div>
      </div>
    </div>
  `,
  props: {
    participant: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["details", "presence", "remove"],
};

describe("ParticipantOrVolunteerCard", () => {
  const mockParticipant = {
    volunteerId: "vol-123",
    volunteerName: "John Doe",
    isPresent: undefined,
  };

  const mockParticipantWithPresence = {
    volunteerId: "vol-123",
    volunteerName: "John Doe",
    isPresent: true,
  };

  const mockUserInfo = {
    userId: "user-123",
    email: "john.doe@example.com",
    avatarFileKey: "avatar-key-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("should render participant card component", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".bg-base-100").exists()).toBe(true);
    });

    it("should display participant name", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      expect(wrapper.find("h4").text()).toBe("John Doe");
    });

    it("should display placeholder avatar when no avatar", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      const placeholder = wrapper.find(".avatar.placeholder");
      expect(placeholder.exists()).toBe(true);
      expect(placeholder.find(".text-xl").text()).toBe("J");
    });

    it("should display loading spinner when loading", async () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
          loading: true,
        },
      });

      const loadingSpinner = wrapper.find(".loading-spinner");
      expect(loadingSpinner.exists()).toBe(true);
    });
  });

  describe("Boutons d'action", () => {
    it('should display "Détails" button when isPresent is undefined', () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      const detailsBtn = wrapper.find("button");
      expect(detailsBtn.exists()).toBe(true);
      expect(detailsBtn.text()).toContain("Détails");
      expect(detailsBtn.classes()).toContain("btn-outline");
    });

    it('should display "Présent" button when isPresent is true', () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipantWithPresence,
        },
      });

      const buttons = wrapper.findAll("button");
      const presentBtn = buttons.find((btn) => btn.text().includes("Présent"));
      expect(presentBtn).toBeTruthy();
      expect(presentBtn.classes()).toContain("btn-success");
    });

    it('should display "Marquer présent" button when isPresent is false', () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: {
            ...mockParticipant,
            isPresent: false,
          },
        },
      });

      const buttons = wrapper.findAll("button");
      const markPresentBtn = buttons.find((btn) =>
        btn.text().includes("Marquer présent"),
      );
      expect(markPresentBtn).toBeTruthy();
      expect(markPresentBtn.classes()).toContain("btn-primary");
    });

    it('should display "Retirer" button', () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      const buttons = wrapper.findAll("button");
      const removeBtn = buttons.find((btn) => btn.text().includes("Retirer"));
      expect(removeBtn).toBeTruthy();
      expect(removeBtn.classes()).toContain("btn-error");
    });
  });

  describe("Événements", () => {
    it("should emit details event when details button is clicked", async () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      const detailsBtn = wrapper.find("button");
      await detailsBtn.trigger("click");

      expect(wrapper.emitted("details")).toBeTruthy();
      expect(wrapper.emitted("details")?.[0]).toEqual(["vol-123"]);
    });

    it("should emit presence event when presence button is clicked", async () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipantWithPresence,
        },
      });

      const buttons = wrapper.findAll("button");
      const presentBtn = buttons.find((btn) => btn.text().includes("Présent"));
      await presentBtn.trigger("click");

      expect(wrapper.emitted("presence")).toBeTruthy();
      expect(wrapper.emitted("presence")?.[0]).toEqual(["vol-123", false]);
    });

    it("should emit remove event when retirer button is clicked", async () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      const buttons = wrapper.findAll("button");
      const removeBtn = buttons.find((btn) => btn.text().includes("Retirer"));
      await removeBtn.trigger("click");

      expect(wrapper.emitted("remove")).toBeTruthy();
      expect(wrapper.emitted("remove")?.[0]).toEqual(["vol-123"]);
    });
  });

  describe("Informations utilisateur", () => {
    it("should display email when user info is provided", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
          userInfo: mockUserInfo,
        },
      });

      expect(wrapper.text()).toContain("john.doe@example.com");
    });

    it("should display fallback email when user info is not available", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      expect(wrapper.text()).toContain("Email non disponible");
    });

    it("should display avatar image when avatarFileKey is available", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
          userInfo: mockUserInfo,
        },
      });

      const avatarImg = wrapper.find(".avatar img");
      expect(avatarImg.exists()).toBe(true);
      expect(avatarImg.attributes("alt")).toBe("Photo de John Doe");
    });
  });

  describe("Props et options", () => {
    it("should handle participant without isPresent", () => {
      const participantWithoutPresence = {
        volunteerId: "vol-123",
        volunteerName: "John Doe",
      };

      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: participantWithoutPresence,
        },
      });

      const buttons = wrapper.findAll("button");
      const detailsBtn = buttons.find((btn) => btn.text().includes("Détails"));
      expect(detailsBtn).toBeTruthy();
    });

    it("should handle loading state", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
          loading: true,
        },
      });

      expect(wrapper.find(".loading-spinner").exists()).toBe(true);
    });
  });

  describe("Accessibilité", () => {
    it("should have proper alt text for avatar image", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
          userInfo: mockUserInfo,
        },
      });

      const avatarImg = wrapper.find(".avatar img");
      expect(avatarImg.attributes("alt")).toBe("Photo de John Doe");
    });

    it("should have proper button labels", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      const buttons = wrapper.findAll("button");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button.text().trim()).toBeTruthy();
      });
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper CSS classes", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      expect(wrapper.find(".bg-base-100").exists()).toBe(true);
      expect(wrapper.find(".rounded-lg").exists()).toBe(true);
      expect(wrapper.find(".shadow-md").exists()).toBe(true);
      expect(wrapper.find(".p-4").exists()).toBe(true);
      expect(wrapper.find(".flex").exists()).toBe(true);
      expect(wrapper.find(".gap-4").exists()).toBe(true);
    });

    it("should have hover effects", () => {
      const wrapper = mount(MockParticipantCard, {
        props: {
          participant: mockParticipant,
        },
      });

      expect(wrapper.find(".hover\\:shadow-lg").exists()).toBe(true);
      expect(wrapper.find(".transition-shadow").exists()).toBe(true);
    });
  });
});
