import { LatLngExpression } from "leaflet";
import { create } from "zustand";

interface MapStore {
  zoom: number;
  shapes: { [key: string]: LatLngExpression[] };
  setZoom: (zoom: number) => void;
  setShapes: (shapes: { [key: string]: LatLngExpression[] }) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  zoom: 12,
  shapes: {},
  setZoom: (zoom) => set(() => ({ zoom: zoom })),
  setShapes: (shapes) => set(() => ({ shapes: shapes })),
}));
