import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LineCapStyle, PDFDocument, rgb } from "pdf-lib";
import type { PDFFont, PDFImage, PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import sharp from "sharp";
import { pdfImageUrl } from "@/lib/climbing/cloudinary";
import {
  fitDiscLabelSize,
  parsePath,
  pdfPointerRadius,
  pointerRingWidth,
  strokeWidthPx,
} from "@/lib/climbing/path";
import { routeColor } from "@/lib/climbing/colors";
import { toFrenchGrade } from "@/lib/climbing/frenchGrade";
import { fetchStaticMap } from "./mapbox";
import { buildZoneMapView, PDF_MAP_SIZE } from "./mapView";
import { zoneToMapInput } from "./zoneMap";
import {
  fitRect,
  formatGuideDate,
  sanitizePdfText,
  wrapMeasured,
} from "./layout";
import type { getWallGuide, getZoneBySlug } from "./queries";

const PAGE_W = 420;
const PAGE_H = 844;
const MARGIN = 28;
const INK = rgb(28 / 255, 25 / 255, 22 / 255);
const MUTED = rgb(90 / 255, 85 / 255, 80 / 255);
const PAPER = rgb(1, 1, 1);
const BEIGE = rgb(232 / 255, 226 / 255, 212 / 255);
const CANVAS = rgb(18 / 255, 17 / 255, 15 / 255);
const RULE = rgb(28 / 255, 25 / 255, 22 / 255);
const SIGNAL = rgb(156 / 255, 59 / 255, 30 / 255);
const LOGO_W = 22;
const LOGO_H = 20;

type ZoneGuide = NonNullable<Awaited<ReturnType<typeof getZoneBySlug>>>;
type WallGuide = NonNullable<Awaited<ReturnType<typeof getWallGuide>>>;
type GuideFonts = {
  body: PDFFont;
  bold: PDFFont;
};

let logoPngCache: Uint8Array | null = null;

async function loadLogoPng(): Promise<Uint8Array> {
  if (logoPngCache) return logoPngCache;
  const svg = await readFile(
    join(process.cwd(), "src/assets/svgs/icon-solo.svg"),
  );
  logoPngCache = new Uint8Array(
    await sharp(svg).resize(120, 112).png().toBuffer(),
  );
  return logoPngCache;
}

async function embedRaster(pdf: PDFDocument, bytes: Uint8Array) {
  try {
    return await pdf.embedJpg(bytes);
  } catch {
    try {
      return await pdf.embedPng(bytes);
    } catch {
      return null;
    }
  }
}

async function embedPhoto(pdf: PDFDocument, url: string) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return embedRaster(pdf, new Uint8Array(await response.arrayBuffer()));
}

