import { NextRequest, NextResponse } from "next/server";
import { fetchStaticMap } from "@/lib/guide/mapbox";
import { buildZoneMapView, WEB_MAP_SIZE } from "@/lib/guide/mapView";
import { requireZoneBySlug, ZoneDataUnavailableError } from "@/lib/guide/queries";
import { zoneToMapInput } from "@/lib/guide/zoneMap";

type RouteProps = {
  params: Promise<{ zoneSlug: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const { zoneSlug } = await params;
  let guide;
  try {
    guide = await requireZoneBySlug(zoneSlug);
  } catch (error) {
    if (error instanceof ZoneDataUnavailableError) {
      return new NextResponse("Mapa no disponible", { status: 502 });
    }
    throw error;
  }
  const view = buildZoneMapView(zoneToMapInput(guide), WEB_MAP_SIZE);
  if (!view) {
    return new NextResponse("Mapa no disponible", { status: 404 });
  }

  const image = await fetchStaticMap({
    center: view.center,
    zoom: view.zoom,
    width: view.width,
    height: view.height,
  });
  if (!image) {
    return new NextResponse("Mapa no disponible", { status: 502 });
  }

  return new NextResponse(Buffer.from(image.bytes), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
