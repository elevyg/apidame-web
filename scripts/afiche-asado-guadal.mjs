import { mkdir, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const html = join(process.cwd(), "scripts/afiche-asado-guadal.html");
const pdf = join(
  process.cwd(),
  "public/afiches/asado-club-andino-puerto-guadal.pdf",
);
const share = join(
  process.cwd(),
  "public/afiches/asado-club-andino-puerto-guadal.jpg",
);
const profile = "/tmp/chrome-afiche";

function spawnOnce(bin, args) {
  return spawn(bin, args, { stdio: ["ignore", "inherit", "inherit"] });
}

function waitForFile(path, timeoutMs) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const info = await stat(path);
        if (info.size > 10_000) {
          resolve(info);
          return;
        }
      } catch {
        // still writing
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error(`missing ${path}`));
        return;
      }
      setTimeout(() => {
        void tick();
      }, 200);
    };
    void tick();
  });
}

function run(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawnOnce(bin, args);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${bin} exited ${code}`));
    });
  });
}

await mkdir(dirname(pdf), { recursive: true });
await rm(profile, { recursive: true, force: true });
await rm(pdf, { force: true });
await mkdir(profile, { recursive: true });

const chrome = spawnOnce("google-chrome", [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--hide-scrollbars",
  "--allow-file-access-from-files",
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  "--disable-sync",
  "--disable-background-networking",
  "--disable-component-update",
  `--print-to-pdf=${pdf}`,
  "--virtual-time-budget=4000",
  pathToFileURL(html).href,
]);

await waitForFile(pdf, 15000);
chrome.kill("SIGKILL");
await run("pdftoppm", ["-jpeg", "-jpegopt", "quality=84", "-r", "90", "-singlefile", pdf, share.replace(/\.jpg$/, "")]);

console.log(pdf);
console.log(share);
