import { create } from "zustand";
import { getConfig } from "../api/config";
import { useConfigStore } from "./ConfigStore";
import { useSelectionStore, useSetDocks } from "./SelectionStore";

interface MapStore {
  zoom: number;
  originDocks: string[];
  setZoom: (zoom: number) => void;
  setOriginDocks: (docks: string[]) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  zoom: 13,
  originDocks: [],
  setOriginDocks: (docks) =>
    set(() => ({
      originDocks: docks,
    })),
  setZoom: (zoom) => set(() => ({ zoom: zoom })),
}));

export const useSetConfigFromId = () => {
  const { shape, setShape } = useSelectionStore((store) => store);
  const setFromConfig = useConfigStore((store) => store.setFromConfig);
  const setDocks = useSetDocks();
  return async (id: string) => {
    const config = await getConfig(id);
    const formattedShape = config[0].shape;
    if (formattedShape.length) {
      const reassignIds = formattedShape.map((point, index) => ({
        ...point,
        id: index,
      }));
      setShape(reassignIds);
      setDocks(reassignIds);
    }
    setFromConfig(config[0]);
  };
};
