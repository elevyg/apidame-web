export type GeoPoint = {
  lat: number;
  lng: number;
};

const TILE = 256;

export function webMercator(point: GeoPoint, zoom: number) {
  const n = 2 ** zoom;
  const x = ((point.lng + 180) / 360) * n * TILE;
  const latRad = (point.lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    n *
    TILE;
  return { x, y };
}

export function projectToImage(
  point: GeoPoint,
  center: GeoPoint,
  zoom: number,
  width: number,
  height: number,
) {
  const projected = webMercator(point, zoom);
  const origin = webMercator(center, zoom);
  return {
    x: width / 2 + (projected.x - origin.x),
    y: height / 2 + (projected.y - origin.y),
  };
}

export function boundsCenter(points: GeoPoint[]): GeoPoint {
  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  return {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
  };
}

export function fitView(
  points: GeoPoint[],
  width: number,
  height: number,
  padding = 56,
  minZoom = 11,
  maxZoom = 16.5,
) {
  if (points.length === 0) {
    throw new Error("fitView needs at least one point");
  }
  const center = boundsCenter(points);
  if (points.length === 1) {
    return { center, zoom: 15 };
  }

  let low = minZoom;
  let high = maxZoom;
  let best = minZoom;
  for (let i = 0; i < 22; i += 1) {
    const mid = (low + high) / 2;
    const fits = points.every((point) => {
      const { x, y } = projectToImage(point, center, mid, width, height);
      return (
        x >= padding &&
        y >= padding &&
        x <= width - padding &&
        y <= height - padding
      );
    });
    if (fits) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }
  return { center, zoom: Math.round(best * 100) / 100 };
}

export function separatePins<T extends { x: number; y: number }>(
  pins: T[],
  minDist: number,
  width: number,
  height: number,
  padding: number,
): T[] {
  const out = pins.map((pin) => ({ ...pin }));
  for (let iter = 0; iter < 48; iter += 1) {
    let moved = false;
    for (let i = 0; i < out.length; i += 1) {
      for (let j = i + 1; j < out.length; j += 1) {
        const a = out[i];
        const b = out[j];
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        if (dist >= minDist) continue;
        const push = (minDist - dist) / 2;
        const ux = dx / dist;
        const uy = dy / dist;
        a.x -= ux * push;
        a.y -= uy * push;
        b.x += ux * push;
        b.y += uy * push;
        moved = true;
      }
    }
    for (const pin of out) {
      pin.x = Math.min(width - padding, Math.max(padding, pin.x));
      pin.y = Math.min(height - padding, Math.max(padding, pin.y));
    }
    if (!moved) break;
  }
  return out;
}
