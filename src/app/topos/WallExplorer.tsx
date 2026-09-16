"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";
import type { OpenSeadragonViewer } from "./openseadragon.d";
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
  const viewerRef = useRef<OpenSeadragonViewer | null>(null);
  const overlayMapRef = useRef<Map<string, HTMLElement>>(new Map());
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);

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
      .catch((err) => {
        posthog.captureException(err);
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
      posthog.captureException(
        new Error(
          "OpenSeadragon no está disponible después de cargar el script",
        ),
      );
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
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      showNavigator: true,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false,
      showNavigationControl: false,
      gestureSettingsMouse: {
        scrollToZoom: true,
      },
    });

    viewerRef.current = viewer;

    if (window.OpenSeadragon?.ControlAnchor && viewer.navigator?.setPosition) {
      viewer.navigator.setPosition(
        window.OpenSeadragon.ControlAnchor.BOTTOM_RIGHT,
      );
    }

    viewer.addHandler("open", () => {
      viewer.viewport.goHome(true);
    });

    return () => {
      viewer.destroy();
    };
  }, [scriptLoaded, image]);

  const visibleRouteMap = useMemo(() => {
    return new Map(visibleRoutes.map((route) => [route.id, route]));
  }, [visibleRoutes]);

  useEffect(() => {
    const viewer = viewerRef.current;
    const OSD = window.OpenSeadragon;
    if (!viewer || !image || !OSD) return;

    overlayMapRef.current.forEach((element) => {
      viewer.removeOverlay(element);
    });
    overlayMapRef.current.clear();

    visibleRoutes.forEach((route) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className =
        "topo-marker flex flex-col items-center gap-1 px-3 py-2 font-brown text-[9px]";
      element.setAttribute("aria-label", `${route.name} ${route.grade}`);
      element.innerHTML = `<span class=\"border border-white/40 px-2 py-[2px] text-[8px] text-white/80\">${route.grade}</span><span class=\"text-[9px] text-canvas-ink\">${route.name}</span>`;
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
        placement: OSD.Placement.CENTER,
      });

      overlayMapRef.current.set(route.id, element);
    });
  }, [visibleRoutes, image, onSelectRoute]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !image) return;

    if (!selectedRouteId) {
      overlayMapRef.current.forEach((element) => {
        element.dataset.selected = "false";
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
      element.dataset.selected = id === selectedRouteId ? "true" : "false";
    });
  }, [selectedRouteId, visibleRouteMap, image]);

  if (error) {
    return (
      <div className="font-brown text-signal flex h-full items-center justify-center p-6 text-center text-xs">
        {error}
      </div>
    );
  }

  if (!image) {
    return (
      <div className="font-brown flex h-full items-center justify-center p-6 text-center text-xs text-white/50">
        Cargando topo...
      </div>
    );
  }

  if (viewerError) {
    return (
      <div className="font-brown text-signal flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-xs">
        <p>{viewerError}</p>
        <p className="text-white/50">Se mostrará el topo descargable abajo.</p>
      </div>
    );
  }

  const handleZoom = (factor: number) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const currentZoom = viewer.viewport.getZoom();
    const center = viewer.viewport.getCenter();
    viewer.viewport.zoomTo(currentZoom * factor, center, true);
  };

  const handleReset = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.viewport.goHome(true);
  };

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-3">
        <div className="bg-canvas/80 pointer-events-auto flex items-center gap-3 border border-white/25 px-3 py-2 backdrop-blur-sm">
          <span className="font-brown text-[10px] tracking-[0.18em] text-white/55 uppercase">
            Controles
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleZoom(1.2)}
              className="font-brown text-canvas-ink text-[10px] hover:text-white"
            >
              Zoom +
            </button>
            <button
              type="button"
              onClick={() => handleZoom(0.85)}
              className="font-brown text-canvas-ink text-[10px] hover:text-white"
            >
              Zoom -
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="font-brown text-canvas-ink text-[10px] hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
