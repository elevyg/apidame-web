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
  pointerRingWidth,
  scaledPointerRadius,
  strokeWidthPx,
} from "@/lib/climbing/path";
import { routeColor } from "@/lib/climbing/colors";
import { toFrenchGrade } from "@/lib/climbing/frenchGrade";
import { fetchStaticMap } from "./mapbox";
import { buildZoneMapView, PDF_MAP_SIZE } from "./mapView";
import { zoneToMapInput } from "./zoneMap";
import { rasterizeAgreementIcon } from "./agreementIcons";
import {
  coverCrop,
  cropAroundPaths,
  mapCanvasRect,
  pixelCrop,
} from "./overlay";
import {
  fitRect,
  fitTextSize,
  formatGuideDate,
  sanitizePdfText,
  wrapMeasured,
} from "./layout";
import type { getZoneBySlug } from "./queries";

const PAGE_W = 420;
const PAGE_H = 844;
const MARGIN = 22;
const INK = rgb(28 / 255, 25 / 255, 22 / 255);
const MUTED = rgb(90 / 255, 85 / 255, 80 / 255);
const PAPER = rgb(1, 1, 1);
const BEIGE = rgb(232 / 255, 226 / 255, 212 / 255);
const CANVAS = rgb(18 / 255, 17 / 255, 15 / 255);
const RULE = rgb(28 / 255, 25 / 255, 22 / 255);
const SIGNAL = rgb(156 / 255, 59 / 255, 30 / 255);
const CREAM = rgb(248 / 255, 244 / 255, 234 / 255);
const LOGO_W = 22;
const LOGO_H = 20;

type ZoneGuide = NonNullable<Awaited<ReturnType<typeof getZoneBySlug>>>;
type GuideFonts = {
  body: PDFFont;
  bold: PDFFont;
};
type GuideRule = ZoneGuide["rules"][number];

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

async function fetchImageBytes(url: string) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return new Uint8Array(await response.arrayBuffer());
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

