"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { Card, FeedPostData } from "../posts";
import posthog from "posthog-js";

type PhotosPayload = {
  pool: string[];
  used: string[];
};

function analyticsHeaders(): Record<string, string> {
  const distinctId = posthog.get_distinct_id();
  const sessionId = posthog.get_session_id();
  const headers: Record<string, string> = {};
  if (distinctId) headers["X-POSTHOG-DISTINCT-ID"] = distinctId;
  if (sessionId) headers["X-POSTHOG-SESSION-ID"] = sessionId;
  return headers;
}

async function savePost(post: FeedPostData) {
  const response = await fetch("/api/dev/posts", {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...analyticsHeaders() },
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Error ${response.status}`);
  }
  return (await response.json()) as FeedPostData;
}

function cardById(post: FeedPostData, cardId: string) {
  return post.cards.find((card) => card.id === cardId);
}

function replaceCard(post: FeedPostData, next: Card): FeedPostData {
  return {
    ...post,
    cards: post.cards.map((card) => (card.id === next.id ? next : card)),
  };
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-3 sm:items-center"
      onClick={onClose}
      data-share-ignore
    >
      <div
        className="bg-paper text-ink max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-lg shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-rule flex items-center justify-between border-b px-4 py-3">
          <p className="font-brown text-xs tracking-[0.16em] uppercase">
            {title}
          </p>
          <button
            type="button"
            className="font-brown text-ink-soft text-xs tracking-[0.14em] uppercase"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function TitleForm({
  card,
  ogSubtitle,
  onSave,
  busy,
}: {
  card: Extract<Card, { type: "title" }>;
  ogSubtitle: string;
  onSave: (card: Card, nextOgSubtitle: string) => Promise<void>;
  busy: boolean;
}) {
  const [kicker, setKicker] = useState(card.kicker);
  const [text, setText] = useState(card.text);
  const [subtitle, setSubtitle] = useState(ogSubtitle);
  const [artAlt, setArtAlt] = useState(card.artAlt ?? "");

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        void onSave(
          {
            ...card,
            kicker,
            text,
            artAlt: artAlt || undefined,
            share: text,
          },
          subtitle,
        );
      }}
    >
      <label className="font-brown flex flex-col gap-1 text-sm">
        Kicker
        <input
          className="border-rule border bg-white px-3 py-2"
          value={kicker}
          onChange={(event) => setKicker(event.target.value)}
        />
      </label>
      <label className="font-brown flex flex-col gap-1 text-sm">
        Título
        <input
          className="border-rule border bg-white px-3 py-2"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </label>
      <label className="font-brown flex flex-col gap-1 text-sm">
        Subtítulo OG
        <input
          className="border-rule border bg-white px-3 py-2"
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
        />
      </label>
      <label className="font-brown flex flex-col gap-1 text-sm">
        Alt de portada
        <input
          className="border-rule border bg-white px-3 py-2"
          value={artAlt}
          onChange={(event) => setArtAlt(event.target.value)}
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="bg-canvas font-brown text-paper px-4 py-2 text-xs tracking-[0.16em] uppercase disabled:opacity-50"
      >
        {busy ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}

function FieldForm({
  card,
  onSave,
  busy,
}: {
  card: Extract<Card, { type: "field" }>;
  onSave: (card: Card) => Promise<void>;
  busy: boolean;
}) {
  const [kicker, setKicker] = useState(card.kicker);
  const [body, setBody] = useState(card.paras.join("\n\n"));

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        const paras = body
          .split(/\n\s*\n/)
          .map((para) => para.trim())
          .filter(Boolean);
        void onSave({
          ...card,
          kicker,
          paras,
          share: paras.join("\n\n"),
        });
      }}
    >
      <label className="font-brown flex flex-col gap-1 text-sm">
        Kicker
        <input
          className="border-rule border bg-white px-3 py-2"
          value={kicker}
          onChange={(event) => setKicker(event.target.value)}
        />
      </label>
      <label className="font-brown flex flex-col gap-1 text-sm">
        Texto (párrafos separados por línea en blanco)
        <textarea
          className="border-rule font-brown min-h-48 border bg-white px-3 py-2 leading-relaxed"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="bg-canvas font-brown text-paper px-4 py-2 text-xs tracking-[0.16em] uppercase disabled:opacity-50"
      >
        {busy ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}

function PhotoForm({
  card,
  onSave,
  busy,
}: {
  card: Extract<Card, { type: "photo" }>;
  onSave: (card: Card) => Promise<void>;
  busy: boolean;
}) {
  const [caption, setCaption] = useState(card.caption);
  const [alt, setAlt] = useState(card.alt);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        void onSave({
          ...card,
          caption,
          alt,
          share: caption,
        });
      }}
    >
      <label className="font-brown flex flex-col gap-1 text-sm">
        Caption
        <input
          className="border-rule border bg-white px-3 py-2"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
      </label>
      <label className="font-brown flex flex-col gap-1 text-sm">
        Alt
        <input
          className="border-rule border bg-white px-3 py-2"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="bg-canvas font-brown text-paper px-4 py-2 text-xs tracking-[0.16em] uppercase disabled:opacity-50"
      >
        {busy ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}

function PhotosPanel({
  post,
  onChange,
  busy,
}: {
  post: FeedPostData;
  onChange: (post: FeedPostData) => Promise<void>;
  busy: boolean;
}) {
  const [photos, setPhotos] = useState<PhotosPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(
          `/api/dev/photos?slug=${encodeURIComponent(post.slug)}`,
          { headers: analyticsHeaders() },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as PhotosPayload;
        if (!cancelled) setPhotos(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudo cargar");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [post.slug]);

  const photoCards = post.cards.filter(
    (card): card is Extract<Card, { type: "photo" }> => card.type === "photo",
  );

  const movePhoto = async (cardId: string, dir: -1 | 1) => {
    const index = post.cards.findIndex((card) => card.id === cardId);
    const target = index + dir;
    if (index < 0 || target < 0 || target >= post.cards.length) return;
    const cards = [...post.cards];
    const [item] = cards.splice(index, 1);
    if (!item) return;
    cards.splice(target, 0, item);
    await onChange({ ...post, cards });
  };

  const removePhoto = async (cardId: string) => {
    await onChange({
      ...post,
      cards: post.cards.filter((card) => card.id !== cardId),
    });
  };

  const setCover = async (src: string) => {
    const title = post.cards.find((card) => card.type === "title");
    if (!title || title.type !== "title") return;
    await onChange(
      replaceCard(post, {
        ...title,
        art: src,
        artAlt: title.artAlt ?? post.title,
      }),
    );
  };

  const addPhoto = async (src: string) => {
    const name =
      src
        .split("/")
        .pop()
        ?.replace(/\.\w+$/, "") ?? "foto";
    const id = `foto-${name}-${Date.now().toString(36)}`;
    const card: Card = {
      id,
      type: "photo",
      src,
      alt: name,
      caption: name.replace(/-/g, " "),
      object: "object-center",
      share: name.replace(/-/g, " "),
    };
    await onChange({ ...post, cards: [...post.cards, card] });
  };

  return (
    <div className="flex flex-col gap-5">
      {error ? (
        <p className="font-brown text-sm text-red-700">{error}</p>
      ) : null}
      <section>
        <p className="font-brown text-ink-soft mb-2 text-xs tracking-[0.14em] uppercase">
          En el post
        </p>
        <ul className="flex flex-col gap-2">
          {photoCards.map((card) => (
            <li
              key={card.id}
              className="border-rule flex items-center gap-3 border p-2"
            >
              <div className="bg-canvas relative h-14 w-10 shrink-0 overflow-hidden">
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-brown truncate text-sm">{card.caption}</p>
                <p className="font-brown text-ink-soft truncate text-[0.65rem]">
                  {card.id}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  disabled={busy}
                  className="font-brown text-[0.65rem] uppercase"
                  onClick={() => void movePhoto(card.id, -1)}
                >
                  Subir
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="font-brown text-[0.65rem] uppercase"
                  onClick={() => void movePhoto(card.id, 1)}
                >
                  Bajar
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="font-brown text-[0.65rem] text-red-700 uppercase"
                  onClick={() => void removePhoto(card.id)}
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <p className="font-brown text-ink-soft mb-2 text-xs tracking-[0.14em] uppercase">
          Pool del álbum
        </p>
        {!photos ? (
          <p className="font-brown text-ink-soft text-sm">Cargando…</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.pool.map((src) => (
              <div key={src} className="bg-canvas relative aspect-[3/4]">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/55 p-1">
                  <button
                    type="button"
                    disabled={busy}
                    className="font-brown text-paper flex-1 text-[0.55rem] tracking-[0.08em] uppercase"
                    onClick={() => void setCover(src)}
                  >
                    Cover
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    className="font-brown text-paper flex-1 text-[0.55rem] tracking-[0.08em] uppercase"
                    onClick={() => void addPhoto(src)}
                  >
                    + Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function DevEditorChrome({
  post,
  onPostChange,
  editCardId,
  onEditCardId,
  photosOpen,
  onPhotosOpen,
  children,
}: {
  post: FeedPostData;
  onPostChange: (post: FeedPostData) => void;
  editCardId: string | null;
  onEditCardId: (id: string | null) => void;
  photosOpen: boolean;
  onPhotosOpen: (open: boolean) => void;
  children: ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const closeEdit = () => onEditCardId(null);

  const persistCard = useCallback(
    async (card: Card, nextOgSubtitle?: string) => {
      setBusy(true);
      setStatus(null);
      try {
        let next = replaceCard(post, card);
        if (card.type === "title") {
          next = {
            ...next,
            title: card.text,
            og: {
              ...next.og,
              title: card.text,
              subtitle: nextOgSubtitle ?? next.og.subtitle,
            },
          };
        }
        const saved = await savePost(next);
        onPostChange(saved);
        onEditCardId(null);
        setStatus("Guardado en content/notas");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Error al guardar");
      } finally {
        setBusy(false);
      }
    },
    [onEditCardId, onPostChange, post],
  );

  const persistPost = useCallback(
    async (next: FeedPostData) => {
      setBusy(true);
      setStatus(null);
      try {
        const saved = await savePost(next);
        onPostChange(saved);
        setStatus("Guardado en content/notas");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Error al guardar");
      } finally {
        setBusy(false);
      }
    },
    [onPostChange],
  );

  const editing = editCardId ? cardById(post, editCardId) : null;

  return (
    <>
      {children}
      <div
        className="pointer-events-none fixed right-3 bottom-3 z-[70] flex flex-col items-end gap-2"
        data-share-ignore
      >
        {status ? (
          <p className="bg-canvas/90 font-brown text-paper pointer-events-none max-w-xs rounded px-3 py-2 text-[0.65rem] tracking-[0.12em] uppercase">
            {status}
          </p>
        ) : null}
        <button
          type="button"
          className="bg-accent font-brown text-ink pointer-events-auto rounded px-3 py-2 text-[0.65rem] tracking-[0.16em] uppercase shadow"
          onClick={() => {
            onEditCardId(null);
            onPhotosOpen(true);
          }}
        >
          Fotos
        </button>
      </div>
      {editing?.type === "title" ? (
        <ModalShell title="Editar título" onClose={closeEdit}>
          <TitleForm
            card={editing}
            ogSubtitle={post.og.subtitle}
            onSave={persistCard}
            busy={busy}
          />
        </ModalShell>
      ) : null}
      {editing?.type === "field" ? (
        <ModalShell title="Editar texto" onClose={closeEdit}>
          <FieldForm card={editing} onSave={persistCard} busy={busy} />
        </ModalShell>
      ) : null}
      {editing?.type === "photo" ? (
        <ModalShell title="Editar foto" onClose={closeEdit}>
          <PhotoForm card={editing} onSave={persistCard} busy={busy} />
        </ModalShell>
      ) : null}
      {photosOpen ? (
        <ModalShell title="Fotos del post" onClose={() => onPhotosOpen(false)}>
          <PhotosPanel post={post} onChange={persistPost} busy={busy} />
        </ModalShell>
      ) : null}
    </>
  );
}
