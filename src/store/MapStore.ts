import { LatLngExpression } from "leaflet";
import { create } from "zustand";

interface MapStore {
  zoom: number;
  shapes: { [key: string]: LatLngExpression[] };
  startShape: { id: string; loc: LatLngExpression }[] | undefined;
  startId: number;
  setZoom: (zoom: number) => void;
  addToStartShape: (latLng: LatLngExpression) => void;
  removeStartShape: (id: string) => void;
  clearStartShape: () => void;
  setShapes: (shapes: { [key: string]: LatLngExpression[] }) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  zoom: 12,
  shapes: {},
  startId: 0,
  startShape: [],
  addToStartShape: (latLng) => {
    const ss = get().startShape;
    const id = get().startId;
    ss?.push({ id: id.toString(), loc: latLng });
    return set(() => ({
      startId: id + 1,
      startShape: ss,
    }));
  },
  removeStartShape: (id) => {
    const ss = get().startShape;
    ss?.splice(
      ss?.findIndex((point) => point.id === id),
      1
    );
    console.log(ss);
    return set(() => ({
      startShape: ss,
    }));
  },
  clearStartShape: () => set(() => ({ startShape: [], startId: 0 })),
  setZoom: (zoom) => set(() => ({ zoom: zoom })),
  setShapes: (shapes) => set(() => ({ shapes: shapes })),
}));
