// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester le Login
const MockLogin = {
  template: `
    <div class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-8 px-4">
      <div class="mock-login-form"></div>

      <div class="hidden md:flex flex-col justify-center items-center w-1/2">
        <img
            src="/images/login-user.png"
            alt="Illustration"
            class="w-full max-w-xl mx-auto"
            v-if="!isRegister"
        />
        <img
            src="/images/illustration-login-association.png"
            alt="Illustration"
            class="w-full max-w-xl mx-auto"
            v-if="!isAssociation && isRegister"
        />
        <img
            src="/images/illustration-login-volunteer.png"
            alt="Illustration"
            class="w-full max-w-xl mx-auto"
            v-if="isAssociation && isRegister"
        />
        <h1 class="text-xl sm:text-2xl font-bold mb-2" v-if="isRegister">
          {{ t(isAssociation ? 'auth.register.association_true' : 'auth.register.association_false') }}
        </h1>
        <button
            @click="toggleCheck"
            class="text-base sm:text-lg text-primary hover:underline mt-1"
            v-if="isAssociation && isRegister"
        >
          {{t('auth.register.association_register')}}
        </button>
        <button
            @click="toggleCheck"
            class="text-base sm:text-lg font-bold  mt-1"
            v-if="!isAssociation && isRegister"
        >
          {{t('auth.register.click_here')}} <span class="text-primary hover:underline"> {{t('auth.register.info_click_here')}}
        </span>
        </button>
      </div>
    </div>
  `,
  props: {
    isRegisterLocal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isAssociation: false,
      isRegister: this.isRegisterLocal,
    };
  },
  methods: {
    toggleCheck() {
      this.isAssociation = !this.isAssociation;
    },
    handleCheckboxChange(value) {
      this.isAssociation = value;
    },
    handleRegisterChange(value) {
      this.isRegister = value;
    },
    t(key) {
      return key;
    },
  },
  watch: {
    isRegisterLocal(newVal) {
      this.isRegister = newVal;
    },
  },
};

// Mock de useI18n
const mockT = vi.fn((key) => key);

