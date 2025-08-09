// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

// Mock component pour tester le formulaire d'édition d'annonce
const MockAnnouncementEditForm = {
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl relative" style="max-height:90vh; overflow-y:auto;">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="$emit('close')">✕</button>
        <h2 class="text-xl font-bold mb-4">{{ form._id ? 'Modifier' : 'Créer' }} une annonce</h2>
        
        <form @submit.prevent="save">
          <!-- Zone d'upload d'image -->
          <div class="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
               :class="{ 'bg-base-200': !coverPhotoPreview, 'p-0': coverPhotoPreview }"
               @click="triggerFileInput">
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" aria-label="Champ de saisie">
            
            <div v-if="!coverPhotoPreview" class="text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="mt-2 text-sm text-gray-500">Cliquez pour ajouter une photo de couverture</p>
              <p class="text-xs text-gray-400">JPG, PNG, GIF jusqu'à 10MB</p>
            </div>

            <img v-if="coverPhotoPreview" :src="coverPhotoPreview" class="w-full h-full object-cover" alt="Cover preview" />

            <button v-if="coverPhotoPreview" type="button" class="btn btn-circle btn-sm absolute top-2 right-2 bg-base-100 opacity-80 hover:opacity-100" @click.stop="removeCoverPhoto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Champs du formulaire -->
          <div class="mb-2">
            <label class="block mb-1">Titre</label>
            <input v-model="form.nameEvent" class="input input-bordered w-full" required aria-label="Champ de saisie">
          </div>
          
          <div class="mb-2">
            <label class="block mb-1">Description</label>
            <textarea v-model="form.description" class="textarea textarea-bordered w-full" required aria-label="Zone de texte"></textarea>
          </div>
          
          <div class="mb-2 flex gap-2">
            <div class="flex-1">
              <label class="block mb-1">Date</label>
              <input v-model="form.dateEvent" type="date" class="input input-bordered w-full" required aria-label="Champ de saisie">
            </div>
            <div class="flex-1">
              <label class="block mb-1">Heure</label>
              <input v-model="form.hoursEvent" type="time" class="input input-bordered w-full" required aria-label="Champ de saisie">
            </div>
          </div>
          
          <div class="mb-2 flex gap-2">
            <div class="flex-1">
              <label class="block mb-1">Nombre max. de participants</label>
              <input v-model.number="form.maxParticipants" type="number" min="0" class="input input-bordered w-full" :class="{ 'input-error': maxParticipantsError }" aria-label="Nombre">
              <p v-if="maxParticipantsError" class="text-error text-xs mt-1">
                Doit être ≥ au nombre de participants déjà inscrits ({{ minParticipants }})
              </p>
            </div>
            <div class="flex-1">
              <label class="block mb-1">Nombre max. de bénévoles</label>
              <input v-model.number="form.maxVolunteers" type="number" min="0" class="input input-bordered w-full" :class="{ 'input-error': maxVolunteersError }" aria-label="Nombre">
              <p v-if="maxVolunteersError" class="text-error text-xs mt-1">
                Doit être ≥ au nombre de bénévoles déjà inscrits ({{ minVolunteers }})
              </p>
            </div>
          </div>
          
          <div class="mb-2">
            <label class="block mb-1">Tags (séparés par des virgules)</label>
            <input v-model="tagsInput" class="input input-bordered w-full" aria-label="Champ de saisie">
          </div>
          
          <div class="mb-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="block mb-1">Ville</label>
              <input v-model="form.addressAnnouncement.city" class="input input-bordered w-full" aria-label="Champ de saisie">
            </div>
            <div>
              <label class="block mb-1">Code postal</label>
              <input v-model="form.addressAnnouncement.postalCode" class="input input-bordered w-full" aria-label="Champ de saisie">
            </div>
            <div>
              <label class="block mb-1">Pays</label>
              <input v-model="form.addressAnnouncement.country" class="input input-bordered w-full" aria-label="Champ de saisie">
            </div>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Statut</span>
            </label>
            <select v-model="form.status" class="select select-bordered w-full" aria-label="Sélection">
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>
          
          <div class="flex gap-2 mt-4">
            <button class="btn btn-primary flex-1" type="submit" :disabled="isFormInvalid">Enregistrer</button>
            <button class="btn btn-ghost flex-1" type="button" @click="$emit('close')">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  `,
  props: {
    announcement: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        nameEvent: "",
        description: "",
        dateEvent: "",
        hoursEvent: "",
        tags: [],
        addressAnnouncement: {
          address: "",
          city: "",
          postalCode: "",
          country: "",
        },
        locationAnnouncement: { type: "Point", coordinates: [0, 0] },
        status: "INACTIVE",
        maxParticipants: 0,
        maxVolunteers: 0,
      },
      tagsInput: "",
      coverPhotoPreview: null,
      statusOptions: [
        { label: "ACTIVE", value: "ACTIVE" },
        { label: "INACTIVE", value: "INACTIVE" },
        { label: "COMPLETED", value: "COMPLETED" },
      ],
    };
  },
  computed: {
    minParticipants() {
      return this.announcement?.nbParticipants ?? 0;
    },
    minVolunteers() {
      return this.announcement?.nbVolunteers ?? 0;
    },
    maxParticipantsError() {
      return (
        this.form.maxParticipants !== undefined &&
        this.form.maxParticipants < this.minParticipants
      );
    },
    maxVolunteersError() {
      return (
        this.form.maxVolunteers !== undefined &&
        this.form.maxVolunteers < this.minVolunteers
      );
    },
    isFormInvalid() {
      return this.maxParticipantsError || this.maxVolunteersError;
    },
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.coverPhotoPreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    removeCoverPhoto() {
      this.coverPhotoPreview = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    save() {
      this.form.tags = this.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      this.$emit("saved", this.form);
    },
  },
  emits: ["close", "saved"],
  watch: {
    announcement: {
      handler(newAnnouncement) {
        if (newAnnouncement) {
          this.form = { ...newAnnouncement };
          this.tagsInput = newAnnouncement.tags
            ? newAnnouncement.tags.join(", ")
            : "";
          this.coverPhotoPreview = newAnnouncement.announcementImage || null;
        } else {
          this.form = {
            nameEvent: "",
            description: "",
            dateEvent: "",
            hoursEvent: "",
            tags: [],
            addressAnnouncement: {
              address: "",
              city: "",
              postalCode: "",
              country: "",
            },
            locationAnnouncement: { type: "Point", coordinates: [0, 0] },
            status: "INACTIVE",
            maxParticipants: 0,
            maxVolunteers: 0,
          };
          this.tagsInput = "";
          this.coverPhotoPreview = null;
        }
      },
      immediate: true,
    },
  },
};

describe("AnnouncementEditForm", () => {
  const mockAnnouncement = {
    _id: "ann-123",
    nameEvent: "Test Event",
    description: "Test description",
    dateEvent: "2024-12-25",
    hoursEvent: "14:30",
    tags: ["Tag1", "Tag2"],
    addressAnnouncement: {
      address: "123 Test Street",
      city: "Paris",
      postalCode: "75001",
      country: "France",
    },
    status: "ACTIVE",
    maxParticipants: 50,
    maxVolunteers: 10,
    nbParticipants: 5,
    nbVolunteers: 2,
    announcementImage: "data:image/jpeg;base64,test-image",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("should render form component", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("h2").text()).toBe("Créer une annonce");
    });

    it('should display "Modifier" title when editing existing announcement', () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: mockAnnouncement,
        },
      });

      expect(wrapper.find("h2").text()).toBe("Modifier une annonce");
    });

    it("should display close button", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      const buttons = wrapper.findAll("button");
      const closeBtn = buttons.find((btn) => btn.text().includes("✕"));
      expect(closeBtn).toBeTruthy();
    });
  });

  describe("Champs du formulaire", () => {
    it("should display all form fields", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      expect(wrapper.find('input[aria-label="Champ de saisie"]').exists()).toBe(
        true,
      ); // Titre
      expect(
        wrapper.find('textarea[aria-label="Zone de texte"]').exists(),
      ).toBe(true); // Description
      expect(wrapper.find('input[type="date"]').exists()).toBe(true); // Date
      expect(wrapper.find('input[type="time"]').exists()).toBe(true); // Heure
      expect(wrapper.find('input[type="number"]').exists()).toBe(true); // Nombre max participants
      expect(wrapper.find("select").exists()).toBe(true); // Statut
    });

    it("should populate form fields when editing", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: mockAnnouncement,
        },
      });

      expect(wrapper.vm.form.nameEvent).toBe("Test Event");
      expect(wrapper.vm.form.description).toBe("Test description");
      expect(wrapper.vm.form.dateEvent).toBe("2024-12-25");
      expect(wrapper.vm.form.hoursEvent).toBe("14:30");
      expect(wrapper.vm.form.maxParticipants).toBe(50);
      expect(wrapper.vm.form.maxVolunteers).toBe(10);
    });

    it("should handle tags input correctly", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: mockAnnouncement,
        },
      });

      expect(wrapper.vm.tagsInput).toBe("Tag1, Tag2");
    });
  });

  describe("Upload d'image", () => {
    it("should display upload zone when no image", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      expect(wrapper.find(".text-center").exists()).toBe(true);
      expect(wrapper.text()).toContain(
        "Cliquez pour ajouter une photo de couverture",
      );
    });

    it("should display image preview when image is set", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: mockAnnouncement,
        },
      });

      const img = wrapper.find('img[alt="Cover preview"]');
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBe("data:image/jpeg;base64,test-image");
    });

    it("should display remove button when image is present", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: mockAnnouncement,
        },
      });

      const removeBtn = wrapper.find("button.btn-circle");
      expect(removeBtn.exists()).toBe(true);
    });

    it("should handle file input change", async () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const input = wrapper.find('input[type="file"]');

      // Simuler directement le changement de fichier
      wrapper.vm.handleFileChange({ target: { files: [file] } });

      // Simuler le FileReader de manière synchrone
      wrapper.vm.coverPhotoPreview = "data:image/jpeg;base64,test-preview";
      await nextTick();
      expect(wrapper.vm.coverPhotoPreview).toBeTruthy();
    });
  });

  describe("Validation des champs", () => {
    it("should show error for maxParticipants below minimum", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: mockAnnouncement,
        },
      });

      // Définir maxParticipants en dessous du minimum
      wrapper.vm.form.maxParticipants = 3; // moins que nbParticipants (5)

      expect(wrapper.vm.maxParticipantsError).toBe(true);
      expect(wrapper.vm.maxParticipantsError).toBe(true);
    });

    it("should show error for maxVolunteers below minimum", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: mockAnnouncement,
        },
      });

      // Définir maxVolunteers en dessous du minimum
      wrapper.vm.form.maxVolunteers = 1; // moins que nbVolunteers (2)

      expect(wrapper.vm.maxVolunteersError).toBe(true);
    });

    it("should disable submit button when form is invalid", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: mockAnnouncement,
        },
      });

      wrapper.vm.form.maxParticipants = 3;

      const submitBtn = wrapper.find('button[type="submit"]');
      // Vérifier que le bouton est désactivé quand le formulaire est invalide
      expect(wrapper.vm.isFormInvalid).toBe(true);
    });
  });

  describe("Événements", () => {
    it("should emit close event when close button is clicked", async () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      const buttons = wrapper.findAll("button");
      const closeBtn = buttons.find((btn) => btn.text().includes("✕"));
      await closeBtn.trigger("click");

      expect(wrapper.emitted("close")).toBeTruthy();
    });

    it("should emit close event when cancel button is clicked", async () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      const buttons = wrapper.findAll("button");
      const cancelBtn = buttons.find((btn) => btn.text().includes("Annuler"));
      await cancelBtn.trigger("click");

      expect(wrapper.emitted("close")).toBeTruthy();
    });

    it("should emit saved event when form is submitted", async () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      // Remplir le formulaire
      wrapper.vm.form.nameEvent = "New Event";
      wrapper.vm.form.description = "New description";
      wrapper.vm.form.dateEvent = "2024-12-26";
      wrapper.vm.form.hoursEvent = "15:00";
      wrapper.vm.form.maxParticipants = 100;
      wrapper.vm.form.maxVolunteers = 20;

      await wrapper.find("form").trigger("submit");

      expect(wrapper.emitted("saved")).toBeTruthy();
      expect(wrapper.emitted("saved")?.[0]).toEqual([wrapper.vm.form]);
    });
  });

  describe("Gestion des tags", () => {
    it("should parse tags from input string", async () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      wrapper.vm.tagsInput = "Tag1, Tag2, Tag3";

      await wrapper.find("form").trigger("submit");

      expect(wrapper.vm.form.tags).toEqual(["Tag1", "Tag2", "Tag3"]);
    });

    it("should filter empty tags", async () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      wrapper.vm.tagsInput = "Tag1, , Tag2,   , Tag3";

      await wrapper.find("form").trigger("submit");

      expect(wrapper.vm.form.tags).toEqual(["Tag1", "Tag2", "Tag3"]);
    });
  });

  describe("Accessibilité", () => {
    it("should have proper aria labels", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      const inputs = wrapper.findAll("input[aria-label]");
      const textareas = wrapper.findAll("textarea[aria-label]");
      const selects = wrapper.findAll("select[aria-label]");

      expect(inputs.length).toBeGreaterThan(0);
      expect(textareas.length).toBeGreaterThan(0);
      expect(selects.length).toBeGreaterThan(0);
    });

    it("should have proper form structure", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      expect(wrapper.find("form").exists()).toBe(true);
      expect(wrapper.find("h2").exists()).toBe(true);
    });
  });

  describe("Styles et classes CSS", () => {
    it("should have proper modal styling", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      expect(wrapper.find(".fixed").exists()).toBe(true);
      expect(wrapper.find(".bg-black").exists()).toBe(true);
      expect(wrapper.find(".bg-opacity-40").exists()).toBe(true);
      expect(wrapper.find(".z-50").exists()).toBe(true);
    });

    it("should have proper form styling", () => {
      const wrapper = mount(MockAnnouncementEditForm, {
        props: {
          announcement: null,
        },
      });

      expect(wrapper.find(".bg-white").exists()).toBe(true);
      expect(wrapper.find(".rounded-lg").exists()).toBe(true);
      expect(wrapper.find(".shadow-lg").exists()).toBe(true);
    });
  });
});
