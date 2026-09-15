import sharp from "sharp";
import { findShareCard } from "@/components/estetica/feed/posts";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8_500_000;
const MAX_IMAGE_BYTES = 6_000_000;
const imageDataUrl = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/;
const APIDAME_ICON_PATH =
  "M87.664,31.167c0.471,9.734 2.467,23.925 6.862,39.634c-4.691,-1.096 -9.466,-1.963 -14.291,-2.588c-1.659,-11.162 -2.788,-23.462 -3.396,-37.046l10.825,0Zm-45.758,37.046c-4.667,0.604 -9.284,1.433 -13.821,2.475c4.583,-16.437 6.541,-31.212 6.879,-40.942l10.6,-5.479c-0.513,16.346 -1.725,30.909 -3.658,43.946m62.587,5.475l0.05,-0.154c-0.037,-0.013 -0.071,-0.025 -0.108,-0.033c-0.017,-0.059 -0.038,-0.117 -0.054,-0.18c-5.505,-17.883 -7.734,-34.395 -8.046,-44.187c-0.025,-0.842 -0.338,-1.65 -0.871,-2.3l-2.471,-3.004c-0.729,-0.892 -1.817,-1.404 -2.967,-1.404l-13.504,-0c-0.15,-5.459 -0.229,-11.109 -0.229,-16.963l0,-0.371c0,-1.029 -0.358,-2.029 -1.012,-2.825l-1.1,-1.337c-0.759,-0.929 -2.067,-1.196 -3.134,-0.646l-40.371,20.867c-1.087,0.558 -2.033,1.358 -2.766,2.333l-0.904,1.196c-1.013,1.341 -1.584,2.966 -1.642,4.65c-0.338,9.779 -2.571,26.146 -8.021,43.866c-5.317,17.28 -11.458,28.838 -16.983,36.513c-0.588,0.817 -0.442,1.95 0.337,2.592l0.454,0.37c0.875,0.721 2.055,0.938 3.13,0.584c1.575,-0.517 3.2,-1.013 4.866,-1.488c1.138,-0.325 2.117,-1.062 2.734,-2.071c5.841,-9.52 10.158,-20.083 13.22,-29.25c6.421,-1.737 13.05,-3.012 19.771,-3.787l-3.908,4.754c-1.2,1.458 -2.033,3.179 -2.454,5.021c-0.275,1.196 -0.559,2.379 -0.846,3.546c-1.338,5.366 -2.85,10.462 -4.55,15.308c-0.283,0.804 0.379,1.625 1.225,1.521c2.596,-0.321 5.242,-0.596 7.937,-0.821c0.467,-0.037 0.863,-0.35 1.013,-0.796c1.35,-4.133 2.583,-8.425 3.696,-12.896c4.958,-19.95 7.683,-43.875 8.316,-73.062l11.434,-5.908c0.358,30.116 2.837,54.812 7.541,75.3c1.33,5.795 2.85,11.312 4.575,16.566c0.146,0.446 0.546,0.759 1.009,0.796c2.696,0.225 5.346,0.5 7.941,0.821c0.846,0.104 1.509,-0.717 1.225,-1.521c-2.066,-5.892 -3.862,-12.15 -5.391,-18.812l-0.004,-0.025c-0.43,-1.863 -1.28,-3.596 -2.492,-5.071l-3.879,-4.725c6.9,0.8 13.7,2.116 20.271,3.929c3.1,9.212 7.458,19.808 13.354,29.312c0.616,0.992 1.579,1.717 2.7,2.042c1.179,0.346 2.337,0.7 3.471,1.067c1.07,0.346 2.241,0.121 3.112,-0.592l0.517,-0.425c0.771,-0.633 0.929,-1.758 0.35,-2.575c-5.409,-7.654 -11.363,-19.008 -16.542,-35.725";

function createBrandOverlay(outputWidth: number, outputHeight: number) {
  const preferredScale = Math.min(1, Math.max(0.72, outputWidth / 1080));
  const scale = Math.min(preferredScale, outputWidth / 252, outputHeight / 76);
  const width = Math.max(1, Math.round(252 * scale));
  const height = Math.max(1, Math.round(76 * scale));

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 252 76" xmlns="http://www.w3.org/2000/svg">
      <rect width="234" height="58" rx="10" fill="#12110f" fill-opacity=".78"/>
      <svg x="13" y="13" width="32" height="30" viewBox="0 0 122 114">
        <path d="${APIDAME_ICON_PATH}" fill="#f4efe6"/>
      </svg>
      <text x="56" y="37" fill="#f4efe6" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" letter-spacing=".5">apidame.com</text>
    </svg>
  `);
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse("La imagen es demasiado grande", 413);
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return errorResponse("Origen no permitido", 403);
      }
    } catch {
      return errorResponse("Origen no permitido", 403);
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("El payload no es JSON válido", 400);
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("image" in payload) ||
    typeof payload.image !== "string"
  ) {
    return errorResponse("Falta image", 400);
  }

  const postId =
    "postId" in payload && typeof payload.postId === "string"
      ? payload.postId
      : undefined;
  const cardId =
    "cardId" in payload && typeof payload.cardId === "string"
      ? payload.cardId
      : postId;
  if (!cardId) {
    return errorResponse("Faltan postId o cardId", 400);
  }

  const card = findShareCard(cardId, postId === cardId ? undefined : postId);
  if (!card) {
    return errorResponse("La tarjeta no existe", 404);
  }
  const editorial =
    card.type === "field" &&
    (card.tone === "editorial-light" || card.tone === "editorial-dark");

  if (payload.image.length > MAX_BODY_BYTES) {
    return errorResponse("La imagen es demasiado grande", 413);
  }

  const match = imageDataUrl.exec(payload.image);
  if (!match?.[1]) {
    return errorResponse("El formato de imagen no es válido", 415);
  }

  const input = Buffer.from(match[1], "base64");
  if (input.byteLength > MAX_IMAGE_BYTES) {
    return errorResponse("La imagen es demasiado grande", 413);
  }

  try {
    const prepared = await sharp(input, {
      failOn: "error",
      limitInputPixels: 20_000_000,
    })
      .rotate()
      .resize({
        width: 1080,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .flatten({
        background:
          card.type === "field" && card.tone === "editorial-light"
            ? "#e8e2d4"
            : "#12110f",
      })
      .toBuffer({ resolveWithObject: true });

    const output = sharp(prepared.data);
    if (!editorial) {
      output.composite([
        {
          input: createBrandOverlay(prepared.info.width, prepared.info.height),
          gravity: "southeast",
        },
      ]);
    }
    const jpeg = await output.jpeg({ quality: 88, mozjpeg: true }).toBuffer();

    return new Response(new Uint8Array(jpeg), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `inline; filename="apidame-${cardId}.jpg"`,
        "Content-Type": "image/jpeg",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("No se pudo convertir la tarjeta a JPEG", error);
    return errorResponse("No se pudo generar el JPEG", 422);
  }
}
