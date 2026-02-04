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

const FIELDS = "files(id,name,thumbnailLink,modifiedTime,webViewLink)";

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

  const routes = files.map((file) => {
    const id = file.id;
    return {
      id,
      name: file.name,
      thumbnail: id
        ? `https://drive.google.com/thumbnail?id=${id}&sz=w800`
        : null,
      webViewLink: file.webViewLink ?? null,
      modifiedTime: file.modifiedTime ?? null,
    };
  });

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
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
