import SiteHeader from "@/components/SiteHeader";
import TopoClient from "../TopoClient";

export default function ProaRepisa() {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <SiteHeader current="cerro" tone="canvas" markHref="/topos" />
      <div className="flex min-h-0 flex-1 flex-col">
        <TopoClient />
      </div>
    </main>
  );
}
