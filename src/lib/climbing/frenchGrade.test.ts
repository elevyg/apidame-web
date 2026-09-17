import { describe, expect, it } from "vitest";
import { FRENCH_GRADE_SYSTEM, toFrenchGrade, withFrenchGrade } from "./frenchGrade";

describe("toFrenchGrade", () => {
  it("converts Yosemite sport grades to French", () => {
    expect(toFrenchGrade("5.9", "Yosemite")).toBe("5c");
    expect(toFrenchGrade("5.10a", "Yosemite")).toBe("6a");
    expect(toFrenchGrade("5.10b", "Yosemite")).toBe("6a+");
    expect(toFrenchGrade("5.10c", "Yosemite")).toBe("6b");
    expect(toFrenchGrade("5.10d", "Yosemite")).toBe("6b+");
    expect(toFrenchGrade("5.11a", "Yosemite")).toBe("6c");
    expect(toFrenchGrade("5.11c", "Yosemite")).toBe("7a");
    expect(toFrenchGrade("5.12a", "Yosemite")).toBe("7b");
    expect(toFrenchGrade("5.12b", "Yosemite")).toBe("7b+");
    expect(toFrenchGrade("5.13a", "Yosemite")).toBe("8a");
    expect(toFrenchGrade("5.13b", "Yosemite")).toBe("8a+");
  });

  it("keeps French grades and drops placeholders", () => {
    expect(toFrenchGrade("6a", "French")).toBe("6a");
    expect(toFrenchGrade("7c+", "French")).toBe("7c+");
    expect(toFrenchGrade("no grade", "French")).toBeNull();
    expect(toFrenchGrade(null, "French")).toBeNull();
    expect(toFrenchGrade("12", "French")).toBeNull();
    expect(toFrenchGrade("20", "French")).toBeNull();
  });

  it("detects Yosemite even if the system is missing or wrong", () => {
    expect(toFrenchGrade("5.10c")).toBe("6b");
    expect(toFrenchGrade("5.11d", "French")).toBe("7a+");
  });
});

describe("withFrenchGrade", () => {
  it("rewrites the stored system to French", () => {
    expect(
      withFrenchGrade({
        grade: "5.12a",
        gradeSystem: "Yosemite",
      }),
    ).toEqual({
      grade: "7b",
      gradeSystem: FRENCH_GRADE_SYSTEM,
    });
  });
});
