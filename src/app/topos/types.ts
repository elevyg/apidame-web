export type TopoImage = {
  dziPath: string;
  width: number;
  height: number;
};

export type TopoSector = {
  id: string;
  name: string;
  color: string;
};

export type TopoRoute = {
  id: string;
  name: string;
  grade: string;
  sectorId: string;
  marker: {
    x: number;
    y: number;
  };
};

export type TopoData = {
  image: TopoImage;
  sectors: TopoSector[];
  routes: TopoRoute[];
};

export type FeaturedRoute = {
  id: string;
  name: string;
  thumbnail: string | null;
  webViewLink: string | null;
  modifiedTime: string | null;
};
