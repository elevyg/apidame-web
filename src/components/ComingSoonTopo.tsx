import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type ComingSoonTopoProps = {
  title: string;
  description: string;
};

export default function ComingSoonTopo({
  title,
  description,
}: ComingSoonTopoProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader current="cerro" />
      <section className="page-shell flex flex-1 flex-col justify-center py-20">
        <p className="kicker">Cerro Apidame</p>
        <h1 className="font-display mt-4 text-4xl md:text-6xl">{title}</h1>
        <p className="measure mt-6 font-brown text-base leading-relaxed text-ink-soft">
          {description}
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
