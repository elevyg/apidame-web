export function minGuidebookPages(guide: {
  rules: { length: number };
  walls: { length: number };
}) {
  return 1 + (guide.rules.length > 0 ? 1 : 0) + guide.walls.length;
}
