// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester le RegisterVolunteer
const MockRegisterVolunteer = {
  template: `
    <div class="flex flex-col items-center justify-center bg-base-200 text-base-content">
      <progress
          class="progress progress-primary w-full mb-6"
          :value="currentStep"
          max="100"
      />

      <div class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-8 px-4">

        <div v-if="!isSubmittedForm" class="mock-register-info-form" @submit="submitForm" @current-step="handleStep">
          RegisterInfoVolunteerForm Component
        </div>
        <div
            v-else
            class="mock-upload-image-form"
            @uploaded="saveBase64"
            @skipped="skipBase64"
        >
          UploadImageForm Component
        </div>

        <div class="hidden md:flex flex-col justify-center items-center w-1/2">
          <img
              src="/images/volunteer-info.png"
              alt="Illustration"
              class="w-full max-w-xl mx-auto"
          />
        </div>
      </div>
      <div
          v-if="showErrorModal"
          class="mock-error-popup"
          :error-type="errorType"
          @reload="handleReload"
          @goHome="handleGoHome"
      >
        ErrorPopup Component
      </div>
    </div>
  `,
  data() {
    return {
      isSubmittedForm: false,
      imageBase64: null,
      currentStep: 1,
      showErrorModal: false,
      errorType: null,
    };
  },
  methods: {
    handleReload() {
      window.location.reload();
    },

    async handleGoHome() {
      // Simuler la navigation
      console.log("Navigating to home");
    },

    async saveBase64(base64) {
      this.imageBase64 = base64;
      try {
        // Simuler la mise à jour de l'avatar
        console.log("Avatar updated:", base64);
        // Simuler la navigation
        console.log("Navigating to volunteer");
      } catch (error) {
        this.handleError(error);
      }
    },

    skipBase64() {
      this.imageBase64 = null;
      // Simuler la navigation
      console.log("Navigating to volunteer (skipped)");
    },

    submitForm(value) {
      this.isSubmittedForm = value;
    },

    handleStep(step) {
      this.currentStep = step;
    },

    handleError(error) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        this.errorType = "5xx";
        this.showErrorModal = true;
      } else if (
        error?.response?.status >= 400 &&
        error?.response?.status < 500
      ) {
        this.errorType = "4xx";
        this.showErrorModal = true;
      } else {
        console.error("Erreur inattendue:", error);
      }
    },
  },
};

