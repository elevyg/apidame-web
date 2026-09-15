import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
      <section className="border-paper bg-canvas text-paper border-b">
        <div className="page-shell flex min-h-[68svh] w-full min-w-0 flex-col justify-end py-7 md:py-10">
          <div className="w-full max-w-5xl min-w-0 py-16 md:py-24">
            <p className="text-[0.7rem] tracking-[0.22em] uppercase">
              Equipo / oficio / terreno
            </p>
            <h1 className="mt-5 w-full max-w-4xl min-w-0 text-[clamp(2.7rem,12vw,8rem)] leading-[0.86] font-normal tracking-[-0.065em] italic">
              Notas de cordada
            </h1>
          </div>
          <p className="border-paper max-w-xl border-t pt-5 text-base leading-snug md:text-xl">
            Apuntes personales sobre las decisiones que se toman antes, durante
            y después de un largo.
          </p>
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
                <article key={post.slug} className="border-ink border-b">
                  <Link
                    href={`/notas-de-cordada/${post.slug}`}
                    className="group focus-visible:outline-ink grid min-w-0 gap-8 py-8 focus-visible:outline-2 focus-visible:outline-offset-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] md:items-stretch md:gap-12 md:py-12"
                  >
                    <div className="flex min-h-80 min-w-0 flex-col justify-between">
                      <div>
                        <p className="text-[0.65rem] tracking-[0.18em] uppercase">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-7 w-full min-w-0 text-[clamp(2.1rem,8vw,5.5rem)] leading-[0.92] tracking-[-0.055em] italic">
                          {post.title}
                        </h3>
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
                        <Image
                          src={cover.src}
                          alt={cover.alt}
                          fill
                          sizes="(max-width: 767px) 100vw, 42vw"
                          className={`object-cover ${cover.object}`}
                        />
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
