"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { TopoData, TopoRoute } from "./types";

type WallExplorerProps = {
  data: TopoData | null;
  visibleRoutes: TopoRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
  error: string | null;
};

const SCRIPT_SRC = "/vendor/openseadragon.min.js";
const CDN_SRC =
  "https://openseadragon.github.io/openseadragon/openseadragon.min.js";
const DEFAULT_MARKER_SIZE = 120;

export default function WallExplorer({
  data,
  visibleRoutes,
  selectedRouteId,
  onSelectRoute,
  error,
}: WallExplorerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const overlayMapRef = useRef<Map<string, HTMLElement>>(new Map());
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [debugCoords, setDebugCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const searchParams = useSearchParams();
  const debugMode = searchParams.get("debug") === "1";

  const image = data?.image;

  useEffect(() => {
    if (!containerRef.current) return;
    if (!image) return;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          if (window.OpenSeadragon) {
            resolve();
          } else {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject());
          }
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });

    loadScript(SCRIPT_SRC)
      .then(() => {
        if (window.OpenSeadragon) {
          setScriptLoaded(true);
          return;
        }
        return loadScript(CDN_SRC).then(() => {
          if (window.OpenSeadragon) {
            setScriptLoaded(true);
            return;
          }
          throw new Error("OpenSeadragon no disponible");
        });
      })
      .catch(() => {
        setViewerError(
          "No se pudo cargar OpenSeadragon. Revisa el bundle local o la conexión al CDN.",
        );
      });
  }, [image]);

  useEffect(() => {
    if (!scriptLoaded) return;
    if (!image) return;
    if (!containerRef.current) return;
    if (!window.OpenSeadragon) {
      setViewerError(
        "OpenSeadragon no está disponible. Revisa el bundle local o la carga desde CDN.",
      );
      return;
    }

    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    const viewer = window.OpenSeadragon({
      element: containerRef.current,
      tileSources: image.dziPath,
      showNavigator: false,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false,
      gestureSettingsMouse: {
        scrollToZoom: true,
      },
    });

    viewerRef.current = viewer;

    viewer.addHandler("open", () => {
      viewer.viewport.goHome(true);
    });

    if (debugMode) {
      viewer.addHandler("canvas-click", (event: any) => {
        const viewportPoint = viewer.viewport.pointFromPixel(event.position);
        const imagePoint = viewer.viewport.viewportToImageCoordinates(
          viewportPoint,
        );
        const coords = {
          x: Math.round(imagePoint.x),
          y: Math.round(imagePoint.y),
        };
        setDebugCoords(coords);
        console.log("Topo coords", coords);
      });
    }

    return () => {
      viewer.destroy();
    };
  }, [scriptLoaded, image, debugMode]);

  const visibleRouteMap = useMemo(() => {
    return new Map(visibleRoutes.map((route) => [route.id, route]));
  }, [visibleRoutes]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !image) return;

    overlayMapRef.current.forEach((element) => {
      viewer.removeOverlay(element);
    });
    overlayMapRef.current.clear();

    visibleRoutes.forEach((route) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className =
        "flex flex-col items-center gap-1 rounded-full border border-secondaryA/80 bg-primaryA/80 px-3 py-2 text-[10px] font-brown text-secondaryA shadow-lg transition hover:border-secondaryB hover:text-secondaryB";
      element.setAttribute("aria-label", `${route.name} ${route.grade}`);
      element.innerHTML = `<span class=\"text-[8px] text-primaryB/70\">${route.grade}</span><span>${route.name}</span>`;
      element.onclick = () => onSelectRoute(route.id);

      const rect = viewer.viewport.imageToViewportRectangle(
        route.marker.x - DEFAULT_MARKER_SIZE / 2,
        route.marker.y - DEFAULT_MARKER_SIZE / 2,
        DEFAULT_MARKER_SIZE,
        DEFAULT_MARKER_SIZE,
      );

      viewer.addOverlay({
        element,
        location: rect,
        placement: window.OpenSeadragon.Placement.CENTER,
      });

      overlayMapRef.current.set(route.id, element);
    });
  }, [visibleRoutes, image, onSelectRoute]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !image) return;

    if (!selectedRouteId) {
      overlayMapRef.current.forEach((element) => {
        element.style.borderColor = "";
        element.style.color = "";
      });
      return;
    }

    const route = visibleRouteMap.get(selectedRouteId);
    if (!route) return;

    const targetPoint = viewer.viewport.imageToViewportCoordinates(
      route.marker.x,
      route.marker.y,
    );
    const maxZoom = viewer.viewport.getMaxZoom();
    const targetZoom = Math.min(maxZoom, 2.2);

    viewer.viewport.zoomTo(targetZoom, targetPoint, true);
    viewer.viewport.panTo(targetPoint, true);

    overlayMapRef.current.forEach((element, id) => {
      element.style.borderColor = id === selectedRouteId ? "#FF5964" : "";
      element.style.color = id === selectedRouteId ? "#FF5964" : "";
    });
  }, [selectedRouteId, visibleRouteMap, image]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-xs font-brown text-secondaryB">
        {error}
      </div>
    );
  }

  if (!image) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-xs font-brown text-primaryB/60">
        Cargando topo...
      </div>
    );
  }

  if (viewerError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-xs font-brown text-secondaryB">
        <p>{viewerError}</p>
        <p className="text-primaryB/60">Se mostrará el topo descargable abajo.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {debugMode && debugCoords ? (
        <div className="absolute right-3 top-3 rounded border border-secondaryA/60 bg-primaryA/80 px-3 py-2 text-[11px] font-brown text-secondaryA">
          x: {debugCoords.x}, y: {debugCoords.y}
        </div>
      ) : null}
    </div>
  );
}