async function loadFonts(pdf: PDFDocument): Promise<GuideFonts> {
  pdf.registerFontkit(fontkit);
  const dir = join(process.cwd(), "src/assets/fonts");
  const [regular, bold] = await Promise.all([
    readFile(join(dir, "LiberationSans-Regular.ttf")),
    readFile(join(dir, "LiberationSans-Bold.ttf")),
  ]);
  return {
    body: await pdf.embedFont(regular, { subset: true }),
    bold: await pdf.embedFont(bold, { subset: true }),
  };
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const n = Number.parseInt(value.slice(0, 6), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

async function drawHeaderBand(
  page: PDFPage,
  fonts: GuideFonts,
  logo: PDFImage,
) {
  page.drawRectangle({
    x: 0,
    y: PAGE_H - 64,
    width: PAGE_W,
    height: 64,
    color: BEIGE,
  });
  page.drawImage(logo, {
    x: MARGIN,
    y: PAGE_H - 42,
    width: LOGO_W,
    height: LOGO_H,
  });
  page.drawText("CHILE CHICO", {
    x: PAGE_W - MARGIN - fonts.body.widthOfTextAtSize("CHILE CHICO", 8),
    y: PAGE_H - 36,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  page.drawRectangle({
    x: 0,
    y: PAGE_H - 65,
    width: PAGE_W,
    height: 1,
    color: RULE,
  });
}

function drawFooter(page: PDFPage, fonts: GuideFonts, generatedAt: Date) {
  page.drawRectangle({
    x: MARGIN,
    y: 28,
    width: PAGE_W - MARGIN * 2,
    height: 0.6,
    color: RULE,
  });
  page.drawText(sanitizePdfText(`Generado ${formatGuideDate(generatedAt)}`), {
    x: MARGIN,
    y: 16,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  page.drawText("Chile Chico", {
    x: PAGE_W - MARGIN - fonts.body.widthOfTextAtSize("Chile Chico", 8),
    y: 16,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
}

function drawDownArrow(
  page: PDFPage,
  cx: number,
  cy: number,
  radius: number,
  color: ReturnType<typeof rgb>,
  thickness: number,
) {
  const s = radius * 0.42;
  page.drawLine({
    start: { x: cx, y: cy + s * 0.9 },
    end: { x: cx, y: cy - s * 0.15 },
    thickness,
    color,
    lineCap: LineCapStyle.Round,
  });
  page.drawLine({
    start: { x: cx - s * 0.58, y: cy - s * 0.02 },
    end: { x: cx, y: cy - s * 0.78 },
    thickness,
    color,
    lineCap: LineCapStyle.Round,
  });
  page.drawLine({
    start: { x: cx + s * 0.58, y: cy - s * 0.02 },
    end: { x: cx, y: cy - s * 0.78 },
    thickness,
    color,
    lineCap: LineCapStyle.Round,
  });
}

function drawStartDisc(
  page: PDFPage,
  fonts: GuideFonts,
  cx: number,
  cy: number,
  radius: number,
  color: ReturnType<typeof rgb>,
  label: string,
) {
  const ring = pointerRingWidth(radius);
  page.drawCircle({ x: cx, y: cy, size: radius, color: PAPER });
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius,
    borderColor: color,
    borderWidth: ring,
  });
  const size = fitDiscLabelSize(label, radius, (fontSize) =>
    fonts.bold.widthOfTextAtSize(label, fontSize),
  );
  const textW = fonts.bold.widthOfTextAtSize(label, size);
  page.drawText(label, {
    x: cx - textW / 2,
    y: cy - size * 0.35,
    size,
    font: fonts.bold,
    color,
  });
}

function drawEndDisc(
  page: PDFPage,
  cx: number,
  cy: number,
  radius: number,
  color: ReturnType<typeof rgb>,
) {
  const ring = pointerRingWidth(radius);
  page.drawCircle({ x: cx, y: cy, size: radius, color: PAPER });
  page.drawCircle({
    x: cx,
    y: cy,
    size: radius,
    borderColor: color,
    borderWidth: ring,
  });
  drawDownArrow(page, cx, cy, radius, color, ring);
}

export async function buildZoneCoverPdf(
  guide: ZoneGuide,
  generatedAt = new Date(),
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const fonts = await loadFonts(pdf);
  const logo = await pdf.embedPng(await loadLogoPng());
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });
  await drawHeaderBand(page, fonts, logo);

  let y = PAGE_H - 108;
  page.drawText("DEPORTIVA", {
    x: MARGIN,
    y,
    size: 9,
    font: fonts.body,
    color: MUTED,
  });
  y -= 36;
  const title = sanitizePdfText(guide.zone.name);
  page.drawText(title, {
    x: MARGIN,
    y,
    size: 28,
    font: fonts.bold,
    color: INK,
  });
  y -= 28;
  page.drawRectangle({
    x: MARGIN,
    y: y + 10,
    width: 48,
    height: 1,
    color: RULE,
  });
  y -= 8;

  const description = sanitizePdfText(guide.zone.description ?? "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const maxWidth = PAGE_W - MARGIN * 2;
  for (const paragraph of description) {
    const lines = wrapMeasured(paragraph, maxWidth, (line) =>
      fonts.body.widthOfTextAtSize(line, 11),
    );
    for (const line of lines) {
      y -= 16;
      if (y < 160) break;
      page.drawText(line, {
        x: MARGIN,
        y,
        size: 11,
        font: fonts.body,
        color: INK,
      });
    }
    y -= 10;
  }

  y -= 12;
  page.drawText("PAREDES", {
    x: MARGIN,
    y,
    size: 9,
    font: fonts.body,
    color: MUTED,
  });
  y -= 8;
  for (const sector of guide.sectors) {
    const sectorWalls = guide.walls.filter((wall) => wall.sectorId === sector.id);
    for (const wall of sectorWalls) {
      y -= 18;
      if (y < 56) break;
      page.drawText(
        sanitizePdfText(`${sector.name}  ·  ${wall.name}`),
        {
          x: MARGIN,
          y,
          size: 11,
          font: fonts.bold,
          color: INK,
        },
      );
    }
  }

  drawFooter(page, fonts, generatedAt);
  await drawZoneMapPage(pdf, fonts, logo, guide, generatedAt);
  return pdf.save();
}

async function drawZoneMapPage(
  pdf: PDFDocument,
  fonts: GuideFonts,
  logo: PDFImage,
  guide: ZoneGuide,
  generatedAt: Date,
) {
  const view = buildZoneMapView(zoneToMapInput(guide), PDF_MAP_SIZE);
  if (!view) return;
  const image = await fetchStaticMap({
    center: view.center,
    zoom: view.zoom,
    width: view.width,
    height: view.height,
  });
  if (!image) return;

  const page = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: PAGE_H,
    color: PAPER,
  });
  await drawHeaderBand(page, fonts, logo);

  let y = PAGE_H - 96;
  page.drawText("MAPA", {
    x: MARGIN,
    y,
    size: 9,
    font: fonts.body,
    color: MUTED,
  });
  y -= 22;
  page.drawText("Sectores y paredes", {
    x: MARGIN,
    y,
    size: 16,
    font: fonts.bold,
    color: INK,
  });

  const mapW = view.width;
  const mapH = view.height;
  const mapX = MARGIN;
  const mapY = PAGE_H - 148 - mapH;
  const photo = await embedRaster(pdf, image.bytes);
  page.drawRectangle({
    x: mapX,
    y: mapY,
    width: mapW,
    height: mapH,
    color: CANVAS,
  });
  if (photo) {
    page.drawImage(photo, {
      x: mapX,
      y: mapY,
      width: mapW,
      height: mapH,
    });
  }
  for (const pin of view.pins) {
    drawStartDisc(
      page,
      fonts,
      mapX + pin.x,
      mapY + (mapH - pin.y),
      8,
      SIGNAL,
      String(pin.number),
    );
  }

  y = mapY - 24;
  page.drawText("SECTORES", {
    x: MARGIN,
    y,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  for (const pin of view.pins) {
    y -= 26;
    if (y < 56) break;
    drawStartDisc(
      page,
      fonts,
      MARGIN + 8,
      y + 4,
      7,
      SIGNAL,
      String(pin.number),
    );
    const walls = pin.walls.map((wall) => wall.name).join(" · ");
    page.drawText(sanitizePdfText(pin.name).slice(0, 36), {
      x: MARGIN + 22,
      y: y + (walls ? 6 : 0),
      size: 10,
      font: fonts.bold,
      color: INK,
    });
    if (walls) {
      page.drawText(sanitizePdfText(walls).slice(0, 42), {
        x: MARGIN + 22,
        y,
        size: 8,
        font: fonts.body,
        color: MUTED,
      });
    }
  }

  page.drawText("Mapa (c) Mapbox (c) OpenStreetMap", {
    x: MARGIN,
    y: 40,
    size: 7,
    font: fonts.body,
    color: MUTED,
  });
  drawFooter(page, fonts, generatedAt);
}

export async function buildWallPdf(
  guide: WallGuide,
  generatedAt = new Date(),
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const fonts = await loadFonts(pdf);
  const logo = await pdf.embedPng(await loadLogoPng());
  const orderedTopos = [...guide.topos].sort((a, b) => {
    if (a.main === b.main) return a.position - b.position;
    return a.main ? -1 : 1;
  });
  const pages = orderedTopos.length > 0 ? orderedTopos : [null];
  for (const topo of pages) {
    await drawWallPage(pdf, fonts, logo, {
      zoneName: guide.zone.name,
      sectorName: guide.sector.name,
      wallName: guide.wall.name,
      topo,
      routes: guide.routes,
      paths: topo
        ? guide.paths.filter((path) => path.topoId === topo.id)
        : [],
      generatedAt,
    });
  }
  return pdf.save();
}

export async function mergePdfBuffers(parts: Uint8Array[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const part of parts) {
    const doc = await PDFDocument.load(part);
    const copied = await out.copyPages(doc, doc.getPageIndices());
    for (const page of copied) out.addPage(page);
  }
  return out.save();
}

async function drawWallPage(
  pdf: PDFDocument,
  fonts: GuideFonts,
  logo: PDFImage,
  input: {
    zoneName: string;
    sectorName: string;
    wallName: string;
    topo: ZoneGuide["topos"][number] | null;
    routes: ZoneGuide["routes"];
    paths: WallGuide["paths"];
    generatedAt: Date;
  },
) {
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });
  await drawHeaderBand(page, fonts, logo);

  let y = PAGE_H - 88;
  page.drawText(sanitizePdfText(input.zoneName.toUpperCase()), {
    x: MARGIN,
    y,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  y -= 22;
  page.drawText(
    sanitizePdfText(`${input.sectorName}  ·  ${input.wallName}`),
    {
      x: MARGIN,
      y,
      size: 16,
      font: fonts.bold,
      color: INK,
    },
  );

  const legendH = Math.min(240, 36 + input.routes.length * 20);
  const imageMaxH = PAGE_H - 150 - legendH;
  const imageMaxW = PAGE_W - MARGIN * 2;
  let imageBottom = PAGE_H - 128 - imageMaxH;

  if (input.topo) {
    const photo = await embedPhoto(
      pdf,
      pdfImageUrl({
        url: input.topo.imageUrl,
        publicId: input.topo.imagePublicId,
      }),
    );
    const srcW = input.topo.imageWidth ?? photo?.width ?? 1000;
    const srcH = input.topo.imageHeight ?? photo?.height ?? 1000;
    const fitted = fitRect(srcW, srcH, imageMaxW, imageMaxH);
    const imgX = (PAGE_W - fitted.width) / 2;
    const imgY = PAGE_H - 122 - fitted.height;
    imageBottom = imgY;
    page.drawRectangle({
      x: MARGIN,
      y: imgY - 8,
      width: imageMaxW,
      height: fitted.height + 16,
      color: CANVAS,
    });
    if (photo) {
      page.drawImage(photo, {
        x: imgX,
        y: imgY,
        width: fitted.width,
        height: fitted.height,
      });
    }
    const scale = fitted.width / srcW;
    const line = Math.max(1.4, strokeWidthPx(input.topo.routeStrokeWidth, scale) * 0.45);
    const markerR = pdfPointerRadius(input.topo.routeStrokeWidth, scale);
    for (const path of input.paths) {
      const points = parsePath(path.path);
      if (points.length < 2) continue;
      const route = input.routes.find((item) => item.id === path.routeId);
      const color = hexToRgb(routeColor(route?.kind ?? "Sport"));
      for (let i = 1; i < points.length; i += 1) {
        const from = points[i - 1];
        const to = points[i];
        if (!from || !to) continue;
        page.drawLine({
          start: {
            x: imgX + from.x * scale,
            y: imgY + (srcH - from.y) * scale,
          },
          end: {
            x: imgX + to.x * scale,
            y: imgY + (srcH - to.y) * scale,
          },
          thickness: line,
          color,
          lineCap: LineCapStyle.Round,
        });
      }
      const start = points[0];
      const end = points[points.length - 1];
      if (start && route && !path.hideStart) {
        drawStartDisc(
          page,
          fonts,
          imgX + start.x * scale,
          imgY + (srcH - start.y) * scale,
          markerR,
          color,
          String(route.position),
        );
      }
      if (end) {
        drawEndDisc(
          page,
          imgX + end.x * scale,
          imgY + (srcH - end.y) * scale,
          markerR,
          color,
        );
      }
    }
  }

  let legendY = imageBottom - 22;
  page.drawText("RUTAS", {
    x: MARGIN,
    y: legendY,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  for (const route of input.routes) {
    legendY -= 20;
    if (legendY < 44) break;
    const color = hexToRgb(routeColor(route.kind));
    drawStartDisc(
      page,
      fonts,
      MARGIN + 8,
      legendY + 4,
      7,
      color,
      String(route.position),
    );
    const grade = toFrenchGrade(route.grade, route.gradeSystem);
    const label = sanitizePdfText(
      `${route.name}${grade ? `   ${grade}` : ""}`,
    );
    page.drawText(label.slice(0, 42), {
      x: MARGIN + 22,
      y: legendY,
      size: 10,
      font: fonts.body,
      color: INK,
    });
  }

  drawFooter(page, fonts, input.generatedAt);
}
