import { vi } from "vitest";

// Mock global pour Nuxt
global.$fetch = vi.fn() as any;

// Mock des composables Nuxt
vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $fetch: vi.fn(),
    $maplibregl: {
      Map: vi.fn(),
      NavigationControl: vi.fn(),
      GeolocateControl: vi.fn(),
      Popup: vi.fn(),
    },
  }),
  navigateTo: vi.fn(),
  useRoute: () => ({
    path: "/",
    query: {},
    params: {},
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock global pour vue-i18n
vi.mock("vue-i18n", () => ({
  useI18n: vi.fn(() => ({
    t: (key: string) => key,
    locale: "fr",
    locales: ["fr", "en", "es"],
  })),
}));

// Mock global pour useI18n (auto-import de Nuxt)
(global as any).useI18n = vi.fn(() => ({
  t: (key: string) => key,
  locale: "fr",
  locales: ["fr", "en", "es"],
}));

// Mock des composables personnalisés
vi.mock("~/composables/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { role: "VOLUNTEER" },
    login: vi.fn(),
    logout: vi.fn(),
    googleLogin: vi.fn(),
  }),
}));

vi.mock("~/composables/useUser", () => ({
  useUser: () => ({
    user: {
      value: {
        _id: "user123",
        role: "VOLUNTEER",
        firstName: "John",
        lastName: "Doe",
        userId: "user123",
      },
    },
    refreshUser: vi.fn(),
  }),
}));

vi.mock("~/composables/auth/useUser", () => ({
  useUser: () => ({
    user: {
      value: {
        _id: "user123",
        role: "VOLUNTEER",
        firstName: "John",
        lastName: "Doe",
        userId: "user123",
      },
    },
    refreshUser: vi.fn(),
    getUserById: vi.fn(() =>
      Promise.resolve({
        userId: "user123",
        email: "test@example.com",
        avatarFileKey: "avatar.jpg",
      }),
    ),
  }),
}));

vi.mock("~/composables/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

vi.mock("~/composables/usePermissions", () => ({
  usePermissions: () => ({
    hasPermission: vi.fn(() => false),
    loadCookiePreferences: vi.fn(),
    saveCookiePreferences: vi.fn(),
    acceptAllCookies: vi.fn(),
    rejectAllCookies: vi.fn(),
    cookiePreferences: { value: {} },
  }),
}));

vi.mock("~/composables/useAddress", () => ({
  useAddress: () => ({
    getAddressFromCoordinates: vi.fn(),
    getCoordinatesFromAddress: vi.fn(),
  }),
}));

vi.mock("~/composables/useAnnouncement", () => ({
  useAnnouncement: () => ({
    announcements: [],
    loading: false,
    error: null,
    filterAnnouncement: vi.fn(),
  }),
}));

vi.mock("~/composables/useUserLocation", () => ({
  useUserLocation: () => ({
    userLocation: { value: null },
    getUserLocation: vi.fn(),
    watchUserLocation: vi.fn(),
  }),
}));

vi.mock("~/composables/useNavigation", () => ({
  useNavigation: () => ({
    navigateToRoute: vi.fn(),
  }),
}));

vi.mock("~/composables/useFavoritesAnnouncement", () => ({
  useFavoritesAnnouncement: () => ({
    getFavorites: { value: [] },
    fetchAllFavoritesOfVolunteer: vi.fn(),
    addFavorite: vi.fn(),
    removeByVolunteerIdAndAnnouncementId: vi.fn(),
    isFavorite: vi.fn(() => false),
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    toggleFavorite: vi.fn(),
  }),
}));

// Mock des stores
vi.mock("~/stores/favoritesAnnouncement.store", () => ({
  useFavoritesAnnouncementStore: () => ({
    isFavorite: vi.fn(() => false),
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    toggleFavorite: vi.fn(),
  }),
}));

vi.mock("~/stores/announcement.store", () => ({
  useAnnouncementStore: () => ({
    announcements: [],
    loading: false,
    error: null,
    filterAnnouncement: vi.fn(),
  }),
}));

// Mock de maplibre-gl
vi.mock("maplibre-gl", () => ({
  Map: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    addSource: vi.fn(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    removeSource: vi.fn(),
    getSource: vi.fn(),
    getLayer: vi.fn(),
    setPaintProperty: vi.fn(),
    setLayoutProperty: vi.fn(),
    setFilter: vi.fn(),
    flyTo: vi.fn(),
    fitBounds: vi.fn(),
    resize: vi.fn(),
    remove: vi.fn(),
  })),
  NavigationControl: vi.fn(),
  GeolocateControl: vi.fn(),
  Popup: vi.fn().mockImplementation(() => ({
    setLngLat: vi.fn().mockReturnThis(),
    setHTML: vi.fn().mockReturnThis(),
    addTo: vi.fn(),
  })),
}));

// Mock des composants Nuxt
vi.mock("#components", () => ({
  NuxtLink: {
    name: "NuxtLink",
    template: '<a :href="to"><slot /></a>',
    props: ["to"],
    inheritAttrs: false,
  },
  NuxtImg: {
    name: "NuxtImg",
    template: "<img><slot /></img>",
    inheritAttrs: false,
  },
  ClientOnly: {
    name: "ClientOnly",
    template: "<div><slot /></div>",
  },
}));

// Mock global pour NuxtLink (fallback)
(global as any).NuxtLink = {
  name: "NuxtLink",
  template: '<a :href="to"><slot /></a>',
  props: ["to"],
  inheritAttrs: false,
};

// Configuration globale pour Vue Test Utils
import { config } from "@vue/test-utils";

config.global.components = {
  NuxtLink: {
    name: "NuxtLink",
    template: '<a :href="to"><slot /></a>',
    props: ["to"],
    inheritAttrs: false,
  },
  ClientOnly: {
    name: "ClientOnly",
    template: "<div><slot /></div>",
  },
};

// Mock des composants utils
vi.mock("~/components/utils/ErrorPopup.vue", () => ({
  default: {
    template:
      '<div class="mock-error-popup" v-if="showErrorModal">Error Popup</div>',
    props: ["showErrorModal", "errorType"],
    emits: ["reload", "goHome"],
  },
}));

vi.mock("~/components/event/association/PresenceModal.vue", () => ({
  default: {
    template: '<div class="mock-presence-modal"></div>',
    methods: {
      showModal: vi.fn(),
      closeModal: vi.fn(),
    },
  },
}));

// Configuration globale pour les tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
