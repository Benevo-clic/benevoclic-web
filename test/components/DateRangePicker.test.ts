import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DateRangePicker from "../../components/dashboard/DateRangePicker.vue";

describe("DateRangePicker", () => {
  it("should render date range picker component", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[role="group"]').exists()).toBe(true);
  });

  it("should display date inputs", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const inputs = wrapper.findAll('input[type="date"]');
    expect(inputs).toHaveLength(2);
  });

  it("should have proper accessibility attributes", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const group = wrapper.find('[role="group"]');
    expect(group.exists()).toBe(true);
    expect(group.attributes("aria-labelledby")).toBe("date-range-label");

    const label = wrapper.find("#date-range-label");
    expect(label.exists()).toBe(true);
    expect(label.classes()).toContain("sr-only");
  });

  it("should have proper CSS classes for styling", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const container = wrapper.find('[role="group"]');
    expect(container.classes()).toContain("flex");
    expect(container.classes()).toContain("flex-col");
    expect(container.classes()).toContain("sm:flex-row");
    expect(container.classes()).toContain("items-stretch");
    expect(container.classes()).toContain("sm:items-center");
    expect(container.classes()).toContain("gap-2");
    expect(container.classes()).toContain("w-full");
    expect(container.classes()).toContain("sm:w-auto");
  });

  it("should emit update:modelValue when dates change", async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const inputs = wrapper.findAll('input[type="date"]');
    await inputs[0].setValue("2024-01-01");
    await inputs[1].setValue("2024-01-31");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    // Le composant émet les valeurs individuellement, donc on vérifie la dernière émission
    const emissions = wrapper.emitted("update:modelValue");
    expect(emissions).toBeTruthy();
    expect(emissions?.[emissions.length - 1]).toEqual([
      { from: "2024-01-01", to: "2024-01-31" },
    ]);
  });

  it("should emit change event when filter button is clicked", async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "2024-01-01", to: "2024-01-31" },
      },
    });

    const filterButton = wrapper.find("button");
    await filterButton.trigger("click");

    expect(wrapper.emitted("change")).toBeTruthy();
    expect(wrapper.emitted("change")?.[0]).toEqual([
      { from: "2024-01-01", to: "2024-01-31" },
    ]);
  });

  it("should validate date range correctly", async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "2024-01-31", to: "2024-01-01" },
      },
    });

    // Invalid range (end date before start date)
    const filterButton = wrapper.find("button");
    expect(filterButton.attributes("disabled")).toBeDefined();
  });

  it("should allow valid date ranges", async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "2024-01-01", to: "2024-01-31" },
      },
    });

    const filterButton = wrapper.find("button");
    expect(filterButton.attributes("disabled")).toBeUndefined();
  });

  it("should have proper input styling", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const inputs = wrapper.findAll('input[type="date"]');
    inputs.forEach((input) => {
      expect(input.classes()).toContain("input");
      expect(input.classes()).toContain("input-sm");
      expect(input.classes()).toContain("border");
      expect(input.classes()).toContain("rounded");
      expect(input.classes()).toContain("flex-1");
      expect(input.classes()).toContain("sm:w-auto");
      expect(input.classes()).toContain("min-w-0");
    });
  });

  it("should have proper button styling", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const button = wrapper.find("button");
    expect(button.classes()).toContain("btn");
    expect(button.classes()).toContain("btn-sm");
    expect(button.classes()).toContain("btn-primary");
    expect(button.classes()).toContain("w-full");
    expect(button.classes()).toContain("sm:w-auto");
    expect(button.classes()).toContain("sm:ml-2");
  });

  it("should handle keyboard navigation", async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "2024-01-01", to: "2024-01-31" },
      },
    });

    const inputs = wrapper.findAll('input[type="date"]');
    await inputs[0].trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("change")).toBeTruthy();
  });

  it("should have proper labels for accessibility", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const labels = wrapper.findAll("label");
    expect(labels).toHaveLength(3); // Il y a 3 labels : date-range-label, from, to

    labels.forEach((label) => {
      expect(label.classes()).toContain("sr-only");
    });
  });

  it("should have proper descriptions for accessibility", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const descriptions = wrapper.findAll(".sr-only");
    expect(descriptions.length).toBeGreaterThan(2); // Including label and descriptions
  });

  it("should handle empty date values", async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const filterButton = wrapper.find("button");
    expect(filterButton.attributes("disabled")).toBeUndefined(); // Should allow empty values
  });

  it("should have proper responsive design", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const container = wrapper.find('[role="group"]');
    expect(container.classes()).toContain("flex-col");
    expect(container.classes()).toContain("sm:flex-row");
    expect(container.classes()).toContain("w-full");
    expect(container.classes()).toContain("sm:w-auto");
  });

  it("should have proper focus styles", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const inputs = wrapper.findAll('input[type="date"]');
    inputs.forEach((input) => {
      expect(input.classes()).toContain("focus-visible:ring-2");
      expect(input.classes()).toContain("focus-visible:ring-primary/80");
      expect(input.classes()).toContain("focus-visible:ring-offset-2");
      expect(input.classes()).toContain("focus-visible:outline-none");
    });

    const button = wrapper.find("button");
    expect(button.classes()).toContain("focus-visible:ring-2");
    expect(button.classes()).toContain("focus-visible:ring-primary/80");
    expect(button.classes()).toContain("focus-visible:ring-offset-2");
    expect(button.classes()).toContain("focus-visible:outline-none");
  });

  it("should have proper aria attributes for button", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "2024-01-01", to: "2024-01-31" },
      },
    });

    const button = wrapper.find("button");
    expect(button.attributes("aria-label")).toBe(
      "Appliquer le filtre de dates",
    );
  });

  it("should show error message for invalid range", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "2024-01-31", to: "2024-01-01" },
      },
    });

    const errorDiv = wrapper.find("#range-error");
    expect(errorDiv.exists()).toBe(true);
    expect(errorDiv.classes()).toContain("sr-only");
    expect(errorDiv.text()).toContain(
      "La date de fin doit être postérieure à la date de début",
    );
  });

  it("should have proper form control structure", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const formControls = wrapper.findAll(".form-control");
    expect(formControls).toHaveLength(2);
  });

  it("should have proper separator between inputs", () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: "", to: "" },
      },
    });

    const separator = wrapper.find(".hidden.sm\\:inline");
    expect(separator.exists()).toBe(true);
    expect(separator.text()).toBe("—");
    expect(separator.attributes("aria-hidden")).toBe("true");
  });
});