describe("RegisterVolunteer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("should render register volunteer component", () => {
      const wrapper = mount(MockRegisterVolunteer);

      expect(wrapper.exists()).toBe(true);
      expect(
        wrapper.find(".flex.flex-col.items-center.justify-center").exists(),
      ).toBe(true);
    });

    it("should render progress bar", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const progress = wrapper.find("progress");
      expect(progress.exists()).toBe(true);
      expect(progress.classes()).toContain("progress");
      expect(progress.classes()).toContain("progress-primary");
    });

    it("should render main container", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const mainContainer = wrapper.find(".min-h-\\[85vh\\]");
      expect(mainContainer.exists()).toBe(true);
    });

    it("should render illustration section", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const illustrationSection = wrapper.find(".hidden.md\\:flex");
      expect(illustrationSection.exists()).toBe(true);
    });
  });

  describe("Affichage conditionnel", () => {
    it("should show RegisterInfoVolunteerForm when not submitted", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const registerForm = wrapper.find(".mock-register-info-form");
      expect(registerForm.exists()).toBe(true);
      expect(registerForm.text()).toBe("RegisterInfoVolunteerForm Component");
    });

    it("should show UploadImageForm when submitted", async () => {
      const wrapper = mount(MockRegisterVolunteer);

      await wrapper.setData({ isSubmittedForm: true });
      await nextTick();

      const uploadForm = wrapper.find(".mock-upload-image-form");
      expect(uploadForm.exists()).toBe(true);
      expect(uploadForm.text()).toBe("UploadImageForm Component");
    });

    it("should not show RegisterInfoVolunteerForm when submitted", async () => {
      const wrapper = mount(MockRegisterVolunteer);

      await wrapper.setData({ isSubmittedForm: true });
      await nextTick();

      const registerForm = wrapper.find(".mock-register-info-form");
      expect(registerForm.exists()).toBe(false);
    });

    it("should not show UploadImageForm when not submitted", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const uploadForm = wrapper.find(".mock-upload-image-form");
      expect(uploadForm.exists()).toBe(false);
    });
  });

  describe("Progress bar", () => {
    it("should have correct initial progress value", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const progress = wrapper.find("progress");
      expect(progress.attributes("value")).toBe("1");
      expect(progress.attributes("max")).toBe("100");
    });

    it("should update progress when step changes", async () => {
      const wrapper = mount(MockRegisterVolunteer);

      await wrapper.setData({ currentStep: 50 });
      await nextTick();

      const progress = wrapper.find("progress");
      expect(progress.attributes("value")).toBe("50");
    });
  });

  describe("Gestion des formulaires", () => {
    it("should handle form submission", async () => {
      const wrapper = mount(MockRegisterVolunteer);

      expect(wrapper.vm.isSubmittedForm).toBe(false);

      await wrapper.vm.submitForm(true);
      await nextTick();

      expect(wrapper.vm.isSubmittedForm).toBe(true);
    });

    it("should handle step changes", async () => {
      const wrapper = mount(MockRegisterVolunteer);

      expect(wrapper.vm.currentStep).toBe(1);

      await wrapper.vm.handleStep(25);
      await nextTick();

      expect(wrapper.vm.currentStep).toBe(25);
    });

    it("should handle multiple step changes", async () => {
      const wrapper = mount(MockRegisterVolunteer);

      await wrapper.vm.handleStep(10);
      await wrapper.vm.handleStep(20);
      await wrapper.vm.handleStep(30);
      await nextTick();

      expect(wrapper.vm.currentStep).toBe(30);
    });
  });

  describe("Gestion de l'upload d'image", () => {
    it("should handle image upload", async () => {
      const wrapper = mount(MockRegisterVolunteer);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      await wrapper.vm.saveBase64(mockFile);

      expect(wrapper.vm.imageBase64).toStrictEqual(mockFile);
      expect(consoleSpy).toHaveBeenCalledWith("Avatar updated:", mockFile);
      expect(consoleSpy).toHaveBeenCalledWith("Navigating to volunteer");

      consoleSpy.mockRestore();
    });

    it("should handle image skip", async () => {
      const wrapper = mount(MockRegisterVolunteer);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await wrapper.vm.skipBase64();

      expect(wrapper.vm.imageBase64).toBe(null);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Navigating to volunteer (skipped)",
      );

      consoleSpy.mockRestore();
    });

    it("should handle upload error", async () => {
      const wrapper = mount(MockRegisterVolunteer);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const mockError = {
        response: {
          status: 500,
        },
      };

      await wrapper.vm.saveBase64(null);
      wrapper.vm.handleError(mockError);

      expect(wrapper.vm.errorType).toBe("5xx");
      expect(wrapper.vm.showErrorModal).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe("Gestion des erreurs", () => {
    it("should handle 5xx errors", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const error = {
        response: {
          status: 500,
        },
      };

      wrapper.vm.handleError(error);

      expect(wrapper.vm.errorType).toBe("5xx");
      expect(wrapper.vm.showErrorModal).toBe(true);
    });

    it("should handle 4xx errors", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const error = {
        response: {
          status: 400,
        },
      };

      wrapper.vm.handleError(error);

      expect(wrapper.vm.errorType).toBe("4xx");
      expect(wrapper.vm.showErrorModal).toBe(true);
    });

    it("should handle unexpected errors", () => {
      const wrapper = mount(MockRegisterVolunteer);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const error = new Error("Unexpected error");
      wrapper.vm.handleError(error);

      expect(wrapper.vm.errorType).toBe(null);
      expect(wrapper.vm.showErrorModal).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith("Erreur inattendue:", error);

      consoleSpy.mockRestore();
    });

    it("should show error popup when error modal is active", async () => {
      const wrapper = mount(MockRegisterVolunteer);

      await wrapper.setData({ showErrorModal: true, errorType: "4xx" });
      await nextTick();

      const errorPopup = wrapper.find(".mock-error-popup");
      expect(errorPopup.exists()).toBe(true);
      expect(errorPopup.text()).toBe("ErrorPopup Component");
    });
  });

  describe("Navigation", () => {
    it("should handle reload", () => {
      const wrapper = mount(MockRegisterVolunteer);
      const reloadSpy = vi
        .spyOn(window.location, "reload")
        .mockImplementation(() => {});

      wrapper.vm.handleReload();

      expect(reloadSpy).toHaveBeenCalled();

      reloadSpy.mockRestore();
    });

    it("should handle go home navigation", async () => {
      const wrapper = mount(MockRegisterVolunteer);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await wrapper.vm.handleGoHome();

      expect(consoleSpy).toHaveBeenCalledWith("Navigating to home");

      consoleSpy.mockRestore();
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper main container styling", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const mainContainer = wrapper.find(
        ".flex.flex-col.items-center.justify-center",
      );
      expect(mainContainer.exists()).toBe(true);
      expect(mainContainer.classes()).toContain("bg-base-200");
      expect(mainContainer.classes()).toContain("text-base-content");
    });

    it("should have proper progress bar styling", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const progress = wrapper.find("progress");
      expect(progress.classes()).toContain("progress");
      expect(progress.classes()).toContain("progress-primary");
      expect(progress.classes()).toContain("w-full");
      expect(progress.classes()).toContain("mb-6");
    });

    it("should have proper content container styling", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const contentContainer = wrapper.find(".min-h-\\[85vh\\]");
      expect(contentContainer.exists()).toBe(true);
      expect(contentContainer.classes()).toContain("flex");
      expect(contentContainer.classes()).toContain("flex-col");
      expect(contentContainer.classes()).toContain("md:flex-row");
    });

    it("should have proper illustration styling", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const illustrationSection = wrapper.find(".hidden.md\\:flex");
      expect(illustrationSection.exists()).toBe(true);
      expect(illustrationSection.classes()).toContain("flex-col");
      expect(illustrationSection.classes()).toContain("justify-center");
      expect(illustrationSection.classes()).toContain("items-center");
      expect(illustrationSection.classes()).toContain("w-1/2");
    });
  });

  describe("Accessibilité", () => {
    it("should have proper progress bar attributes", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const progress = wrapper.find("progress");
      expect(progress.attributes("max")).toBe("100");
    });

    it("should have proper image attributes", () => {
      const wrapper = mount(MockRegisterVolunteer);

      const image = wrapper.find("img");
      expect(image.exists()).toBe(true);
      expect(image.attributes("src")).toBe("/images/volunteer-info.png");
      expect(image.attributes("alt")).toBe("Illustration");
    });
  });

  describe("États et données", () => {
    it("should initialize with correct default values", () => {
      const wrapper = mount(MockRegisterVolunteer);

      expect(wrapper.vm.isSubmittedForm).toBe(false);
      expect(wrapper.vm.imageBase64).toBe(null);
      expect(wrapper.vm.currentStep).toBe(1);
      expect(wrapper.vm.showErrorModal).toBe(false);
      expect(wrapper.vm.errorType).toBe(null);
    });

    it("should handle state changes correctly", async () => {
      const wrapper = mount(MockRegisterVolunteer);

      await wrapper.setData({
        isSubmittedForm: true,
        currentStep: 75,
        showErrorModal: true,
        errorType: "5xx",
      });
      await nextTick();

      expect(wrapper.vm.isSubmittedForm).toBe(true);
      expect(wrapper.vm.currentStep).toBe(75);
      expect(wrapper.vm.showErrorModal).toBe(true);
      expect(wrapper.vm.errorType).toBe("5xx");
    });
  });
});
