export type Point = {
  x: number;
  y: number;
};

export function parsePath(path: string | null | undefined): Point[] {
  if (!path) return [];
  return path
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(","))
    .map(([x, y]) => ({ x: Number(x), y: Number(y) }))
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
}

export function serializePath(points: Point[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export function pathToSvgPoints(points: Point[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export function parsePoint(
  value: string | null | undefined,
): Point | null {
  if (!value) return null;
  const [x, y] = value.split(",").map(Number);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

export function strokeWidthPx(routeStrokeWidth: number, scale = 1): number {
  return 21.5 * scale * routeStrokeWidth;
}
