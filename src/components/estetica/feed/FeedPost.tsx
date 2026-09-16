"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  cuerdasPost,
  getFeedPost,
  getPostCover,
  type Card,
  type CardTone,
  type FeedPostData,
} from "./posts";
import { DevEditorChrome } from "./dev/DevEditor";

const isDev = process.env.NODE_ENV === "development";

const tones: Record<
  CardTone,
  { bg: string; fg: string; mute: string; kicker: string }
> = {
  paper: {
    bg: "bg-paper",
    fg: "text-ink",
    mute: "text-ink-soft",
    kicker: "text-ink-soft",
  },
  canvas: {
    bg: "bg-canvas",
    fg: "text-canvas-ink",
    mute: "text-white/45",
    kicker: "text-accent",
  },
  beige: {
    bg: "bg-beige",
    fg: "text-ink",
    mute: "text-ink-soft",
    kicker: "text-ink-soft",
  },
  "editorial-light": {
    bg: "bg-beige",
    fg: "text-ink",
    mute: "text-ink",
    kicker: "text-ink",
  },
  "editorial-dark": {
    bg: "bg-canvas",
    fg: "text-paper",
    mute: "text-paper",
    kicker: "text-accent",
  },
};

type ShareStatus = "idle" | "generating" | "done" | "error";

type EditorialCard = Card & {
  type: "field";
  tone: "editorial-light" | "editorial-dark";
};

function isEditorial(card: Card): card is EditorialCard {
  return (
    card.type === "field" &&
    (card.tone === "editorial-light" || card.tone === "editorial-dark")
  );
}

async function waitForImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        });
      }
      if (image.decode) {
        await image.decode().catch(() => undefined);
      }
    }),
  );
}

async function createJpeg(postId: string, card: Card, element: HTMLElement) {
  await Promise.all([document.fonts.ready, waitForImages(element)]);
  const { toJpeg } = await import("html-to-image");
  const editorial = isEditorial(card);
  const image = await toJpeg(element, {
    backgroundColor:
      card.type === "photo" || card.tone === "editorial-dark"
        ? "#12110f"
        : undefined,
    cacheBust: true,
    pixelRatio: editorial ? 3 : Math.min(window.devicePixelRatio || 1, 2),
    quality: 0.94,
    filter: (node) =>
      !(node instanceof HTMLCanvasElement) &&
      (!(node instanceof HTMLElement) || node.dataset.shareIgnore !== "true"),
  });
  const response = await fetch("/api/estetica/feed/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, cardId: card.id, image }),
  });
  if (!response.ok) {
    throw new Error(`No se pudo generar el JPEG (${response.status})`);
  }
  const blob = await response.blob();
  if (blob.type !== "image/jpeg") {
    throw new Error("La respuesta no es un JPEG");
  }
  return new File([blob], `apidame-${card.id}.jpg`, {
    type: "image/jpeg",
  });
}

function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function shareCard(postId: string, card: Card, element: HTMLElement) {
  const file = await createJpeg(postId, card, element);
  const shareData: ShareData = {
    files: [file],
    text: card.share,
    title: `Apidame · ${card.type === "photo" ? card.caption : card.kicker}`,
  };
  const canShare =
    typeof navigator.share === "function" &&
    (typeof navigator.canShare !== "function" ||
      navigator.canShare({ files: [file] }));

  if (canShare) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return false;
    }
  }

  downloadFile(file);
  await navigator.clipboard?.writeText(card.share).catch(() => undefined);
  return true;
}

function FillType({
  children,
  className,
  min,
  max,
}: {
  children: ReactNode;
  className: string;
  min: number;
  max: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const boxEl = box.current;
    const innerEl = inner.current;
    if (!boxEl || !innerEl) return;

    const run = () => {
      innerEl.style.fontSize = "";
      const style = window.getComputedStyle(innerEl);
      const height =
        boxEl.clientHeight -
        (Number.parseFloat(style.marginTop) || 0) -
        (Number.parseFloat(style.marginBottom) || 0);
      if (height < 32) return;
      const floor = Math.min(min, 12);
      const cap = Math.min(max, Math.max(floor, height * 0.14));
      let lo = floor;
      let hi = cap;
      let best = floor;
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        innerEl.style.fontSize = `${mid}px`;
        if (
          innerEl.scrollHeight <= height - 4 &&
          innerEl.scrollWidth <= boxEl.clientWidth
        ) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      innerEl.style.fontSize = `${best}px`;
    };

    run();
    const fonts = document.fonts?.ready.then(run);
    const ro = new ResizeObserver(run);
    ro.observe(boxEl);
    return () => {
      ro.disconnect();
      void fonts;
    };
  }, [children, min, max]);

  return (
    <div ref={box} className="min-h-0 flex-1">
      <div ref={inner} className={className}>
        {children}
      </div>
    </div>
  );
}