function drawFooter(page: PDFPage, fonts: GuideFonts, generatedAt: Date) {
  page.drawText(sanitizePdfText(`Generado ${formatGuideDate(generatedAt)}`), {
    x: MARGIN,
    y: 14,
    size: 7,
    font: fonts.body,
    color: MUTED,
  });
  page.drawText("Chile Chico", {
    x: PAGE_W - MARGIN - fonts.body.widthOfTextAtSize("Chile Chico", 7),
    y: 14,
    size: 7,
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

function drawStars(
  page: PDFPage,
  x: number,
  y: number,
  average: number,
) {
  const size = 5.2;
  const gap = 6.4;
  for (let i = 0; i < 5; i += 1) {
    const cx = x + i * gap;
    const fill = average >= i + 0.75;
    const half = !fill && average >= i + 0.25;
    page.drawRectangle({
      x: cx,
      y,
      width: size,
      height: size,
      color: fill ? SIGNAL : CREAM,
      borderColor: SIGNAL,
      borderWidth: 0.6,
    });
    if (half) {
      page.drawRectangle({
        x: cx,
        y,
        width: size / 2,
        height: size,
        color: SIGNAL,
      });
    }
  }
}

async function drawCoverPage(
  pdf: PDFDocument,
  fonts: GuideFonts,
  logo: PDFImage,
  guide: ZoneGuide,
  generatedAt: Date,
) {
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: CANVAS });

  if (guide.zone.coverImageUrl) {
    const bytes = await fetchImageBytes(
      pdfImageUrl({
        url: guide.zone.coverImageUrl,
        publicId: guide.zone.coverPublicId,
      }),
    );
    if (bytes) {
      const meta = await sharp(bytes).metadata();
      const srcW = meta.width ?? guide.zone.coverImageWidth ?? PAGE_W;
      const srcH = meta.height ?? guide.zone.coverImageHeight ?? PAGE_H;
      const crop = pixelCrop(coverCrop(srcW, srcH, PAGE_W, PAGE_H), srcW, srcH);
      const cropped = new Uint8Array(
        await sharp(bytes)
          .extract({
            left: crop.x,
            top: crop.y,
            width: crop.width,
            height: crop.height,
          })
          .resize(PAGE_W * 2, PAGE_H * 2)
          .jpeg({ quality: 72 })
          .toBuffer(),
      );
      const photo = await embedRaster(pdf, cropped);
      if (photo) {
        page.drawImage(photo, {
          x: 0,
          y: 0,
          width: PAGE_W,
          height: PAGE_H,
        });
      }
    }
  }

  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: PAGE_H,
    color: rgb(0, 0, 0),
    opacity: 0.28,
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: 320,
    color: rgb(0, 0, 0),
    opacity: 0.55,
  });

  page.drawImage(logo, {
    x: MARGIN,
    y: PAGE_H - 42,
    width: LOGO_W,
    height: LOGO_H,
  });
  page.drawText("CHILE CHICO", {
    x: PAGE_W - MARGIN - fonts.body.widthOfTextAtSize("CHILE CHICO", 8),
    y: PAGE_H - 34,
    size: 8,
    font: fonts.body,
    color: CREAM,
  });

  const chips = guide.rules.slice(0, 6);
  const title = sanitizePdfText(guide.zone.name);
  const titleSize = fitTextSize(
    title,
    PAGE_W - MARGIN * 2,
    34,
    18,
    (size) => fonts.bold.widthOfTextAtSize(title, size),
  );
  let y = 48 + chips.length * 28;
  page.drawText("DEPORTIVA", {
    x: MARGIN,
    y: y + titleSize + 16,
    size: 8,
    font: fonts.body,
    color: CREAM,
  });
  page.drawText(title, {
    x: MARGIN,
    y: y + 8,
    size: titleSize,
    font: fonts.bold,
    color: PAPER,
  });

  y = 40;
  for (const rule of chips) {
    const iconBytes = await rasterizeAgreementIcon(rule.icon, 48);
    if (iconBytes) {
      const icon = await pdf.embedPng(iconBytes);
      page.drawImage(icon, {
        x: MARGIN,
        y: y - 4,
        width: 16,
        height: 16,
      });
    }
    page.drawText(sanitizePdfText(rule.title).slice(0, 36), {
      x: MARGIN + 22,
      y,
      size: 10,
      font: fonts.bold,
      color: PAPER,
    });
    y += 28;
  }

  page.drawText(sanitizePdfText(`Generado ${formatGuideDate(generatedAt)}`), {
    x: MARGIN,
    y: 14,
    size: 7,
    font: fonts.body,
    color: CREAM,
  });
}

