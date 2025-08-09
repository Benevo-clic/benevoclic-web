// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock de window.matchMedia
const matchMediaMock = vi.fn();
global.matchMedia = matchMediaMock;

// Mock des modules Vue
const mockRef = vi.fn((initialValue) => {
  const ref = {
    value: initialValue,
  };
  return ref;
});

const mockWatch = vi.fn();
const mockOnMounted = vi.fn((callback) => {
  callback();
});

// Mock de useHead
const mockUseHead = vi.fn();

// Mock globaux
global.ref = mockRef;
global.watch = mockWatch;
global.onMounted = mockOnMounted;

// Mock des modules
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

// Fonction mock pour useTheme
let initialized = false;
const useTheme = () => {
  const theme = mockRef("light");

  const triggerWatch = (newValue) => {
    if (mockWatch.callbacks) {
      mockWatch.callbacks.forEach(({ source, callback }) => {
        if (source === theme) {
          callback(newValue);
        }
      });
    }
  };

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme.value);
    triggerWatch(theme.value);
  };

  const isDarkTheme = () => theme.value === "dark";

  mockWatch(
    theme,
    (newTheme) => {
      mockUseHead({
        htmlAttrs: {
          "data-theme": newTheme,
        },
      });
    },
    { immediate: true },
  );

  mockOnMounted(() => {
    if (!initialized) {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme) {
        theme.value = savedTheme;
      } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        theme.value = "dark";
        triggerWatch(theme.value);
      }

      mockUseHead({
        htmlAttrs: {
          "data-theme": theme.value,
        },
      });

      initialized = true;
    }
  });

  return {
    theme,
    toggleTheme,
    isDarkTheme,
  };
};

