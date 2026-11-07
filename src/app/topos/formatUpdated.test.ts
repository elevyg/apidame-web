import { describe, expect, it } from "vitest";
import { formatUpdated } from "./formatUpdated";

describe("formatUpdated", () => {
  it("formats a Drive timestamp as a Spanish short date", () => {
    expect(formatUpdated("2026-02-25T11:54:49.450Z")).toBe("25 feb 2026");
    expect(formatUpdated("2024-11-27T18:39:08.204Z")).toBe("27 nov 2024");
  });

  it("uses the Santiago calendar day", () => {
    expect(formatUpdated("2025-01-01T02:00:00.000Z")).toBe("31 dic 2024");
  });

  it("falls back when the date is missing or invalid", () => {
    expect(formatUpdated(null)).toBe("Actualización reciente");
    expect(formatUpdated("not a date")).toBe("Actualización reciente");
  });
});
