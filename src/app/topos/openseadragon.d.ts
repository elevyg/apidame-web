declare global {
  interface Window {
    OpenSeadragon?: OpenSeadragonConstructor;
  }
}

export interface OpenSeadragonViewport {
  goHome(immediately?: boolean): void;
  imageToViewportRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
  ): { x: number; y: number; width: number; height: number };
  imageToViewportCoordinates(x: number, y: number): { x: number; y: number };
  getMaxZoom(): number;
  zoomTo(
    zoom: number,
    refPoint: { x: number; y: number },
    immediately?: boolean,
  ): void;
  panTo(refPoint: { x: number; y: number }, immediately?: boolean): void;
}

export interface OpenSeadragonNavigator {
  setPosition(anchor: number): void;
}

export interface OpenSeadragonViewer {
  viewport: OpenSeadragonViewport;
  navigator?: OpenSeadragonNavigator;
  addHandler(event: string, handler: () => void): void;
  removeOverlay(element: HTMLElement): void;
  addOverlay(options: {
    element: HTMLElement;
    location: { x: number; y: number; width: number; height: number };
    placement: number;
  }): void;
  destroy(): void;
}

export type OpenSeadragonConstructor = {
  (options: {
    element: HTMLElement;
    tileSources: string;
    prefixUrl?: string;
    showNavigator?: boolean;
    showZoomControl?: boolean;
    showHomeControl?: boolean;
    showFullPageControl?: boolean;
    showNavigationControl?: boolean;
    gestureSettingsMouse?: { scrollToZoom?: boolean };
  }): OpenSeadragonViewer;
  ControlAnchor: { BOTTOM_RIGHT: number; [key: string]: number };
  Placement: { CENTER: number; [key: string]: number };
};

export {};
