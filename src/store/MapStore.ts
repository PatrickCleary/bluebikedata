import { create } from "zustand";

interface MapStore {
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  zoom: 12,
  setZoom: (zoom) => set(() => ({ zoom: zoom })),
}));
