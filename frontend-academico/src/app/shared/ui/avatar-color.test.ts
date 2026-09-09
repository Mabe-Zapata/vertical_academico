import { describe, it, expect } from "vitest";
import { avatarColor } from "./avatar-color";

describe("avatarColor", () => {
  it("returns the same color pair for the same name", () => {
    const result1 = avatarColor("Juan");
    const result2 = avatarColor("Juan");
    expect(result1.bg).toBe(result2.bg);
    expect(result1.text).toBe(result2.text);
  });

  it("returns different color pairs for different names", () => {
    const result1 = avatarColor("Ana");
    const result2 = avatarColor("Carlos");
    // At minimum, one of the properties should differ
    const areDifferent = result1.bg !== result2.bg || result1.text !== result2.text;
    expect(areDifferent).toBe(true);
  });

  it("returns default colors for empty string", () => {
    const result = avatarColor("");
    expect(result.bg).toBe("bg-blue-100");
    expect(result.text).toBe("text-blue-700");
  });

  it("returns default colors for null/undefined name", () => {
    const resultNull = avatarColor(null as unknown as string);
    const resultUndefined = avatarColor(undefined as unknown as string);
    expect(resultNull.bg).toBe("bg-blue-100");
    expect(resultNull.text).toBe("text-blue-700");
    expect(resultUndefined.bg).toBe("bg-blue-100");
    expect(resultUndefined.text).toBe("text-blue-700");
  });

  it("returns one of the 6 palette colors for valid names", () => {
    const validBgColors = [
      "bg-blue-100",
      "bg-cyan-100",
      "bg-emerald-100",
      "bg-violet-100",
      "bg-rose-100",
      "bg-amber-100",
    ];
    const result = avatarColor("TestName");
    expect(validBgColors).toContain(result.bg);
  });

  it("uses hash-based distribution for different names", () => {
    // Test that hash distribution works by checking multiple names don't all get same color
    const results = new Set();
    const names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"];
    for (const name of names) {
      results.add(avatarColor(name).bg);
    }
    // With 6 colors and 8 names, we should see at least 2 different colors
    expect(results.size).toBeGreaterThan(1);
  });
});
