import DeportivaPageTransition from "@/components/climbing/DeportivaPageTransition";

export default function ZoneLoading() {
  return (
    <DeportivaPageTransition>
      <main
        className="flex flex-1 flex-col"
        aria-busy="true"
        aria-label="Cargando zona"
      >
        <div className="page-shell border-rule animate-pulse border-b py-12 md:py-16">
          <div className="border-rule size-10 border" />
          <div className="bg-beige mt-4 h-10 w-2/3 max-w-md md:h-14" />
          <div className="measure mt-6 space-y-3">
            <div className="bg-beige h-4 w-full" />
            <div className="bg-beige h-4 w-11/12" />
            <div className="bg-beige h-4 w-3/4" />
          </div>
          <div className="bg-beige mt-8 h-4 w-32" />
        </div>
        <div className="page-shell animate-pulse py-12">
          <div className="bg-beige h-4 w-20" />
          <div className="bg-beige mt-3 h-8 w-1/2 max-w-xs" />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="border-rule h-24 border" />
            <div className="border-rule h-24 border" />
          </div>
        </div>
      </main>
    </DeportivaPageTransition>
  );
}