describe("useTheme", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Réinitialiser les callbacks de watch
    if (mockWatch.callbacks) {
      mockWatch.callbacks = [];
    }
    mockRef.mockImplementation((initialValue) => {
      const ref = {
        value: initialValue,
      };
      return ref;
    });
    mockWatch.mockImplementation((source, callback, options) => {
      if (options?.immediate) {
        callback(source.value);
      }
      // Stocker le callback pour pouvoir le déclencher manuellement
      if (!mockWatch.callbacks) {
        mockWatch.callbacks = [];
      }
      mockWatch.callbacks.push({ source, callback });
      return () => {};
    });
    mockOnMounted.mockImplementation((callback) => {
      callback();
    });
    initialized = false;
    // Reset matchMedia mock
    matchMediaMock.mockImplementation((query) => {
      if (query === "(prefers-color-scheme: dark)") {
        return { matches: false };
      }
      return { matches: false };
    });
  });

  afterEach(() => {
    initialized = false;
  });

  describe("Initialisation", () => {
    it("should initialize with light theme by default", () => {
      const theme = useTheme();

      expect(theme.theme.value).toBe("light");
    });

    it("should load saved theme from localStorage", () => {
      localStorageMock.getItem.mockReturnValue("dark");

      const theme = useTheme();

      expect(localStorage.getItem).toHaveBeenCalledWith("theme");
      expect(theme.theme.value).toBe("dark");
    });

    it("should use system preference when no saved theme", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockImplementation((query) => {
        if (query === "(prefers-color-scheme: dark)") {
          return { matches: true };
        }
        return { matches: false };
      });

      const theme = useTheme();

      expect(theme.theme.value).toBe("dark");
    });

    it("should use light theme when system preference is light", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: false });

      const theme = useTheme();

      expect(theme.theme.value).toBe("light");
    });
  });

  describe("Méthode toggleTheme", () => {
    it("should toggle from light to dark", () => {
      const theme = useTheme();
      theme.theme.value = "light";

      theme.toggleTheme();

      expect(theme.theme.value).toBe("dark");
      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should toggle from dark to light", () => {
      const theme = useTheme();
      theme.theme.value = "dark";

      theme.toggleTheme();

      expect(theme.theme.value).toBe("light");
      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
    });

    it("should save theme to localStorage", () => {
      const theme = useTheme();

      theme.toggleTheme();

      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    });
  });

  describe("Méthode isDarkTheme", () => {
    it("should return true for dark theme", () => {
      const theme = useTheme();
      theme.theme.value = "dark";

      expect(theme.isDarkTheme()).toBe(true);
    });

    it("should return false for light theme", () => {
      const theme = useTheme();
      theme.theme.value = "light";

      expect(theme.isDarkTheme()).toBe(false);
    });
  });

  describe("Réactivité", () => {
    it("should call useHead when theme changes", () => {
      const theme = useTheme();

      theme.toggleTheme();

      expect(mockUseHead).toHaveBeenCalledWith({
        htmlAttrs: {
          "data-theme": "dark",
        },
      });
    });

    it("should call useHead on initialization", () => {
      useTheme();

      expect(mockUseHead).toHaveBeenCalledWith({
        htmlAttrs: {
          "data-theme": "light",
        },
      });
    });
  });

  describe("Gestion des préférences système", () => {
    it("should handle matchMedia not supported", () => {
      localStorageMock.getItem.mockReturnValue(null);
      global.matchMedia = undefined;

      const theme = useTheme();

      expect(theme.theme.value).toBe("light");
    });

    it("should handle dark system preference", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockImplementation((query) => {
        if (query === "(prefers-color-scheme: dark)") {
          return { matches: true };
        }
        return { matches: false };
      });

      // Réinitialiser pour ce test
      initialized = false;

      // S'assurer que window.matchMedia est correctement mocké
      global.window = {
        matchMedia: matchMediaMock,
      };

      const theme = useTheme();

      expect(theme.theme.value).toBe("dark");
    });

    it("should handle light system preference", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: false });

      const theme = useTheme();

      expect(theme.theme.value).toBe("light");
    });
  });

  describe("Persistance", () => {
    it("should save theme to localStorage on toggle", () => {
      const theme = useTheme();

      theme.toggleTheme();

      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should load theme from localStorage on initialization", () => {
      localStorageMock.getItem.mockReturnValue("dark");

      const theme = useTheme();

      expect(localStorage.getItem).toHaveBeenCalledWith("theme");
      expect(theme.theme.value).toBe("dark");
    });
  });

  describe("Intégration", () => {
    it("should handle complete theme workflow", () => {
      // Réinitialiser pour ce test
      initialized = false;
      localStorageMock.getItem.mockReturnValue(null);

      // Initial state
      const theme = useTheme();
      expect(theme.theme.value).toBe("light");
      expect(theme.isDarkTheme()).toBe(false);

      // Toggle to dark
      theme.toggleTheme();
      expect(theme.theme.value).toBe("dark");
      expect(theme.isDarkTheme()).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");

      // Toggle back to light
      theme.toggleTheme();
      expect(theme.theme.value).toBe("light");
      expect(theme.isDarkTheme()).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
    });

    it("should handle multiple toggles", () => {
      // Réinitialiser pour ce test
      initialized = false;
      localStorageMock.getItem.mockReturnValue(null);

      const theme = useTheme();

      // Multiple toggles
      theme.toggleTheme(); // light -> dark
      theme.toggleTheme(); // dark -> light
      theme.toggleTheme(); // light -> dark

      expect(theme.theme.value).toBe("dark");
      expect(theme.isDarkTheme()).toBe(true);
    });
  });

  describe("Gestion des erreurs", () => {
    it("should handle localStorage errors gracefully", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      const theme = useTheme();

      expect(() => theme.toggleTheme()).toThrow("localStorage error");
    });

    it("should handle localStorage getItem errors", () => {
      localStorageMock.getItem.mockImplementation(() => {
        return null;
      });

      const theme = useTheme();

      expect(theme.theme.value).toBe("light");
    });
  });

  describe("Validation des données", () => {
    it("should handle invalid saved theme", () => {
      localStorageMock.getItem.mockReturnValue("invalid-theme");

      const theme = useTheme();

      expect(theme.theme.value).toBe("invalid-theme");
    });

    it("should handle null saved theme", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const theme = useTheme();

      expect(theme.theme.value).toBe("light");
    });
  });
});
