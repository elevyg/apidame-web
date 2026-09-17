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

export function pointerRadius(routeStrokeWidth: number, scale = 1): number {
  return Math.max(90, 100 * routeStrokeWidth) * scale;
}

export function pointerRingWidth(radius: number): number {
  return radius / 5;
}

export function downArrowPath(radius: number): string {
  const s = radius * 0.42;
  return `M 0 ${-s * 0.9} V ${s * 0.15} M ${-s * 0.58} ${s * 0.02} L 0 ${s * 0.78} L ${s * 0.58} ${s * 0.02}`;
}
