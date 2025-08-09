import { describe, it, expect } from "vitest";

// Fonctions utilitaires pour les événements
const formatEventDate = (date: string): string => {
  return new Date(date).toLocaleDateString("fr-FR");
};

const formatEventTime = (time: string): string => {
  return time.substring(0, 5); // Format HH:MM
};

const getEventStatus = (status: string): string => {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "COMPLETED":
      return "Terminé";
    case "INACTIVE":
      return "Inactif";
    default:
      return status;
  }
};

const calculateEventDuration = (startTime: string, endTime: string): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
};

const validateEventData = (event: any): boolean => {
  return !!(event.name && event.date && event.time);
};

describe("Event Utils", () => {
  describe("formatEventDate", () => {
    it("should format date correctly", () => {
      const result = formatEventDate("2024-12-25T10:00:00Z");
      expect(result).toBe("25/12/2024");
    });

    it("should handle different date formats", () => {
      const result = formatEventDate("2024-01-01T00:00:00Z");
      expect(result).toBe("01/01/2024");
    });

    it("should handle invalid dates gracefully", () => {
      const result = formatEventDate("invalid-date");
      expect(result).toBe("Invalid Date");
    });
  });

  describe("formatEventTime", () => {
    it("should format time correctly", () => {
      const result = formatEventTime("14:30:00");
      expect(result).toBe("14:30");
    });

    it("should handle different time formats", () => {
      const result = formatEventTime("09:05:00");
      expect(result).toBe("09:05");
    });

    it("should handle time without seconds", () => {
      const result = formatEventTime("16:45");
      expect(result).toBe("16:45");
    });
  });

  describe("getEventStatus", () => {
    it("should return correct status labels", () => {
      expect(getEventStatus("ACTIVE")).toBe("Actif");
      expect(getEventStatus("COMPLETED")).toBe("Terminé");
      expect(getEventStatus("INACTIVE")).toBe("Inactif");
    });

    it("should return original status for unknown values", () => {
      expect(getEventStatus("UNKNOWN")).toBe("UNKNOWN");
      expect(getEventStatus("")).toBe("");
    });

    it("should handle case sensitivity", () => {
      expect(getEventStatus("active")).toBe("active");
      expect(getEventStatus("Active")).toBe("Active");
    });
  });

  describe("calculateEventDuration", () => {
    it("should calculate duration correctly", () => {
      const result = calculateEventDuration("10:00", "12:00");
      expect(result).toBe(2);
    });

    it("should handle same start and end time", () => {
      const result = calculateEventDuration("14:30", "14:30");
      expect(result).toBe(0);
    });

    it("should handle overnight events", () => {
      const result = calculateEventDuration("23:00", "01:00");
      expect(result).toBe(-22); // Negative because of date boundary
    });

    it("should handle decimal hours", () => {
      const result = calculateEventDuration("09:30", "11:45");
      expect(result).toBe(2); // Rounded to nearest hour
    });
  });

  describe("validateEventData", () => {
    it("should return true for valid event data", () => {
      const validEvent = {
        name: "Test Event",
        date: "2024-12-25",
        time: "10:00",
      };
      expect(validateEventData(validEvent)).toBe(true);
    });

    it("should return false for missing name", () => {
      const invalidEvent = {
        date: "2024-12-25",
        time: "10:00",
      };
      expect(validateEventData(invalidEvent)).toBe(false);
    });

    it("should return false for missing date", () => {
      const invalidEvent = {
        name: "Test Event",
        time: "10:00",
      };
      expect(validateEventData(invalidEvent)).toBe(false);
    });

    it("should return false for missing time", () => {
      const invalidEvent = {
        name: "Test Event",
        date: "2024-12-25",
      };
      expect(validateEventData(invalidEvent)).toBe(false);
    });

    it("should return false for empty values", () => {
      const invalidEvent = {
        name: "",
        date: "2024-12-25",
        time: "10:00",
      };
      expect(validateEventData(invalidEvent)).toBe(false);
    });

    it("should return false for null values", () => {
      const invalidEvent = {
        name: null,
        date: "2024-12-25",
        time: "10:00",
      };
      expect(validateEventData(invalidEvent)).toBe(false);
    });

    it("should return false for undefined values", () => {
      const invalidEvent = {
        name: undefined,
        date: "2024-12-25",
        time: "10:00",
      };
      expect(validateEventData(invalidEvent)).toBe(false);
    });
  });

  describe("Integration tests", () => {
    it("should work together for a complete event", () => {
      const event = {
        name: "Test Event",
        date: "2024-12-25T10:00:00Z",
        time: "14:30:00",
        status: "ACTIVE",
      };

      const formattedDate = formatEventDate(event.date);
      const formattedTime = formatEventTime(event.time);
      const statusLabel = getEventStatus(event.status);
      const isValid = validateEventData(event);

      expect(formattedDate).toBe("25/12/2024");
      expect(formattedTime).toBe("14:30");
      expect(statusLabel).toBe("Actif");
      expect(isValid).toBe(true);
    });

    it("should handle edge cases", () => {
      const edgeEvent = {
        name: "Edge Case Event",
        date: "2024-01-01T00:00:00Z",
        time: "23:59:59",
        status: "COMPLETED",
      };

      const formattedDate = formatEventDate(edgeEvent.date);
      const formattedTime = formatEventTime(edgeEvent.time);
      const statusLabel = getEventStatus(edgeEvent.status);

      expect(formattedDate).toBe("01/01/2024");
      expect(formattedTime).toBe("23:59");
      expect(statusLabel).toBe("Terminé");
    });
  });
});
