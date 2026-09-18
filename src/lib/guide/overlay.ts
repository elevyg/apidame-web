import type { Point } from "../climbing/path";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function cropAroundPaths(
  points: Point[],
  imageWidth: number,
  imageHeight: number,
  padRatio = 0.18,
): Rect {
  const full = { x: 0, y: 0, width: imageWidth, height: imageHeight };
  if (points.length === 0 || imageWidth <= 0 || imageHeight <= 0) return full;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  const boxW = Math.max(1, maxX - minX);
  const boxH = Math.max(1, maxY - minY);
  const padX = Math.max(boxW * padRatio, imageWidth * 0.045);
  const padY = Math.max(boxH * padRatio, imageHeight * 0.045);
  let x = minX - padX;
  let y = minY - padY;
  let width = boxW + padX * 2;
  let height = boxH + padY * 2;
  if (x < 0) {
    width += x;
    x = 0;
  }
  if (y < 0) {
    height += y;
    y = 0;
  }
  if (x + width > imageWidth) width = imageWidth - x;
  if (y + height > imageHeight) height = imageHeight - y;

  const coverage = (width * height) / (imageWidth * imageHeight);
  if (coverage > 0.82) return full;
  return { x, y, width, height };
}

export function pixelCrop(
  rect: Rect,
  imageWidth: number,
  imageHeight: number,
): Rect {
  if (imageWidth <= 0 || imageHeight <= 0) {
    return { x: 0, y: 0, width: 1, height: 1 };
  }
  let x = Math.max(0, Math.floor(rect.x));
  let y = Math.max(0, Math.floor(rect.y));
  if (x >= imageWidth) x = 0;
  if (y >= imageHeight) y = 0;
  const width = Math.max(1, Math.min(imageWidth - x, Math.ceil(rect.width)));
  const height = Math.max(1, Math.min(imageHeight - y, Math.ceil(rect.height)));
  return { x, y, width, height };
}

export function coverCrop(
  sourceWidth: number,
  sourceHeight: number,
  destWidth: number,
  destHeight: number,
): Rect {
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    return { x: 0, y: 0, width: destWidth, height: destHeight };
  }
  const scale = Math.max(destWidth / sourceWidth, destHeight / sourceHeight);
  const cropW = destWidth / scale;
  const cropH = destHeight / scale;
  return {
    x: (sourceWidth - cropW) / 2,
    y: (sourceHeight - cropH) / 2,
    width: cropW,
    height: cropH,
  };
}

export function mapCanvasRect(
  rect: Rect,
  canvasWidth: number,
  canvasHeight: number,
  bitmapWidth: number,
  bitmapHeight: number,
): Rect {
  if (canvasWidth <= 0 || canvasHeight <= 0) return rect;
  return {
    x: rect.x * (bitmapWidth / canvasWidth),
    y: rect.y * (bitmapHeight / canvasHeight),
    width: rect.width * (bitmapWidth / canvasWidth),
    height: rect.height * (bitmapHeight / canvasHeight),
  };
}

export function agreementRank(level: string): number {
  if (level === "Critical") return 0;
  if (level === "Important") return 1;
  return 2;
}
