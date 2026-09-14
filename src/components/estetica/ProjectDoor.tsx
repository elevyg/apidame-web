import Image from "next/image";

type ProjectDoorProps = {
  src: string;
  alt: string;
  title: string;
  score?: number;
  use?: string;
  note?: string;
};

export default function ProjectDoor({
  src,
  alt,
  title,
  score,
  use,
  note,
}: ProjectDoorProps) {
  return (
    <figure>
      <div className="relative aspect-[3/4] overflow-hidden bg-paper-deep">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 50vw"
        />
      </div>
      <figcaption className="mt-3 font-brown text-xs leading-snug">
        <span className="block text-ink">{title}</span>
        {score !== undefined ? (
          <span className="mt-1 block text-ink-soft">
            {score}/10{use ? ` · ${use}` : ""}
          </span>
        ) : null}
        {note ? <span className="mt-1 block text-ink-soft">{note}</span> : null}
      </figcaption>
    </figure>
  );
}
