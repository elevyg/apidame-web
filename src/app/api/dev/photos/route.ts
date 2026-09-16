import { NextResponse } from "next/server";
import { assertDev } from "@/lib/dev/guard";
import { listPoolPhotos, readNotaJson } from "@/lib/dev/notasFs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    assertDev();
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Falta slug" }, { status: 400 });
  }

  const pool = await listPoolPhotos(slug);
  let used: string[] = [];
  try {
    const post = await readNotaJson(slug);
    used = post.cards.flatMap((card) => {
      if (card.type === "photo") return [card.src];
      if (card.type === "title" && card.art) return [card.art];
      return [];
    });
  } catch {
    used = [];
  }

  return NextResponse.json({ slug, pool, used });
}