async function drawZoneMapPage(
  pdf: PDFDocument,
  fonts: GuideFonts,
  guide: ZoneGuide,
  generatedAt: Date,
) {
  const view = buildZoneMapView(zoneToMapInput(guide), PDF_MAP_SIZE, {
    separatePins: false,
  });
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

  let y = PAGE_H - 48;
  page.drawText("COMO LLEGAR", {
    x: MARGIN,
    y,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  y -= 22;
  page.drawText(sanitizePdfText(guide.zone.name), {
    x: MARGIN,
    y,
    size: 18,
    font: fonts.bold,
    color: INK,
  });

  const mapW = view.width;
  const mapH = view.height;
  const mapX = MARGIN;
  const mapY = PAGE_H - 118 - mapH;
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
      7,
      SIGNAL,
      String(pin.number),
    );
  }

  y = mapY - 28;
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

async function drawRulesPage(
  pdf: PDFDocument,
  fonts: GuideFonts,
  rules: GuideRule[],
  generatedAt: Date,
) {
  if (rules.length === 0) return;
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });
  let y = PAGE_H - 48;
  page.drawText("ACUERDOS", {
    x: MARGIN,
    y,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  y -= 24;
  page.drawText("Reglas del lugar", {
    x: MARGIN,
    y,
    size: 18,
    font: fonts.bold,
    color: INK,
  });
  y -= 12;
  for (const rule of rules) {
    y -= 36;
    if (y < 80) break;
    const iconBytes = await rasterizeAgreementIcon(rule.icon, 72);
    if (iconBytes) {
      const icon = await pdf.embedPng(iconBytes);
      page.drawImage(icon, {
        x: MARGIN,
        y: y - 2,
        width: 22,
        height: 22,
      });
    }
    page.drawText(sanitizePdfText(rule.title), {
      x: MARGIN + 30,
      y: y + 6,
      size: 11,
      font: fonts.bold,
      color: INK,
    });
    const detail = sanitizePdfText(rule.comment || rule.description);
    const lines = wrapMeasured(detail, PAGE_W - MARGIN * 2 - 30, (line) =>
      fonts.body.widthOfTextAtSize(line, 9),
    );
    y -= 4;
    for (const line of lines.slice(0, 4)) {
      y -= 13;
      page.drawText(line, {
        x: MARGIN + 30,
        y,
        size: 9,
        font: fonts.body,
        color: MUTED,
      });
    }
    y -= 8;
  }
  drawFooter(page, fonts, generatedAt);
}

async function drawWallPage(
  pdf: PDFDocument,
  fonts: GuideFonts,
  input: {
    zoneName: string;
    sectorName: string;
    wallName: string;
    topo: ZoneGuide["topos"][number] | null;
    routes: ZoneGuide["routes"];
    paths: ZoneGuide["paths"];
    generatedAt: Date;
  },
) {
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });

  let y = PAGE_H - 36;
  page.drawText(sanitizePdfText(input.zoneName.toUpperCase()), {
    x: MARGIN,
    y,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  y -= 20;
  page.drawText(
    sanitizePdfText(`${input.sectorName}  ·  ${input.wallName}`),
    {
      x: MARGIN,
      y,
      size: 15,
      font: fonts.bold,
      color: INK,
    },
  );

  const legendH = Math.min(260, 32 + input.routes.length * 22);
  const imageMaxH = PAGE_H - 118 - legendH;
  const imageMaxW = PAGE_W - MARGIN * 2;
  let imageBottom = PAGE_H - 96 - imageMaxH;

  if (input.topo) {
    const raw = await fetchImageBytes(
      pdfImageUrl({
        url: input.topo.imageUrl,
        publicId: input.topo.imagePublicId,
      }),
    );
    const meta = raw ? await sharp(raw).metadata() : null;
    const canvasW = input.topo.imageWidth ?? meta?.width ?? 1000;
    const canvasH = input.topo.imageHeight ?? meta?.height ?? 1000;
    const bitmapW = meta?.width ?? canvasW;
    const bitmapH = meta?.height ?? canvasH;
    const allPoints = input.paths.flatMap((path) => parsePath(path.path));
    let cropCanvas = cropAroundPaths(allPoints, canvasW, canvasH);
    const extract = pixelCrop(
      mapCanvasRect(cropCanvas, canvasW, canvasH, bitmapW, bitmapH),
      bitmapW,
      bitmapH,
    );
    let photoBytes = raw;
    const cropped =
      extract.x !== 0 ||
      extract.y !== 0 ||
      extract.width !== bitmapW ||
      extract.height !== bitmapH;
    if (raw && cropped && extract.width > 0 && extract.height > 0) {
      try {
        photoBytes = new Uint8Array(
          await sharp(raw)
            .extract({
              left: extract.x,
              top: extract.y,
              width: extract.width,
              height: extract.height,
            })
            .jpeg({ quality: 74 })
            .toBuffer(),
        );
      } catch {
        photoBytes = raw;
        cropCanvas = { x: 0, y: 0, width: canvasW, height: canvasH };
      }
    }
    const photo = photoBytes ? await embedRaster(pdf, photoBytes) : null;
    const fitted = fitRect(
      cropCanvas.width,
      cropCanvas.height,
      imageMaxW,
      imageMaxH,
    );
    const imgX = (PAGE_W - fitted.width) / 2;
    const imgY = PAGE_H - 88 - fitted.height;
    imageBottom = imgY;
    page.drawRectangle({
      x: MARGIN,
      y: imgY - 6,
      width: imageMaxW,
      height: fitted.height + 12,
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
    const scale = fitted.width / cropCanvas.width;
    const line = strokeWidthPx(input.topo.routeStrokeWidth, scale);
    const markerR = scaledPointerRadius(input.topo.routeStrokeWidth, scale);
    for (const path of input.paths) {
      const points = parsePath(path.path).map((point) => ({
        x: point.x - cropCanvas.x,
        y: point.y - cropCanvas.y,
      }));
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
            y: imgY + (cropCanvas.height - from.y) * scale,
          },
          end: {
            x: imgX + to.x * scale,
            y: imgY + (cropCanvas.height - to.y) * scale,
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
          imgY + (cropCanvas.height - start.y) * scale,
          markerR,
          color,
          String(route.position),
        );
      }
      if (end) {
        drawEndDisc(
          page,
          imgX + end.x * scale,
          imgY + (cropCanvas.height - end.y) * scale,
          markerR,
          color,
        );
      }
    }
  }

  let legendY = imageBottom - 20;
  page.drawText("RUTAS", {
    x: MARGIN,
    y: legendY,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  for (const route of input.routes) {
    legendY -= 22;
    if (legendY < 40) break;
    const color = hexToRgb(routeColor(route.kind));
    drawStartDisc(
      page,
      fonts,
      MARGIN + 8,
      legendY + 5,
      6.5,
      color,
      String(route.position),
    );
    const grade = toFrenchGrade(route.grade, route.gradeSystem);
    const length =
      route.length != null
        ? `${Math.round(route.length)} ${route.lengthUnit === "Feet" ? "ft" : "m"}`
        : "";
    const label = sanitizePdfText(
      `${route.name}${grade ? `  ${grade}` : ""}${length ? `  ${length}` : ""}`,
    );
    page.drawText(label.slice(0, 46), {
      x: MARGIN + 22,
      y: legendY + (route.starCount > 0 ? 4 : 0),
      size: 9.5,
      font: fonts.body,
      color: INK,
    });
    if (route.starCount > 0 && route.starAverage != null) {
      drawStars(page, MARGIN + 22, legendY - 6, route.starAverage);
    }
  }

  drawFooter(page, fonts, input.generatedAt);
}

export async function buildZoneCoverPdf(
  guide: ZoneGuide,
  generatedAt = new Date(),
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const fonts = await loadFonts(pdf);
  const logo = await pdf.embedPng(await loadLogoPng());
  await drawCoverPage(pdf, fonts, logo, guide, generatedAt);
  await drawRulesPage(pdf, fonts, guide.rules, generatedAt);
  await drawZoneMapPage(pdf, fonts, guide, generatedAt);

  const orderedWalls = [...guide.sectors].flatMap((sector) =>
    guide.walls
      .filter((wall) => wall.sectorId === sector.id)
      .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
      .map((wall) => ({ sector, wall })),
  );
  for (const { sector, wall } of orderedWalls) {
    const wallRoutes = guide.routes.filter((route) => route.wallId === wall.id);
    const wallTopos = [...guide.topos]
      .filter((topo) => topo.wallId === wall.id)
      .sort((a, b) => {
        if (a.main === b.main) return a.position - b.position;
        return a.main ? -1 : 1;
      });
    const pages = wallTopos.length > 0 ? wallTopos : [null];
    for (const topo of pages) {
      await drawWallPage(pdf, fonts, {
        zoneName: guide.zone.name,
        sectorName: sector.name,
        wallName: wall.name,
        topo,
        routes: wallRoutes,
        paths: topo
          ? guide.paths.filter((path) => path.topoId === topo.id)
          : [],
        generatedAt,
      });
    }
  }
  return pdf.save();
}
