import { create } from "zustand";
import { getConfig } from "../api/config";
import { Shape } from "../types/apis";
import { useConfigStore } from "./ConfigStore";
import { useLoadingStore } from "./LoadingStore";
import { useSetBothShapesAndDocks } from "./SelectStore";

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
  const setFromConfig = useConfigStore((store) => store.setFromConfig);
  const setIsLoading = useLoadingStore((store) => store.setIsLoading);
  const setBothShapesAndDocks = useSetBothShapesAndDocks();
  return async (id: string) => {
    const config = await getConfig(id);
    const formattedShape = config[0].shape;
    const shapesToSet: Shape = { origin: [], destination: [] };
    Object.keys(formattedShape).forEach((direction) => {
      if (formattedShape[direction].length) {
        const reassignIds = formattedShape[direction].map((point, index) => ({
          ...point,
          id: index,
        }));
        shapesToSet[direction] = reassignIds;
      }
    });
    
    setBothShapesAndDocks(shapesToSet, {
      destination: config[0]?.destinationDock,
      origin: config[0]?.originDock,
    });
    setFromConfig(config[0]);
    setIsLoading(false);
  };
};
