"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import { stories, type Beat, type Story } from "./stories";

const SOLID_MS = 4200;
const PHOTO_MS = 5000;
const VIDEO_MS = 7000;
const TAP_MS = 280;
const EDGE = 0.28;

function durationFor(beat: Beat) {
  if (beat.type === "solid") return SOLID_MS;
  if (beat.type === "photo") return PHOTO_MS;
  return VIDEO_MS;
}

function BeatView({
  beat,
  paused,
  reduce,
}: {
  beat: Beat;
  paused: boolean;
  reduce: boolean | null;
}) {
  if (beat.type === "solid") {
    const ink = beat.tone === "ink";
    return (
      <div
        className={`flex h-full flex-col justify-end px-6 pb-14 pt-24 ${
          ink ? "bg-canvas text-canvas-ink" : "bg-paper text-ink"
        }`}
      >
        {beat.kicker ? (
          <p
            className={`kicker ${ink ? "text-canvas-ink/55" : "text-ink-soft"}`}
          >
            {beat.kicker}
          </p>
        ) : null}
        <p className="font-display mt-5 whitespace-pre-line text-[2.35rem] leading-[1.05] tracking-tight md:text-5xl">
          {beat.text}
        </p>
        {beat.note ? (
          <p
            className={`mt-8 font-brown text-sm ${
              ink ? "text-canvas-ink/55" : "text-ink-soft"
            }`}
          >
            {beat.note}
          </p>
        ) : null}
      </div>
    );
  }

  const mediaSrc = beat.type === "video" ? beat.poster : beat.src;
  const isVideo = beat.type === "video" && beat.src;

  return (
    <div className="relative h-full bg-canvas">
      {isVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={beat.src}
          poster={beat.poster}
          muted
          playsInline
          autoPlay={!paused}
        />
      ) : (
        <Image
          src={mediaSrc}
          alt={beat.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 420px"
          className={`object-cover ${
            beat.type === "video" && !reduce
              ? paused
                ? "scale-110"
                : "animate-story-drift"
              : ""
          }`}
        />
      )}
      {beat.caption ? (
        <p className="absolute inset-x-0 bottom-0 bg-canvas px-6 py-4 font-brown text-sm tracking-[0.14em] text-canvas-ink uppercase">
          {beat.caption}
        </p>
      ) : null}
    </div>
  );
}

function Progress({
  story,
  beatIndex,
  paused,
  reduce,
  light,
}: {
  story: Story;
  beatIndex: number;
  paused: boolean;
  reduce: boolean | null;
  light: boolean;
}) {
  const ms = durationFor(story.beats[beatIndex]!);
  const track = light ? "bg-ink/20" : "bg-white/30";
  const fill = light ? "bg-ink" : "bg-white";

  return (
    <div className="flex gap-1">
      {story.beats.map((_, i) => (
        <div
          key={
            i === beatIndex
              ? `active-${story.id}-${beatIndex}`
              : `${story.id}-${i}`
          }
          className={`h-[2px] flex-1 overflow-hidden ${track}`}
        >
          <div
            className={`h-full origin-left ${fill}`}
            style={
              i < beatIndex
                ? { transform: "scaleX(1)" }
                : i > beatIndex
                  ? { transform: "scaleX(0)" }
                  : reduce
                    ? { transform: "scaleX(0)" }
                    : {
                        transform: "scaleX(0)",
                        animation: `story-fill ${ms}ms linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                      }
            }
          />
        </div>
      ))}
    </div>
  );
}

export default function StoryDeck() {
  const reduce = useReducedMotion();
  const [storyIndex, setStoryIndex] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hint, setHint] = useState(true);
  const pointer = useRef<{ x: number; at: number } | null>(null);
  const remain = useRef(SOLID_MS);
  const lastTick = useRef(Date.now());

  const story = stories[storyIndex]!;
  const beat = story.beats[beatIndex]!;

  const go = useCallback(
    (dir: 1 | -1) => {
      setHint(false);
      setPaused(false);
      const nextBeat = beatIndex + dir;
      if (nextBeat >= 0 && nextBeat < story.beats.length) {
        setBeatIndex(nextBeat);
        return;
      }
      const nextStory =
        (storyIndex + dir + stories.length) % stories.length;
      setStoryIndex(nextStory);
      setBeatIndex(
        dir === 1 ? 0 : stories[nextStory]!.beats.length - 1,
      );
    },
    [beatIndex, story.beats.length, storyIndex],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === " ") {
        event.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    remain.current = durationFor(beat);
    lastTick.current = Date.now();
  }, [beat, storyIndex, beatIndex]);

  useEffect(() => {
    if (reduce) return;
    if (paused) {
      remain.current -= Date.now() - lastTick.current;
      return;
    }
    lastTick.current = Date.now();
    const id = window.setTimeout(() => go(1), remain.current);
    return () => window.clearTimeout(id);
  }, [paused, reduce, beat, storyIndex, beatIndex, go]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointer.current = { x: event.clientX, at: Date.now() };
    setPaused(true);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    pointer.current = null;
    setPaused(false);
    if (!start) return;
    const held = Date.now() - start.at;
    if (held >= TAP_MS) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    go(x < EDGE ? -1 : 1);
  };

  const light = beat.type === "solid" && beat.tone === "paper";
  const chrome = light ? "text-ink" : "text-white";
  const chromeMute = light ? "text-ink-soft" : "text-white/50";
  const chromeLink = light ? "text-ink/70" : "text-white/70";

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-canvas-ink md:items-center md:justify-center md:py-8">
      <style>{`
        @keyframes story-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes story-drift {
          from { transform: scale(1); }
          to { transform: scale(1.12); }
        }
        .animate-story-drift {
          animation: story-drift 7s linear forwards;
        }
      `}</style>

      <div className="relative h-dvh w-full overflow-hidden md:h-auto md:max-h-[min(90dvh,52rem)] md:w-[min(100%,28rem)] md:aspect-[9/16] md:border md:border-white/15">
        <BeatView beat={beat} paused={paused} reduce={reduce} />

        <div className="absolute inset-x-0 top-0 z-30 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Progress
            story={story}
            beatIndex={beatIndex}
            paused={paused}
            reduce={reduce}
            light={light}
          />
          <div className="mt-3 flex items-baseline justify-between px-1">
            <p
              className={`font-brown text-xs tracking-[0.18em] uppercase ${chrome}`}
            >
              {story.place}
              <span className={chromeMute}> · {story.title}</span>
            </p>
            <Link
              href="/estetica"
              className={`font-brown text-xs tracking-[0.16em] uppercase ${chromeLink}`}
            >
              Cerrar
            </Link>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 top-16 z-20 touch-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            pointer.current = null;
            setPaused(false);
          }}
        />

        {hint ? (
          <p
            className={`pointer-events-none absolute left-0 right-0 top-16 z-30 text-center font-brown text-[0.65rem] tracking-[0.2em] uppercase ${chromeLink}`}
          >
            Toca a la derecha · mantén para pausar
          </p>
        ) : null}
      </div>

      <p className="mt-4 hidden font-brown text-[0.65rem] tracking-[0.2em] text-white/40 uppercase md:block">
        Maqueta · 9:16 · {storyIndex + 1}/{stories.length} entregas · flechas
      </p>
    </div>
  );
}
