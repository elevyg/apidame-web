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
const IMAGES_PREFIX = "/vendor/openseadragon/images/";
const SCRIPT_TIMEOUT_MS = 15000;
const DEFAULT_MARKER_SIZE = 120;
const WALL_ID = "proa-repisa";
const LOAD_ERROR_MESSAGE =
  "No se pudo cargar el visor del topo. Revisa tu conexión e inténtalo de nuevo.";

function loadScript(src: string) {
  // A tag left by an earlier attempt already fired load or error, so
  // listening on it again never settles. Replace it with a fresh tag.
  document.querySelector(`script[src="${src}"]`)?.remove();

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      script.remove();
      reject(new Error(`Timed out loading OpenSeadragon from ${src}`));
    }, SCRIPT_TIMEOUT_MS);

    script.src = src;
    script.async = true;
    script.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      reject(new Error(`Failed to load OpenSeadragon from ${src}`));
    };
    document.body.appendChild(script);
  });
}

async function loadOpenSeadragon() {
  if (window.OpenSeadragon) return "cached";

  let lastError: unknown = null;
  for (const src of [SCRIPT_SRC, CDN_SRC]) {
    try {
      await loadScript(src);
    } catch (err) {
      lastError = err;
    }
    if (window.OpenSeadragon) return src;
  }
  throw (
    lastError ??
    new Error("OpenSeadragon is not defined after loading the script")
  );
}

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
  const [scriptSource, setScriptSource] = useState<string | null>(null);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const image = data?.image;

  useEffect(() => {
    if (!containerRef.current) return;
    if (!image) return;

    let cancelled = false;
    loadOpenSeadragon()
      .then((source) => {
        if (cancelled) return;
        setScriptSource(source);
      })
      .catch((err) => {
        if (cancelled) return;
        posthog.captureException(err, { wall: WALL_ID, attempt });
        setViewerError(LOAD_ERROR_MESSAGE);
      });

    return () => {
      cancelled = true;
    };
  }, [image, attempt]);

  useEffect(() => {
    if (!scriptSource) return;
    if (!image) return;
    if (!containerRef.current) return;
    if (!window.OpenSeadragon) {
      posthog.captureException(
        new Error(
          "OpenSeadragon no está disponible después de cargar el script",
        ),
      );
      setViewerError(LOAD_ERROR_MESSAGE);
      return;
    }

    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    const startedAt = performance.now();
    const viewer = window.OpenSeadragon({
      element: containerRef.current,
      tileSources: image.dziPath,
      prefixUrl: IMAGES_PREFIX,
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
      posthog.capture("topo_viewer_ready", {
        wall: WALL_ID,
        script_source: scriptSource,
        load_ms: Math.round(performance.now() - startedAt),
        attempt,
      });
    });

    viewer.addHandler("open-failed", (event) => {
      posthog.captureException(
        new Error(`OpenSeadragon could not open tiles: ${event.message}`),
        { wall: WALL_ID, tile_source: image.dziPath, attempt },
      );
      setViewerError(LOAD_ERROR_MESSAGE);
    });

    return () => {
      viewer.destroy();
      if (viewerRef.current === viewer) viewerRef.current = null;
    };
  }, [scriptSource, image, attempt]);

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
        <button
          type="button"
          onClick={() => {
            setViewerError(null);
            setAttempt((value) => value + 1);
          }}
          className="font-brown text-canvas-ink border border-white/40 px-3 py-2 text-[10px] tracking-[0.18em] uppercase hover:text-white"
        >
          Reintentar
        </button>
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
