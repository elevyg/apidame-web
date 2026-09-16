import { NextResponse } from "next/server";
import { assertDev } from "@/lib/dev/guard";
import { getPostHogServer } from "@/lib/posthog-server";
import {
  feedPostSchema,
  listNotaSlugs,
  readNotaJson,
  writeNotaJson,
} from "@/lib/dev/notasFs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    assertDev();
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const slug = new URL(request.url).searchParams.get("slug");
  if (slug) {
    try {
      const post = await readNotaJson(slug);
      return NextResponse.json(post);
    } catch {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 },
      );
    }
  }

  const slugs = await listNotaSlugs();
  return NextResponse.json({ slugs });
}

export async function PUT(request: Request) {
  try {
    assertDev();
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = feedPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Shape inválido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const saved = await writeNotaJson(parsed.data);
    return NextResponse.json(saved);
  } catch (error) {
    const posthog = getPostHogServer();
    if (posthog) {
      await posthog.captureExceptionImmediate(
        error,
        request.headers.get("x-posthog-distinct-id") ?? undefined,
      );
    }
    throw error;
  }
}
