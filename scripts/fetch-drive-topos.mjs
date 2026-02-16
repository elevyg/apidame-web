import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FOLDER_ID = "1-Be9uxgPKeD30336yjwvZa8czW9iBwNu";
const KEY_PATH =
  process.env.DRIVE_SERVICE_ACCOUNT_KEY ??
  path.resolve(__dirname, "..", ".secrets", "drive-sa.json");
const OUTPUT_PATH = path.resolve(
  __dirname,
  "..",
  "src",
  "app",
  "topos",
  "featuredRoutes.json",
);
const THUMBNAILS_DIR = path.resolve(
  __dirname,
  "..",
  "public",
  "topos",
  "featured-routes-thumbs",
);
const THUMBNAILS_PUBLIC_DIR = "/topos/featured-routes-thumbs";

const FIELDS = "files(id,name,thumbnailLink,modifiedTime,webViewLink)";

function extensionFromContentType(contentType) {
  if (!contentType) return ".jpg";
  if (contentType.includes("image/png")) return ".png";
  if (contentType.includes("image/webp")) return ".webp";
  return ".jpg";
}

async function getExistingThumbnailPath(fileId) {
  try {
    const files = await fs.readdir(THUMBNAILS_DIR);
    const existing = files.find((name) => name.startsWith(`${fileId}.`));
    return existing ? `${THUMBNAILS_PUBLIC_DIR}/${existing}` : null;
  } catch {
    return null;
  }
}

async function removeExistingThumbnailFiles(fileId) {
  const files = await fs.readdir(THUMBNAILS_DIR);
  const candidates = files.filter((name) => name.startsWith(`${fileId}.`));
  await Promise.all(
    candidates.map((name) => fs.rm(path.join(THUMBNAILS_DIR, name))),
  );
}

async function downloadThumbnail(fileId) {
  const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
    throw new Error("La respuesta de miniatura no es una imagen.");
  }

  const extension = extensionFromContentType(contentType);
  const fileName = `${fileId}${extension}`;
  const outputPath = path.join(THUMBNAILS_DIR, fileName);
  const buffer = Buffer.from(await response.arrayBuffer());

  await removeExistingThumbnailFiles(fileId);
  await fs.writeFile(outputPath, buffer);

  return `${THUMBNAILS_PUBLIC_DIR}/${fileName}`;
}

async function main() {
  try {
    await fs.access(KEY_PATH);
  } catch {
    throw new Error(
      `No se encontró el key de servicio en ${KEY_PATH}. Coloca el JSON o define DRIVE_SERVICE_ACCOUNT_KEY.`,
    );
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const drive = google.drive({ version: "v3", auth });

  const response = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and mimeType='application/pdf' and trashed=false`,
    fields: FIELDS,
    orderBy: "modifiedTime desc",
    pageSize: 200,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const files = response.data.files ?? [];
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.mkdir(THUMBNAILS_DIR, { recursive: true });

  const routes = await Promise.all(files.map(async (file) => {
    const id = file.id;
    let thumbnail = null;

    if (id) {
      try {
        thumbnail = await downloadThumbnail(id);
      } catch (error) {
        const existingThumbnail = await getExistingThumbnailPath(id);
        thumbnail = existingThumbnail;
        const message = error instanceof Error ? error.message : String(error);
        console.warn(
          `⚠️ No se pudo descargar miniatura para ${file.name ?? id}: ${message}`,
        );
      }
    }

    return {
      id,
      name: file.name,
      thumbnail,
      webViewLink: file.webViewLink ?? null,
      modifiedTime: file.modifiedTime ?? null,
    };
  }));

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(routes, null, 2));

  console.log(
    `✅ ${routes.length} rutas destacadas actualizadas en ${OUTPUT_PATH}`,
  );
}

main().catch((error) => {
  console.error("❌ Error al generar featuredRoutes.json");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
