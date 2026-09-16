import { LineCapStyle, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { pdfImageUrl } from "@/lib/climbing/cloudinary";
import { parsePath, strokeWidthPx } from "@/lib/climbing/path";
import { routeColor } from "@/lib/climbing/colors";
import { fitRect, sanitizePdfText, wrapWords } from "./layout";
import type { getWallGuide, getZoneBySlug } from "./queries";

const PAGE_W = 420;
const PAGE_H = 844;
const MARGIN = 22;
const INK = rgb(0.11, 0.1, 0.09);
const MUTED = rgb(0.35, 0.33, 0.31);
const PAPER = rgb(1, 1, 1);

type ZoneGuide = NonNullable<Awaited<ReturnType<typeof getZoneBySlug>>>;
type WallGuide = NonNullable<Awaited<ReturnType<typeof getWallGuide>>>;

async function embedPhoto(
  pdf: PDFDocument,
  url: string,
) {
  const response = await fetch(url);
  if (!response.ok) return null;
  const bytes = new Uint8Array(await response.arrayBuffer());
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

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const n = Number.parseInt(value.slice(0, 6), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export async function buildZonePdf(guide: ZoneGuide): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const cover = pdf.addPage([PAGE_W, PAGE_H]);
  cover.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });
  let y = PAGE_H - 56;
  cover.drawText("APIDAME · CHILE CHICO", {
    x: MARGIN,
    y,
    size: 9,
    font,
    color: MUTED,
  });
  y -= 28;
  cover.drawText(sanitizePdfText(guide.zone.name), {
    x: MARGIN,
    y,
    size: 28,
    font: bold,
    color: INK,
  });
  y -= 28;
  const description = sanitizePdfText(guide.zone.description ?? "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  for (const paragraph of description) {
    for (const line of wrapWords(paragraph, 46)) {
      y -= 14;
      if (y < 80) break;
      cover.drawText(sanitizePdfText(line), {
        x: MARGIN,
        y,
        size: 11,
        font,
        color: INK,
      });
    }
    y -= 8;
  }
  y -= 12;
  cover.drawText("Paredes", {
    x: MARGIN,
    y,
    size: 12,
    font: bold,
    color: INK,
  });
  for (const sector of guide.sectors) {
    const sectorWalls = guide.walls.filter((wall) => wall.sectorId === sector.id);
    for (const wall of sectorWalls) {
      y -= 16;
      if (y < 60) break;
      cover.drawText(sanitizePdfText(`${sector.name} · ${wall.name}`), {
        x: MARGIN,
        y,
        size: 11,
        font,
        color: INK,
      });
    }
  }

  for (const sector of guide.sectors) {
    const sectorWalls = guide.walls.filter((wall) => wall.sectorId === sector.id);
    for (const wall of sectorWalls) {
      const wallTopos = guide.topos.filter((topo) => topo.wallId === wall.id);
      const wallRoutes = guide.routes.filter((route) => route.wallId === wall.id);
      const topo = wallTopos.find((item) => item.main) ?? wallTopos[0];
      if (!topo) continue;
      await drawWallPage(pdf, {
        font,
        bold,
        zoneName: guide.zone.name,
        sectorName: sector.name,
        wallName: wall.name,
        topo,
        routes: wallRoutes,
        paths: guide.paths.filter((path) => path.topoId === topo.id),
      });
    }
  }

  return pdf.save();
}

export async function buildWallPdf(guide: WallGuide): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const orderedTopos = [...guide.topos].sort((a, b) => {
    if (a.main === b.main) return a.position - b.position;
    return a.main ? -1 : 1;
  });
  for (const topo of orderedTopos) {
    await drawWallPage(pdf, {
      font,
      bold,
      zoneName: guide.zone.name,
      sectorName: guide.sector.name,
      wallName: guide.wall.name,
      topo,
      routes: guide.routes,
      paths: guide.paths.filter((path) => path.topoId === topo.id),
    });
  }
  if (orderedTopos.length === 0) {
    await drawWallPage(pdf, {
      font,
      bold,
      zoneName: guide.zone.name,
      sectorName: guide.sector.name,
      wallName: guide.wall.name,
      topo: null,
      routes: guide.routes,
      paths: [],
    });
  }
  return pdf.save();
}

async function drawWallPage(
  pdf: PDFDocument,
  input: {
    font: Awaited<ReturnType<PDFDocument["embedFont"]>>;
    bold: Awaited<ReturnType<PDFDocument["embedFont"]>>;
    zoneName: string;
    sectorName: string;
    wallName: string;
    topo: ZoneGuide["topos"][number] | null;
    routes: ZoneGuide["routes"];
    paths: WallGuide["paths"];
  },
) {
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });
  let y = PAGE_H - 36;
  page.drawText(sanitizePdfText(`${input.zoneName}`.toUpperCase()), {
    x: MARGIN,
    y,
    size: 8,
    font: input.font,
    color: MUTED,
  });
  y -= 20;
  page.drawText(
    sanitizePdfText(`${input.sectorName} · ${input.wallName}`),
    {
      x: MARGIN,
      y,
      size: 16,
      font: input.bold,
      color: INK,
    },
  );

  const legendH = Math.min(220, 28 + input.routes.length * 16);
  const imageMaxH = PAGE_H - 80 - legendH;
  const imageMaxW = PAGE_W - MARGIN * 2;
  let imageBottom = PAGE_H - 80 - imageMaxH;

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
    const imgY = PAGE_H - 72 - fitted.height;
    imageBottom = imgY;
    if (photo) {
      page.drawImage(photo, {
        x: imgX,
        y: imgY,
        width: fitted.width,
        height: fitted.height,
      });
    }
    const scale = fitted.width / srcW;
    const stroke = Math.max(1.2, strokeWidthPx(input.topo.routeStrokeWidth, scale) * 0.35);
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
          thickness: stroke,
          color,
          lineCap: LineCapStyle.Round,
        });
      }
      const start = points[0];
      if (start && route) {
        const cx = imgX + start.x * scale;
        const cy = imgY + (srcH - start.y) * scale;
        page.drawCircle({ x: cx, y: cy, size: 7, color });
        page.drawText(String(route.position), {
          x: cx - 2.5,
          y: cy - 3,
          size: 7,
          font: input.bold,
          color: PAPER,
        });
      }
    }
  }

  let legendY = Math.min(imageBottom - 18, legendH + 20);
  page.drawText("Rutas", {
    x: MARGIN,
    y: legendY,
    size: 11,
    font: input.bold,
    color: INK,
  });
  for (const route of input.routes) {
    legendY -= 15;
    if (legendY < 24) break;
    const label = sanitizePdfText(
      `${route.position}. ${route.name}${route.grade ? `  ${route.grade}` : ""}`,
    );
    page.drawText(label.slice(0, 52), {
      x: MARGIN,
      y: legendY,
      size: 10,
      font: input.font,
      color: INK,
    });
  }
}