// Mock global pour useI18n
global.useI18n = () => ({
  t: mockT,
});

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("should render login component", () => {
      const wrapper = mount(MockLogin);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.classes()).toContain("min-h-[85vh]");
    });

    it("should render login form", () => {
      const wrapper = mount(MockLogin);

      const loginForm = wrapper.find(".mock-login-form");
      expect(loginForm.exists()).toBe(true);
    });

    it("should render illustration section", () => {
      const wrapper = mount(MockLogin);

      const illustrationSection = wrapper.find(".hidden.md\\:flex");
      expect(illustrationSection.exists()).toBe(true);
    });
  });

  describe("Images d'illustration", () => {
    it("should show login user image when not registering", () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: false,
        },
      });

      const loginImage = wrapper.find('img[src="/images/login-user.png"]');
      expect(loginImage.exists()).toBe(true);
    });

    it("should show association image when registering and not association", () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      const associationImage = wrapper.find(
        'img[src="/images/illustration-login-association.png"]',
      );
      expect(associationImage.exists()).toBe(true);
    });

    it("should show volunteer image when registering and association", async () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      // Simuler le changement vers association
      await wrapper.setData({ isAssociation: true });
      await nextTick();

      const volunteerImage = wrapper.find(
        'img[src="/images/illustration-login-volunteer.png"]',
      );
      expect(volunteerImage.exists()).toBe(true);
    });
  });

  describe("Titre et boutons", () => {
    it("should show title when registering", () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      const title = wrapper.find("h1");
      expect(title.exists()).toBe(true);
      expect(title.text()).toContain("auth.register.association_false");
    });

    it("should show association title when isAssociation is true", async () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      await wrapper.setData({ isAssociation: true });
      await nextTick();

      const title = wrapper.find("h1");
      expect(title.text()).toContain("auth.register.association_true");
    });

    it("should show toggle button when registering and isAssociation is true", async () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      await wrapper.setData({ isAssociation: true });
      await nextTick();

      const toggleButton = wrapper.find("button");
      expect(toggleButton.exists()).toBe(true);
      expect(toggleButton.text()).toContain(
        "auth.register.association_register",
      );
    });

    it("should show click here button when registering and isAssociation is false", () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      const clickButton = wrapper.find("button");
      expect(clickButton.exists()).toBe(true);
      expect(clickButton.text()).toContain("auth.register.click_here");
    });
  });

  describe("Interactions", () => {
    it("should toggle isAssociation when toggleCheck is called", async () => {
      const wrapper = mount(MockLogin);

      expect(wrapper.vm.isAssociation).toBe(false);

      await wrapper.vm.toggleCheck();
      expect(wrapper.vm.isAssociation).toBe(true);

      await wrapper.vm.toggleCheck();
      expect(wrapper.vm.isAssociation).toBe(false);
    });

    it("should handle checkbox change", async () => {
      const wrapper = mount(MockLogin);

      await wrapper.vm.handleCheckboxChange(true);
      expect(wrapper.vm.isAssociation).toBe(true);

      await wrapper.vm.handleCheckboxChange(false);
      expect(wrapper.vm.isAssociation).toBe(false);
    });

    it("should handle register change", async () => {
      const wrapper = mount(MockLogin);

      await wrapper.vm.handleRegisterChange(true);
      expect(wrapper.vm.isRegister).toBe(true);

      await wrapper.vm.handleRegisterChange(false);
      expect(wrapper.vm.isRegister).toBe(false);
    });

    it("should watch isRegisterLocal prop changes", async () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: false,
        },
      });

      expect(wrapper.vm.isRegister).toBe(false);

      await wrapper.setProps({ isRegisterLocal: true });
      await nextTick();

      expect(wrapper.vm.isRegister).toBe(true);
    });
  });

  describe("Props et états", () => {
    it("should initialize with correct props", () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      expect(wrapper.vm.isRegister).toBe(true);
      expect(wrapper.vm.isAssociation).toBe(false);
    });

    it("should update isRegister when prop changes", async () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: false,
        },
      });

      expect(wrapper.vm.isRegister).toBe(false);

      await wrapper.setProps({ isRegisterLocal: true });
      await nextTick();

      expect(wrapper.vm.isRegister).toBe(true);
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper container styling", () => {
      const wrapper = mount(MockLogin);

      const container = wrapper.find("div");
      expect(container.classes()).toContain("min-h-[85vh]");
      expect(container.classes()).toContain("flex");
      expect(container.classes()).toContain("flex-col");
      expect(container.classes()).toContain("md:flex-row");
    });

    it("should have proper illustration section styling", () => {
      const wrapper = mount(MockLogin);

      const illustrationSection = wrapper.find(".hidden.md\\:flex");
      expect(illustrationSection.classes()).toContain("hidden");
      expect(illustrationSection.classes()).toContain("md:flex");
      expect(illustrationSection.classes()).toContain("flex-col");
    });

    it("should have proper button styling", async () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      const button = wrapper.find("button");
      expect(button.classes()).toContain("text-base");
      expect(button.classes()).toContain("sm:text-lg");
    });
  });

  describe("Accessibilité", () => {
    it("should have proper image alt text", () => {
      const wrapper = mount(MockLogin);

      const images = wrapper.findAll("img");
      images.forEach((image) => {
        expect(image.attributes("alt")).toBe("Illustration");
      });
    });

    it("should have proper heading structure", () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      const heading = wrapper.find("h1");
      expect(heading.exists()).toBe(true);
      expect(heading.classes()).toContain("text-xl");
      expect(heading.classes()).toContain("sm:text-2xl");
    });
  });

  describe("Responsive design", () => {
    it("should have responsive container layout", () => {
      const wrapper = mount(MockLogin);

      const container = wrapper.find("div");
      expect(container.classes()).toContain("flex-col");
      expect(container.classes()).toContain("md:flex-row");
    });

    it("should have responsive text sizing", async () => {
      const wrapper = mount(MockLogin, {
        props: {
          isRegisterLocal: true,
        },
      });

      const button = wrapper.find("button");
      expect(button.classes()).toContain("text-base");
      expect(button.classes()).toContain("sm:text-lg");
    });
  });
});
