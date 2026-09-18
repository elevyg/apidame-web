import { describe, expect, it } from "vitest";
import { frenchGradeBand, gradeHistogram } from "./gradeHistogram";

describe("frenchGradeBand", () => {
  it("buckets French sport grades by the number", () => {
    expect(frenchGradeBand("5c")).toBe(5);
    expect(frenchGradeBand("6a+")).toBe(6);
    expect(frenchGradeBand("7c+")).toBe(7);
    expect(frenchGradeBand("8a")).toBe(8);
  });

  it("converts Yosemite before bucketing", () => {
    expect(frenchGradeBand("5.10a", "Yosemite")).toBe(6);
    expect(frenchGradeBand("5.13a", "Yosemite")).toBe(8);
  });

  it("drops ungraded and grades outside 5-8", () => {
    expect(frenchGradeBand(null)).toBeNull();
    expect(frenchGradeBand("no grade")).toBeNull();
    expect(frenchGradeBand("4c")).toBeNull();
    expect(frenchGradeBand("9a")).toBeNull();
  });
});

describe("gradeHistogram", () => {
  it("counts only 5tos to 8vos", () => {
    const hist = gradeHistogram([
      { grade: "5c" },
      { grade: "6a" },
      { grade: "6b+" },
      { grade: "7a" },
      { grade: "4c" },
      { grade: null },
    ]);
    expect(hist.total).toBe(4);
    expect(hist.bands.map((band) => band.count)).toEqual([1, 2, 1, 0]);
    expect(hist.bands[1]?.ratio).toBe(1);
    expect(hist.bands[0]?.ratio).toBe(0.5);
  });
});
