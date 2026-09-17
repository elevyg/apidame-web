import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import TopoClient from "../TopoClient";
import { pageMetadata } from "../../seo";

export const metadata: Metadata = pageMetadata({
  title: "Proa y Repisa Central",
  description:
    "Topo interactivo de Proa y Repisa Central en el Cerro Apidame, también llamado Cerro Colorado, cerca de Chile Chico.",
  path: "/topos/proa-repisa",
});

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
