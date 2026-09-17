import type { GeoPoint } from "@/lib/geo/mercator";

const STYLE = "mapbox/satellite-streets-v12";
const TEMP_NOTE = "apidame-web-static";
const TEMP_TTL_MS = 50 * 60 * 1000;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function mapboxToken() {
  return process.env.MAPBOX_TOKEN ?? "";
}

function mapboxUsername(secret: string): string | null {
  const payload = secret.split(".")[1];
  if (!payload) return null;
  try {
    const json = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      u?: unknown;
    };
    return typeof json.u === "string" ? json.u : null;
  } catch {
    return null;
  }
}

let cachedPublic: { token: string; expiresAt: number } | null = null;

async function staticAccessToken(): Promise<string | null> {
  const token = mapboxToken();
  if (!token) return null;
  if (token.startsWith("pk.") || token.startsWith("tk.")) return token;

  if (cachedPublic && cachedPublic.expiresAt > Date.now() + 60_000) {
    return cachedPublic.token;
  }

  const username = mapboxUsername(token);
  if (!username) return null;

  const expiresAt = Date.now() + TEMP_TTL_MS;
  const response = await fetch(
    `https://api.mapbox.com/tokens/v2/${username}?access_token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note: TEMP_NOTE,
        scopes: ["styles:read", "styles:tiles", "fonts:read"],
        expires: new Date(expiresAt).toISOString(),
      }),
    },
  );
  if (!response.ok) {
    console.error("mapbox token create failed", response.status);
    return null;
  }
  const body = (await response.json()) as { token?: unknown };
  if (typeof body.token !== "string") return null;
  cachedPublic = { token: body.token, expiresAt };
  return cachedPublic.token;
}

export async function fetchStaticMap(input: {
  center: GeoPoint;
  zoom: number;
  width: number;
  height: number;
  retina?: boolean;
}): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  const accessToken = await staticAccessToken();
  if (!accessToken) return null;

  const width = clamp(Math.round(input.width), 200, 1280);
  const height = clamp(Math.round(input.height), 120, 1280);
  const zoom = clamp(input.zoom, 1, 22);
  const retina = input.retina === false ? "" : "@2x";
  const url = `https://api.mapbox.com/styles/v1/${STYLE}/static/${input.center.lng},${input.center.lat},${zoom},0/${width}x${height}${retina}?logo=false&attribution=false&access_token=${accessToken}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    console.error("mapbox static failed", response.status);
    return null;
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  return {
    bytes,
    contentType: response.headers.get("content-type") ?? "image/jpeg",
  };
}
