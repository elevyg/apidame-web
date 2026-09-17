export const FRENCH_GRADE_SYSTEM = "French";

const YDS_LETTERS: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };

const YDS_BAND: Record<number, readonly [string, string, string, string]> = {
  10: ["6a", "6a+", "6b", "6b+"],
  11: ["6c", "6c+", "7a", "7a+"],
  12: ["7b", "7b+", "7c", "7c+"],
  13: ["8a", "8a+", "8b", "8b+"],
  14: ["8c", "8c+", "9a", "9a+"],
  15: ["9b", "9b+", "9c", "9c"],
};

const YDS_SINGLE: Record<number, string> = {
  3: "4a",
  4: "4a",
  5: "4b",
  6: "4c",
  7: "5a",
  8: "5b",
  9: "5c",
};

export function toFrenchGrade(
  grade: string | null | undefined,
  system?: string | null,
): string | null {
  if (grade == null) return null;
  const trimmed = grade.trim();
  if (!trimmed || /^no grade$/i.test(trimmed)) return null;

  const sys = (system ?? "").trim().toLowerCase();
  if (isYosemiteSystem(sys)) {
    return fromYds(trimmed);
  }

  return parseFrench(trimmed) ?? fromYds(trimmed);
}

export function withFrenchGrade<T extends { grade: string | null; gradeSystem: string | null }>(
  route: T,
): T {
  const grade = toFrenchGrade(route.grade, route.gradeSystem);
  return {
    ...route,
    grade,
    gradeSystem: grade ? FRENCH_GRADE_SYSTEM : null,
  };
}

function isYosemiteSystem(system: string): boolean {
  return system === "yosemite" || system === "yds" || system === "usa";
}

function parseFrench(grade: string): string | null {
  const match = grade.toLowerCase().match(/^([3-9])([abc]\+?)$/);
  return match ? `${match[1]}${match[2]}` : null;
}

function fromYds(grade: string): string | null {
  const match = grade.trim().match(/^5\.(\d{1,2})([a-dA-D]|[+\-])?$/);
  if (!match) return null;
  const n = Number(match[1]);
  const suffix = (match[2] ?? "").toLowerCase();

  if (n <= 9) {
    const base = YDS_SINGLE[n];
    if (!base) return null;
    if (suffix === "+") {
      if (n === 9) return "6a";
      return YDS_SINGLE[n + 1] ?? base;
    }
    return base;
  }

  const band = YDS_BAND[n];
  if (!band) return null;
  if (suffix === "+") return band[3];
  if (suffix === "-") return band[0];
  if (suffix in YDS_LETTERS) return band[YDS_LETTERS[suffix] ?? 1];
  return band[1];
}
