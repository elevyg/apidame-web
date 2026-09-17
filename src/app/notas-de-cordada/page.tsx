import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NotaShared } from "@/components/estetica/feed/NotaShared";
import {
  notaCoverName,
  notasIndexTitleName,
  notaTitleName,
} from "@/components/estetica/feed/notaTransition";
import { getPostCover, posts } from "@/components/estetica/feed/posts";
import SiteHeader from "@/components/SiteHeader";

const description =
  "Notas sobre escalada tradicional, equipo y decisiones de cordada desde Chile Chico.";

export function generateMetadata(): Metadata {
  return {
    title: "Notas de cordada",
    description,
    alternates: { canonical: "/notas-de-cordada" },
    openGraph: {
      title: "Notas de cordada · Apidame",
      description,
      url: "/notas-de-cordada",
      siteName: "Apidame",
      locale: "es_CL",
      type: "website",
      images: [
        {
          url: "/notas-de-cordada/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Notas de cordada de Apidame",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Notas de cordada · Apidame",
      description,
      images: ["/notas-de-cordada/opengraph-image"],
    },
  };
}

export default function NotasDeCordadaPage() {
  return (
    <main className="bg-paper text-ink min-h-dvh overflow-x-hidden">
      <SiteHeader current="notas-de-cordada" />
      <section className="border-paper bg-canvas text-paper relative isolate overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 md:inset-y-0 md:right-0 md:left-auto md:w-[min(42%,34rem)]">
          <Image
            src="/notas-de-cordada/reunion.jpg"
            alt="Cordada en reunión: dos escaladores en una fisura sobre el valle"
            fill
            priority
            quality={92}
            sizes="(max-width: 767px) 100vw, 34rem"
            className="object-cover object-[72%_42%] md:object-[48%_40%]"
          />
          <div className="from-canvas/15 via-canvas/45 to-canvas md:via-canvas/20 md:to-canvas absolute inset-0 bg-gradient-to-b via-58% md:bg-gradient-to-l md:from-transparent md:from-50% md:via-85%" />
        </div>
        <div className="relative flex min-h-[68svh] flex-col justify-end md:min-h-[72svh] md:flex-row">
          <div className="page-shell flex w-full min-w-0 flex-1 flex-col justify-end py-7 md:max-w-none md:py-10">
            <div className="w-full max-w-5xl min-w-0 py-16 md:py-24">
              <NotaShared name={notasIndexTitleName} share="text-morph">
                <h1 className="w-full max-w-4xl min-w-0 text-[clamp(2.7rem,12vw,8rem)] leading-[0.86] font-normal tracking-[-0.065em] italic">
                  Notas de cordada
                </h1>
              </NotaShared>
            </div>
            <p className="border-paper max-w-xl border-t pt-5 text-base leading-snug md:text-xl">
              Apuntes personales sobre las decisiones que se toman antes,
              durante y después de un largo. Sigue estos consejos bajo tu propio
              riesgo.
            </p>
          </div>
          <div
            className="hidden md:block md:w-[min(42%,34rem)] md:shrink-0"
            aria-hidden
          />
        </div>
      </section>

      <section className="bg-beige" aria-labelledby="notas-publicadas">
        <div className="page-shell min-w-0 py-16 md:py-24">
          <div className="border-ink mb-10 flex items-end justify-between border-b pb-4 text-[0.68rem] tracking-[0.18em] uppercase">
            <h2 id="notas-publicadas">Notas publicadas</h2>
            <span>{String(posts.length).padStart(2, "0")}</span>
          </div>

          <div>
            {posts.map((post, index) => {
              const cover = getPostCover(post);

              return (
                <article
                  key={post.slug}
                  id={post.slug}
                  className="border-ink scroll-mt-24 border-b"
                >
                  <Link
                    href={`/notas-de-cordada/${post.slug}`}
                    prefetch
                    className="group focus-visible:outline-ink grid min-w-0 gap-8 py-8 focus-visible:outline-2 focus-visible:outline-offset-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] md:items-stretch md:gap-12 md:py-12"
                  >
                    <div className="flex min-h-80 min-w-0 flex-col justify-between">
                      <div>
                        <p className="text-[0.65rem] tracking-[0.18em] uppercase">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <NotaShared
                          name={notaTitleName(post.slug)}
                          share="text-morph"
                        >
                          <h3 className="mt-7 w-full min-w-0 text-[clamp(2.1rem,8vw,5.5rem)] leading-[0.92] tracking-[-0.055em] italic">
                            {post.title}
                          </h3>
                        </NotaShared>
                      </div>
                      <div className="mt-12 grid gap-6 md:grid-cols-[minmax(0,34rem)_auto] md:items-end md:justify-between">
                        <p className="text-ink-soft text-base leading-snug md:text-lg">
                          {post.description}
                        </p>
                        <span className="text-[0.68rem] tracking-[0.16em] uppercase group-hover:underline group-focus-visible:underline">
                          Abrir nota ↗
                        </span>
                      </div>
                    </div>

                    {cover ? (
                      <div className="border-ink bg-canvas relative min-h-80 overflow-hidden border md:min-h-[34rem]">
                        <NotaShared
                          name={notaCoverName(post.slug)}
                          share="nota-morph"
                        >
                          <div className="absolute inset-0">
                            <Image
                              src={cover.src}
                              alt={cover.alt}
                              fill
                              sizes="(max-width: 767px) 100vw, 42vw"
                              className={`object-cover ${cover.object}`}
                            />
                          </div>
                        </NotaShared>
                      </div>
                    ) : null}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-paper bg-canvas text-paper border-t">
        <div className="page-shell flex items-center justify-between py-8 text-[0.65rem] tracking-[0.18em] uppercase">
          <span>Apidame</span>
          <span>Notas desde la cordada</span>
        </div>
      </footer>
    </main>
  );
}