function isBleed(card: Card) {
  return card.type === "photo" || (card.type === "title" && Boolean(card.art));
}

function CardFace({
  card,
  coverCta,
  coverNavigation,
  shareRef,
}: {
  card: Card;
  coverCta?: ReactNode;
  coverNavigation?: ReactNode;
  shareRef?: RefObject<HTMLDivElement | null>;
}) {
  if (card.type === "photo") {
    return (
      <div className="bg-canvas relative min-h-0 flex-1">
        <Image
          src={card.src}
          alt={card.alt}
          fill
          quality={92}
          sizes="(max-width: 768px) 100vw, 36rem"
          className={`object-cover ${card.object ?? "object-center"}`}
        />
        <p className="bg-canvas font-brown text-canvas-ink absolute inset-x-0 bottom-0 px-6 pt-4 pb-16 text-sm tracking-[0.12em] uppercase">
          {card.caption}
        </p>
      </div>
    );
  }

  if (card.type === "title") {
    const tone = tones[card.tone];
    if (card.art) {
      return (
        <div className={`relative min-h-0 flex-1 ${tone.bg}`}>
          <Image
            src={card.art}
            alt={card.artAlt ?? card.text}
            fill
            priority
            quality={92}
            sizes="(max-width: 768px) 100vw, 36rem"
            className={`object-cover ${card.object ?? "object-center"}`}
          />
          <div className="feed-cover-heading">
            <h1 className="feed-cover-title">{card.text}</h1>
            <div className="feed-cover-tools">
              <p className="feed-cover-kicker">{card.kicker}</p>
              {coverCta}
            </div>
          </div>
          <div className="from-canvas via-canvas/55 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent px-6 pt-24 pb-16">
            {coverNavigation}
          </div>
        </div>
      );
    }
    return (
      <div
        className={`flex min-h-0 flex-1 flex-col px-6 pt-10 pb-8 ${tone.bg} ${tone.fg}`}
      >
        <p className={`kicker shrink-0 ${tone.kicker}`}>{card.kicker}</p>
        <FillType
          min={28}
          max={72}
          className="font-display mt-5 leading-[1.08] tracking-tight"
        >
          <h1>{card.text}</h1>
        </FillType>
      </div>
    );
  }

  const tone = tones[card.tone];
  if (isEditorial(card)) {
    return (
      <div
        ref={shareRef}
        className={`feed-editorial-page ${tone.bg} ${tone.fg}`}
      >
        <FillType min={16} max={42} className="feed-editorial-body">
          <p className="feed-editorial-question">{card.kicker}</p>
          {card.feature ? (
            <p className="feed-editorial-feature">{card.feature}</p>
          ) : null}
          <div className="feed-editorial-answer">
            {card.paras.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        </FillType>
        {card.meta?.length ? (
          <p className="feed-editorial-meta">{card.meta.join(" / ")}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col px-6 py-6 ${tone.bg} ${tone.fg}`}
    >
      <p className={`kicker shrink-0 ${tone.kicker}`}>{card.kicker}</p>
      <FillType
        min={16}
        max={40}
        className="font-brown mt-4 flex min-h-0 flex-1 flex-col gap-[0.8em] leading-[1.45]"
      >
        {card.paras.map((para) => (
          <p key={para.slice(0, 48)}>{para}</p>
        ))}
      </FillType>
      {card.link ? (
        <RelatedNoteCard
          href={card.link.href}
          label={card.link.label}
          onDark={card.tone === "canvas" || card.tone === "editorial-dark"}
        />
      ) : null}
    </div>
  );
}

function RelatedNoteCard({
  href,
  label,
  onDark,
}: {
  href: string;
  label: string;
  onDark: boolean;
}) {
  const slug = href.split("/").filter(Boolean).pop() ?? "";
  const post = getFeedPost(slug);
  const cover = post ? getPostCover(post) : undefined;
  const title = post?.title ?? label;

  return (
    <Link
      href={href}
      className={`mt-5 flex shrink-0 items-stretch gap-3 border p-2 transition ${
        onDark
          ? "border-white/20 bg-canvas hover:border-accent"
          : "border-rule bg-paper hover:border-accent"
      }`}
      data-share-ignore
    >
      {cover ? (
        <div className="bg-canvas relative aspect-[3/4] w-[4.25rem] shrink-0 overflow-hidden">
          <Image
            src={cover.src}
            alt=""
            fill
            sizes="68px"
            className={`object-cover ${cover.object}`}
          />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-1 pr-1">
        <p className="font-brown text-accent text-[0.65rem] tracking-[0.16em] uppercase">
          Nota relacionada
        </p>
        <p className="font-display text-[1.05rem] leading-[1.05] tracking-[-0.03em] italic">
          {title}
        </p>
        <p
          className={`font-brown text-[0.62rem] tracking-[0.14em] uppercase ${
            onDark ? "text-white/55" : "text-ink-soft"
          }`}
        >
          Abrir nota ↗
        </p>
      </div>
    </Link>
  );
}

function CoverPapeoCta({
  onJump,
  to,
}: {
  onJump: (to: number) => void;
  to: number;
}) {
  return (
    <button
      type="button"
      className="feed-cover-papeo"
      onClick={() => onJump(to)}
      data-share-ignore
    >
      Directo al papeo
    </button>
  );
}

function CoverNavigation({ onJump }: { onJump: (to: number) => void }) {
  const reduce = useReducedMotion();

  return (
    <div className="mb-5 flex items-end justify-center">
      <button
        type="button"
        className="font-brown text-paper pointer-events-auto flex flex-col items-center text-[0.62rem] tracking-[0.18em] uppercase [text-shadow:0_1px_12px_rgba(0,0,0,0.8)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        onClick={() => onJump(1)}
        aria-label="Leer historia: ir a la siguiente tarjeta"
        data-share-ignore
      >
        <span>leer historia</span>
        <motion.svg
          aria-hidden
          viewBox="0 0 12 42"
          className="mt-1.5 h-9 w-3 overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]"
          animate={reduce ? undefined : { y: [-2, 3, -2] }}
          transition={{
            duration: 2.8,
            ease: [0.45, 0, 0.55, 1],
            repeat: Infinity,
          }}
        >
          <path
            d="M6 1v34m-4-4 4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </motion.svg>
      </button>
    </div>
  );
}

function Slide({
  card,
  index,
  total,
  onJump,
  closeHref,
  papeoIndex,
  postId,
  onDevEdit,
}: {
  card: Card;
  index: number;
  total: number;
  onJump?: (to: number) => void;
  closeHref: string;
  papeoIndex: number;
  postId: string;
  onDevEdit?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const bleed = isBleed(card);
  const editorial = isEditorial(card);
  const floatingChrome = bleed || editorial;
  const tone = card.type === "photo" ? tones.canvas : tones[card.tone];
  const bar = floatingChrome ? "bg-canvas" : `${tone.bg} ${tone.fg}`;
  const ink = floatingChrome
    ? `text-paper ${bleed ? "[text-shadow:0_1px_12px_rgba(0,0,0,0.45)]" : ""}`
    : tone.mute;
  const mark = "font-brown text-[0.65rem] tracking-[0.16em] uppercase";

  return (
    <section className="flex h-full min-h-full w-full shrink-0 snap-start snap-always items-center justify-center px-3 py-3">
      <div
        ref={cardRef}
        className={`relative flex h-full w-full max-w-[36rem] flex-col overflow-hidden ${
          editorial
            ? "items-center justify-center"
            : "md:border md:border-white/15"
        } ${bar}`}
      >
        <div
          className={
            floatingChrome
              ? "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5"
              : "relative z-10 flex shrink-0 items-baseline justify-between px-5 pt-4"
          }
        >
          <p
            className={`font-brown text-[0.65rem] tracking-[0.18em] uppercase ${ink}`}
          >
            {index + 1} / {total}
          </p>
          <div className="pointer-events-auto flex items-center gap-3">
            {onDevEdit ? (
              <button
                type="button"
                className={`${mark} rounded bg-accent px-2 py-1 text-ink [text-shadow:none]`}
                onClick={onDevEdit}
                data-share-ignore
              >
                Editar
              </button>
            ) : null}
            {index === 0 ? (
              <Link
                href={closeHref}
                className={`${mark} ${ink}`}
                data-share-ignore
              >
                Cerrar
              </Link>
            ) : null}
          </div>
        </div>
        <div className="contents">
          <CardFace
            card={card}
            shareRef={editorial ? editorialRef : undefined}
            coverCta={
              index === 0 && onJump && papeoIndex >= 0 ? (
                <CoverPapeoCta onJump={onJump} to={papeoIndex} />
              ) : undefined
            }
            coverNavigation={
              index === 0 && onJump ? (
                <CoverNavigation onJump={onJump} />
              ) : undefined
            }
          />
        </div>
        <div
          className={
            floatingChrome
              ? "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-5"
              : "relative z-10 flex shrink-0 items-center justify-between px-5 py-3"
          }
        >
          <p className={`${mark} ${ink}`}>Apidame</p>
          <button
            type="button"
            className={`pointer-events-auto ${mark} ${
              floatingChrome ? ink : ""
            }`}
            onClick={async () => {
              const element = editorial
                ? editorialRef.current
                : cardRef.current;
              if (!element || shareStatus === "generating") return;
              setShareStatus("generating");
              try {
                const shared = await shareCard(postId, card, element);
                setShareStatus(shared ? "done" : "idle");
              } catch (error) {
                console.error("No se pudo compartir la tarjeta", error);
                setShareStatus("error");
              }
              window.setTimeout(() => setShareStatus("idle"), 1800);
            }}
            disabled={shareStatus === "generating"}
            data-share-ignore
          >
            {shareStatus === "generating"
              ? "Generando"
              : shareStatus === "done"
                ? "Listo"
                : shareStatus === "error"
                  ? "Error"
                  : "Compartir"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function FeedPost({
  post = cuerdasPost,
  closeHref = "/estetica",
}: {
  post?: FeedPostData;
  closeHref?: string;
}) {
  const scroller = useRef<HTMLElement>(null);
  const page = useRef(0);
  const reduce = useReducedMotion();
  const [draft, setDraft] = useState(post);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  const [photosOpen, setPhotosOpen] = useState(false);
  const cards = draft.cards;
  const papeoIndex = cards.findIndex((card) => card.id === "papeo");

  useEffect(() => {
    setDraft(post);
  }, [post]);

  const jumpTo = useCallback(
    (to: number) => {
      const el = scroller.current;
      if (!el) return;
      const next = Math.min(cards.length - 1, Math.max(0, to));
      const far = Math.abs(next - page.current) > 1;
      page.current = next;
      el.scrollTo({
        top: next * el.clientHeight,
        behavior: reduce || far ? "auto" : "smooth",
      });
    },
    [cards, reduce],
  );

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const go = (dir: 1 | -1) => {
      jumpTo(page.current + dir);
    };

    let locked = false;
    let timer = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (locked || Math.abs(event.deltaY) < 10) return;
      locked = true;
      go(event.deltaY > 0 ? 1 : -1);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        locked = false;
      }, 620);
    };
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };
    const onScroll = () => {
      page.current = Math.round(el.scrollTop / el.clientHeight);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [jumpTo, reduce]);

  const feed = (
    <main
      ref={scroller}
      data-feed-scroller
      className="bg-canvas h-full snap-y snap-mandatory overflow-x-hidden overflow-y-auto overscroll-y-contain"
    >
      {cards.map((card, index) => (
        <Slide
          key={card.id}
          card={card}
          index={index}
          total={cards.length}
          onJump={jumpTo}
          closeHref={closeHref}
          papeoIndex={papeoIndex}
          postId={draft.slug}
          onDevEdit={
            isDev
              ? () => {
                  setEditCardId(card.id);
                  setPhotosOpen(false);
                }
              : undefined
          }
        />
      ))}
    </main>
  );

  if (!isDev) return feed;

  return (
    <DevEditorChrome
      post={draft}
      onPostChange={setDraft}
      editCardId={editCardId}
      onEditCardId={setEditCardId}
      photosOpen={photosOpen}
      onPhotosOpen={setPhotosOpen}
    >
      {feed}
    </DevEditorChrome>
  );
}
