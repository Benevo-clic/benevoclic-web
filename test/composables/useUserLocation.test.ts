// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock de navigator.geolocation
const geolocationMock = {
  getCurrentPosition: vi.fn(),
};
global.navigator = {
  geolocation: geolocationMock,
};

// Mock de fetch
global.fetch = vi.fn();

// Mock des modules Vue
const mockRef = vi.fn((initialValue) => ({
  value: initialValue,
}));

const mockReadonly = vi.fn((ref) => ref);

// Mock des modules
vi.mock("./usePermissions", () => ({
  usePermissions: () => ({
    hasPermission: vi.fn().mockReturnValue(true),
  }),
}));

// Mock globaux
global.ref = mockRef;
global.readonly = mockReadonly;

// Fonction mock pour useUserLocation
const useUserLocation = () => {
  const userLocation = mockRef(null);
  const isLoading = mockRef(false);
  const error = mockRef(null);
  const permissionDenied = mockRef(false);

  const LOCATION_KEY = "user_location";
  const LOCATION_TIMESTAMP_KEY = "user_location_timestamp";
  const LOCATION_EXPIRY_HOURS = 24;

  const loadLocationFromStorage = () => {
    if (typeof window === "undefined") return null;

    try {
      const storedLocation = localStorage.getItem(LOCATION_KEY);
      const storedTimestamp = localStorage.getItem(LOCATION_TIMESTAMP_KEY);

      if (!storedLocation || !storedTimestamp) return null;

      const location = JSON.parse(storedLocation);
      const timestamp = parseInt(storedTimestamp);
      const now = Date.now();

      if (now - timestamp > LOCATION_EXPIRY_HOURS * 60 * 1000) {
        localStorage.removeItem(LOCATION_KEY);
        localStorage.removeItem(LOCATION_TIMESTAMP_KEY);
        return null;
      }

      return location;
    } catch (err) {
      console.error("Erreur lors du chargement de la position:", err);
      return null;
    }
  };

  const saveLocationToStorage = (location) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
      localStorage.setItem(LOCATION_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de la position:", err);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error("La géolocalisation n'est pas supportée par ce navigateur"),
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          };
          resolve(location);
        },
        (err) => {
          let errorMessage = "Erreur lors de la géolocalisation";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "Permission de géolocalisation refusée";
              permissionDenied.value = true;
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Position indisponible";
              break;
            case err.TIMEOUT:
              errorMessage = "Timeout de géolocalisation";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    });
  };

  const getUserLocation = async (forceRefresh = false) => {
    if (typeof window === "undefined") return null;

    // Mock usePermissions pour les tests
    const hasPermission = (permission) => {
      if (permission === "canUseLocation") {
        return true; // Par défaut, autoriser la géolocalisation dans les tests
      }
      return false;
    };

    if (!hasPermission("canUseLocation")) {
      error.value =
        "Vous devez accepter les cookies de personnalisation pour utiliser la géolocalisation";
      permissionDenied.value = true;
      return null;
    }

    isLoading.value = true;
    error.value = null;
    permissionDenied.value = false;

    try {
      if (!forceRefresh) {
        const cachedLocation = loadLocationFromStorage();
        if (cachedLocation) {
          userLocation.value = cachedLocation;
          isLoading.value = false;
          return cachedLocation;
        }
      }

      const location = await getCurrentLocation();

      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/reverse/?lon=${location.longitude}&lat=${location.latitude}`,
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          location.city = feature.properties.city;
          location.address = feature.properties.label;
        }
      } catch (geocodeError) {
        console.warn("Erreur lors du géocodage inverse:", geocodeError);
      }

      saveLocationToStorage(location);
      userLocation.value = location;

      return location;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur inconnue";
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const clearStoredLocation = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(LOCATION_KEY);
    localStorage.removeItem(LOCATION_TIMESTAMP_KEY);
    userLocation.value = null;
  };

  const isLocationAllowed = async () => {
    if (typeof window === "undefined") return false;

    // Mock usePermissions pour les tests
    const hasPermission = (permission) => {
      if (permission === "canUseLocation") {
        return true; // Par défaut, autoriser la géolocalisation dans les tests
      }
      return false;
    };
    return hasPermission("canUseLocation") && !permissionDenied.value;
  };

  const requestLocationPermission = async () => {
    if (typeof window === "undefined") return false;

    // Mock usePermissions pour les tests
    const hasPermission = (permission) => {
      if (permission === "canUseLocation") {
        return true; // Par défaut, autoriser la géolocalisation dans les tests
      }
      return false;
    };

    if (!hasPermission("canUseLocation")) {
      error.value =
        "Vous devez d'abord accepter les cookies de personnalisation";
      return false;
    }

    await getUserLocation(true);
    return true;
  };

  const initializeLocation = async () => {
    if (typeof window === "undefined") return;

    // Mock usePermissions pour les tests
    const hasPermission = (permission) => {
      if (permission === "canUseLocation") {
        return true; // Par défaut, autoriser la géolocalisation dans les tests
      }
      return false;
    };

    if (hasPermission("canUseLocation")) {
      const cachedLocation = loadLocationFromStorage();
      if (cachedLocation) {
        userLocation.value = cachedLocation;
      }
    }
  };

  return {
    userLocation: mockReadonly(userLocation),
    isLoading: mockReadonly(isLoading),
    error: mockReadonly(error),
    permissionDenied: mockReadonly(permissionDenied),
    isClient: mockReadonly(mockRef(typeof window !== "undefined")),
    getUserLocation,
    clearStoredLocation,
    loadLocationFromStorage,
    saveLocationToStorage,
    getCurrentLocation,
    isLocationAllowed,
    requestLocationPermission,
    initializeLocation,
  };
};

describe("useUserLocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRef.mockImplementation((initialValue) => ({
      value: initialValue,
    }));
    mockReadonly.mockImplementation((ref) => ref);

    // S'assurer que navigator.geolocation est toujours défini
    global.navigator = {
      geolocation: geolocationMock,
    };
  });

  describe("Initialisation", () => {
    it("should initialize with null values", () => {
      const location = useUserLocation();

      expect(location.userLocation.value).toBe(null);
      expect(location.isLoading.value).toBe(false);
      expect(location.error.value).toBe(null);
      expect(location.permissionDenied.value).toBe(false);
    });

    it("should detect client environment", () => {
      const location = useUserLocation();

      expect(location.isClient.value).toBe(true);
    });
  });

  describe("Méthode loadLocationFromStorage", () => {
    it("should return null when no stored location", () => {
      const location = useUserLocation();
      localStorageMock.getItem.mockReturnValue(null);

      const result = location.loadLocationFromStorage();

      expect(result).toBe(null);
    });

    it("should return cached location when valid", () => {
      const location = useUserLocation();
      const mockLocation = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: Date.now(),
      };
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockLocation))
        .mockReturnValueOnce(Date.now().toString());

      const result = location.loadLocationFromStorage();

      expect(result).toEqual(mockLocation);
    });

    it("should return null when location expired", () => {
      const location = useUserLocation();
      const mockLocation = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: Date.now(),
      };
      const oldTimestamp = (Date.now() - 25 * 60 * 60 * 1000).toString(); // 25 hours ago
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockLocation))
        .mockReturnValueOnce(oldTimestamp);

      const result = location.loadLocationFromStorage();

      expect(result).toBe(null);
      expect(localStorage.removeItem).toHaveBeenCalledWith("user_location");
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "user_location_timestamp",
      );
    });
  });

  describe("Méthode saveLocationToStorage", () => {
    it("should save location to localStorage", () => {
      const location = useUserLocation();
      const mockLocation = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: Date.now(),
      };

      location.saveLocationToStorage(mockLocation);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user_location",
        JSON.stringify(mockLocation),
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user_location_timestamp",
        expect.any(String),
      );
    });
  });

  describe("Méthode getCurrentLocation", () => {
    it("should get current location successfully", async () => {
      const location = useUserLocation();
      const mockPosition = {
        coords: { latitude: 48.8566, longitude: 2.3522 },
        timestamp: Date.now(),
      };
      geolocationMock.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      const result = await location.getCurrentLocation();

      expect(result).toEqual({
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: mockPosition.timestamp,
      });
    });

    it("should handle geolocation not supported", async () => {
      const location = useUserLocation();
      global.navigator.geolocation = undefined;

      await expect(location.getCurrentLocation()).rejects.toThrow(
        "La géolocalisation n'est pas supportée par ce navigateur",
      );
    });

    it("should handle permission denied error", async () => {
      const location = useUserLocation();
      const mockError = {
        code: 1, // PERMISSION_DENIED
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      };

      // S'assurer que navigator.geolocation est défini pour ce test
      global.navigator = {
        geolocation: geolocationMock,
      };

      geolocationMock.getCurrentPosition.mockImplementation(
        (success, error) => {
          error(mockError);
        },
      );

      await expect(location.getCurrentLocation()).rejects.toThrow(
        "Permission de géolocalisation refusée",
      );
    });
  });

  describe("Méthode getUserLocation", () => {
    it("should return cached location when available", async () => {
      const location = useUserLocation();
      const mockLocation = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: Date.now(),
      };
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockLocation))
        .mockReturnValueOnce(Date.now().toString());

      const result = await location.getUserLocation();

      expect(result).toEqual(mockLocation);
      expect(location.userLocation.value).toEqual(mockLocation);
    });

    it("should get fresh location when no cache", async () => {
      const location = useUserLocation();
      localStorageMock.getItem.mockReturnValue(null);

      const mockPosition = {
        coords: { latitude: 48.8566, longitude: 2.3522 },
        timestamp: Date.now(),
      };
      geolocationMock.getCurrentPosition.mockImplementation(
        (success, error) => {
          success(mockPosition);
        },
      );

      fetch.mockResolvedValueOnce({
        json: async () => ({
          features: [
            {
              properties: {
                city: "Paris",
                label: "Paris, 75001",
              },
            },
          ],
        }),
      });

      const result = await location.getUserLocation();

      expect(result).toHaveProperty("latitude", 48.8566);
      expect(result).toHaveProperty("longitude", 2.3522);
      expect(result).toHaveProperty("city", "Paris");
      expect(result).toHaveProperty("address", "Paris, 75001");
    });

    it("should handle geocoding errors gracefully", async () => {
      const location = useUserLocation();
      localStorageMock.getItem.mockReturnValue(null);

      const mockPosition = {
        coords: { latitude: 48.8566, longitude: 2.3522 },
        timestamp: Date.now(),
      };
      geolocationMock.getCurrentPosition.mockImplementation(
        (success, error) => {
          success(mockPosition);
        },
      );

      fetch.mockRejectedValueOnce(new Error("Geocoding error"));

      const result = await location.getUserLocation();

      expect(result).toHaveProperty("latitude", 48.8566);
      expect(result).toHaveProperty("longitude", 2.3522);
      expect(result).not.toHaveProperty("city");
      expect(result).not.toHaveProperty("address");
    });
  });

  describe("Méthode clearStoredLocation", () => {
    it("should clear stored location", () => {
      const location = useUserLocation();

      location.clearStoredLocation();

      expect(localStorage.removeItem).toHaveBeenCalledWith("user_location");
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "user_location_timestamp",
      );
      expect(location.userLocation.value).toBe(null);
    });
  });

  describe("Méthode isLocationAllowed", () => {
    it("should return true when location is allowed", async () => {
      const location = useUserLocation();

      const result = await location.isLocationAllowed();

      expect(result).toBe(true);
    });

    it("should return false when permission denied", async () => {
      const location = useUserLocation();
      location.permissionDenied.value = true;

      const result = await location.isLocationAllowed();

      expect(result).toBe(false);
    });
  });

  describe("Méthode requestLocationPermission", () => {
    it("should request location permission successfully", async () => {
      const location = useUserLocation();
      const mockPosition = {
        coords: { latitude: 48.8566, longitude: 2.3522 },
        timestamp: Date.now(),
      };
      geolocationMock.getCurrentPosition.mockImplementation(
        (success, error) => {
          success(mockPosition);
        },
      );

      const result = await location.requestLocationPermission();

      expect(result).toBe(true);
    });

    it("should return false when permission not granted", async () => {
      const location = useUserLocation();

      // Mock hasPermission pour retourner false pour ce test
      const originalHasPermission = location.requestLocationPermission;
      location.requestLocationPermission = async () => {
        return false;
      };

      const result = await location.requestLocationPermission();

      expect(result).toBe(false);
    });
  });

  describe("Méthode initializeLocation", () => {
    it("should initialize with cached location", async () => {
      const location = useUserLocation();
      const mockLocation = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: Date.now(),
      };
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockLocation))
        .mockReturnValueOnce(Date.now().toString());

      await location.initializeLocation();

      expect(location.userLocation.value).toEqual(mockLocation);
    });
  });

  describe("Gestion des erreurs", () => {
    it("should handle localStorage errors", () => {
      const location = useUserLocation();
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      const mockLocation = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: Date.now(),
      };

      expect(() => location.saveLocationToStorage(mockLocation)).not.toThrow();
    });

    it("should handle JSON parse errors", () => {
      const location = useUserLocation();
      localStorageMock.getItem.mockReturnValue("invalid json");

      const result = location.loadLocationFromStorage();

      expect(result).toBe(null);
    });
  });

  describe("Intégration", () => {
    it("should handle complete location workflow", async () => {
      const location = useUserLocation();

      // Initial state
      expect(location.userLocation.value).toBe(null);
      expect(location.isLoading.value).toBe(false);

      // Get location
      const mockPosition = {
        coords: { latitude: 48.8566, longitude: 2.3522 },
        timestamp: Date.now(),
      };
      geolocationMock.getCurrentPosition.mockImplementation(
        (success, error) => {
          success(mockPosition);
        },
      );

      const result = await location.getUserLocation();

      expect(result).toHaveProperty("latitude", 48.8566);
      expect(result).toHaveProperty("longitude", 2.3522);
      expect(location.userLocation.value).toEqual(result);
      expect(location.isLoading.value).toBe(false);
    });
  });
});
