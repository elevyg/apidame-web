"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export type Plate = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ThumbDock = "corners" | "foot";

type ProjectClusterProps = {
  id?: string;
  name?: string;
  kicker?: string;
  cta?: { label: string; href?: string };
  body?: string;
  heading?: "h1" | "h2";
  primary: Plate;
  thumbs?: Plate[];
  thumbDock?: ThumbDock;
  layout: "photo-end" | "photo-start" | "banner";
  priority?: boolean;
};

function Action({
  cta,
}: {
  cta: NonNullable<ProjectClusterProps["cta"]>;
}) {
  const className =
    "mt-5 inline-flex min-h-11 items-center font-brown text-sm tracking-[0.16em] uppercase";

  if (!cta.href) {
    return <p className={`${className} text-ink-soft`}>{cta.label}</p>;
  }

  return (
    <Link
      href={cta.href}
      className={`${className} underline decoration-from-font underline-offset-4`}
    >
      {cta.label}
    </Link>
  );
}

function PlateImage({
  plate,
  sizes,
  priority,
  className,
}: {
  plate: Plate;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={plate.src}
      alt={plate.alt}
      width={plate.width}
      height={plate.height}
      sizes={sizes}
      priority={priority}
      className={`block h-auto w-full ${className ?? ""}`}
    />
  );
}

function thumbClass(layout: "photo-end" | "photo-start", index: number) {
  if (layout === "photo-start") {
    return index === 0
      ? "pointer-events-none absolute w-[42%] max-w-[10.5rem] -right-3 bottom-[-1.35rem] md:w-[44%] md:max-w-[11.5rem] md:-right-8 md:bottom-[-1.75rem]"
      : "pointer-events-none absolute w-[34%] max-w-[8.5rem] -left-2 top-[28%] md:w-[36%] md:max-w-[9.5rem] md:-left-10 md:top-[22%]";
  }

  return index === 0
    ? "pointer-events-none absolute w-[42%] max-w-[10.5rem] -left-3 bottom-[-1.35rem] md:w-[44%] md:max-w-[11.5rem] md:-left-8 md:bottom-[-1.75rem]"
    : "pointer-events-none absolute w-[34%] max-w-[8.5rem] -right-2 top-[28%] md:w-[36%] md:max-w-[9.5rem] md:-right-10 md:top-[22%]";
}

function footThumbClass(index: number) {
  return index === 0
    ? "pointer-events-none w-[36%] max-w-[8.5rem] md:w-[38%] md:max-w-[9.5rem]"
    : "pointer-events-none w-[28%] max-w-[7rem] translate-y-3 md:w-[30%] md:max-w-[8rem]";
}

export default function ProjectCluster({
  id,
  name,
  kicker,
  cta,
  body,
  heading = "h2",
  primary,
  thumbs = [],
  thumbDock = "corners",
  layout,
  priority = false,
}: ProjectClusterProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const awake = useInView(ref, {
    amount: 0.22,
    margin: "0px 0px -18% 0px",
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const showThumbs = thumbs.length > 0 && (reduce || awake);

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    setOffset({ x: x * 6, y: y * 6 });
  }

  function onLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const Title = heading === "h1" ? "h1" : "h2";
  const hasCopy = Boolean(name || kicker || cta || body);
  const copy = hasCopy ? (
    <div
      className={
        layout === "banner"
          ? ""
          : body
            ? "md:w-[22rem] md:shrink-0"
            : "md:w-[13.5rem] md:shrink-0"
      }
    >
      {kicker ? <p className="kicker mb-3">{kicker}</p> : null}
      {name ? (
        <Title className="font-display text-3xl leading-[0.9] md:text-5xl">
          {name}
        </Title>
      ) : null}
      {name || kicker ? (
        <span className="mt-4 block h-px w-16 md:mt-5">
          <motion.span
            className="block h-px bg-ink"
            initial={false}
            animate={{ width: awake || reduce ? 64 : 16 }}
            transition={{ duration: 0.6, ease }}
          />
        </span>
      ) : null}
      {body
        ? body.split(/\n\n+/).map((paragraph, index) => (
            <p
              key={paragraph}
              className={`${index === 0 ? "mt-6" : "mt-4"} font-brown text-base leading-relaxed text-ink-soft md:text-lg`}
            >
              {paragraph}
            </p>
          ))
        : null}
      {cta ? <Action cta={cta} /> : null}
    </div>
  ) : null;

  const photos = (
    <div className={layout === "banner" ? "w-full" : "min-w-0 flex-1"}>
      <div
        className={
          layout === "banner"
            ? "w-full"
            : `relative w-full max-w-full md:w-fit ${
                thumbs.length > 0 && thumbDock === "corners"
                  ? "pb-10 md:pb-12"
                  : ""
              }`
        }
      >
        <div
          className="overflow-hidden"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <motion.div
            animate={reduce ? undefined : { x: offset.x, y: offset.y }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 22,
              mass: 0.4,
            }}
          >
            <PlateImage
              plate={primary}
              priority={priority}
              sizes={
                layout === "banner"
                  ? "100vw"
                  : "(min-width: 768px) 36rem, 100vw"
              }
              className={
                layout === "banner"
                  ? "max-h-[min(52vh,28rem)] object-cover object-[50%_38%] md:max-h-[min(62vh,36rem)]"
                  : "md:max-h-[min(64vh,36rem)] md:w-auto"
              }
            />
          </motion.div>
        </div>

        {layout !== "banner" && thumbDock === "corners"
          ? thumbs.map((thumb, index) => (
              <motion.div
                key={thumb.src}
                className={thumbClass(layout, index)}
                initial={false}
                animate={{
                  opacity: showThumbs ? 1 : 0,
                  x:
                    reduce || showThumbs
                      ? 0
                      : (layout === "photo-start") === (index === 0)
                        ? 14
                        : -14,
                  y: reduce || showThumbs ? 0 : 10,
                }}
                transition={{
                  duration: 0.55,
                  delay: showThumbs ? 0.08 + index * 0.08 : 0,
                  ease,
                }}
              >
                <PlateImage plate={{ ...thumb, alt: "" }} sizes="180px" />
              </motion.div>
            ))
          : null}

        {layout !== "banner" && thumbDock === "foot"
          ? (
              <div
                className={`relative z-10 -mt-3 flex items-start justify-between md:-mt-4 ${
                  layout === "photo-start" ? "flex-row-reverse" : ""
                }`}
              >
                {thumbs.map((thumb, index) => (
                  <motion.div
                    key={thumb.src}
                    className={footThumbClass(index)}
                    initial={false}
                    animate={{
                      opacity: showThumbs ? 1 : 0,
                      y: reduce || showThumbs ? 0 : 12,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: showThumbs ? 0.08 + index * 0.08 : 0,
                      ease,
                    }}
                  >
                    <PlateImage plate={{ ...thumb, alt: "" }} sizes="180px" />
                  </motion.div>
                ))}
              </div>
            )
          : null}
      </div>
    </div>
  );

  return (
    <article ref={ref} id={id}>
      {layout === "banner" ? (
        <div className="flex flex-col gap-6 md:gap-8">
          {copy}
          {photos}
        </div>
      ) : (
        <div
          className={
            layout === "photo-start"
              ? "flex flex-col gap-6 md:flex-row-reverse md:items-start md:justify-start md:gap-12"
              : "flex flex-col gap-6 md:flex-row md:items-start md:justify-start md:gap-12"
          }
        >
          {copy}
          {photos}
        </div>
      )}
    </article>
  );
}
