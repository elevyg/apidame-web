import Image from "next/image";
import Link from "next/link";
import { posts, type Block, type Post } from "./posts";

function BlockView({ block }: { block: Block }) {
  if (block.type === "kicker") {
    return <p className="kicker pt-6">{block.text}</p>;
  }

  if (block.type === "pull") {
    return (
      <p className="font-display py-4 text-3xl leading-[1.15] tracking-tight md:text-4xl">
        {block.text}
      </p>
    );
  }

  if (block.type === "photo") {
    return (
      <figure className="-mx-5 md:mx-0">
        <div className="relative aspect-[3/4] md:aspect-[3/2]">
          <Image
            src={block.src}
            alt={block.alt}
            fill
            sizes="(max-width: 768px) 100vw, 42rem"
            className="object-cover object-[50%_70%]"
          />
        </div>
        {block.caption ? (
          <figcaption className="px-5 pt-3 font-brown text-sm text-ink-soft md:px-0">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <p className="font-brown text-base leading-[1.7] text-ink md:text-[1.05rem] md:leading-[1.75]">
      {block.text}
    </p>
  );
}

function Article({ post }: { post: Post }) {
  return (
    <article className="border-b border-rule px-5 py-12 md:px-0 md:py-16">
      <p className="kicker">{post.place}</p>
      <h1 className="font-display mt-4 text-[2.15rem] leading-[1.05] tracking-tight md:text-5xl">
        {post.title}
      </h1>
      <div className="mt-10 flex flex-col gap-6 md:gap-7">
        {post.blocks.map((block, i) => (
          <BlockView key={`${post.id}-${i}`} block={block} />
        ))}
      </div>
    </article>
  );
}

export default function FeedPost() {
  return (
    <main className="min-h-dvh bg-paper text-ink">
      <header className="flex items-baseline justify-between px-5 py-4 md:mx-auto md:max-w-xl md:px-0">
        <p className="font-brown text-xs tracking-[0.18em] uppercase">
          Apidame
        </p>
        <Link
          href="/estetica"
          className="font-brown text-xs tracking-[0.16em] text-ink-soft uppercase"
        >
          Cerrar
        </Link>
      </header>
      <div className="md:mx-auto md:max-w-xl">
        {posts.map((post) => (
          <Article key={post.id} post={post} />
        ))}
        <p className="px-5 py-16 font-brown text-sm text-ink-soft md:px-0">
          Acá vendría el post siguiente. El feed sigue hacia abajo.
        </p>
      </div>
    </main>
  );
}
