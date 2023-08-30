import { useQuery } from "@tanstack/react-query";
import { LatLngExpression } from "leaflet";
import { create } from "zustand";
import { fetchAllData } from "../api/all_data";
import { getShape } from "../api/shapes";
import { pointInsidePolygon } from "../helpers/testLocation";
import { useConfigStore } from "./ConfigStore";

interface MapStore {
  zoom: number;
  startShape: { id: string; loc: LatLngExpression }[] | undefined;
  startId: number;
  originDocks: string[];
  isDrawing: boolean;
  setZoom: (zoom: number) => void;
  addToStartShape: (latLng: LatLngExpression) => void;
  removeStartShape: (id: string) => void;
  setStartShape: (shape: { id: string; loc: LatLngExpression }[]) => void;
  clearStartShape: () => void;
  setOriginDocks: (docks: string[]) => void;
  setIsDrawing: (isDrawing: boolean) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  zoom: 12,
  startId: 0,
  startShape: [],
  originDocks: [],
  isDrawing: false,
  addToStartShape: (latLng) => {
    const ss = get().startShape;
    const id = get().startId;
    ss?.push({ id: id.toString(), loc: latLng });
    return set(() => ({
      startId: id + 1,
      startShape: ss,
    }));
  },
  setStartShape: (shape) => {
    return set(() => ({ startShape: shape, startId: shape.length }));
  },
  removeStartShape: (id) => {
    const ss = get().startShape;
    ss?.splice(
      ss?.findIndex((point) => point.id === id),
      1
    );
    return set(() => ({
      startShape: ss,
    }));
  },
  setOriginDocks: (docks) =>
    set(() => ({
      originDocks: docks,
    })),
  clearStartShape: () => set(() => ({ startShape: [], startId: 0 })),
  setZoom: (zoom) => set(() => ({ zoom: zoom })),
  setIsDrawing: (isDrawing) => {
    return set(() => ({ isDrawing: isDrawing }));
  },
}));

export const useSetStartStations = () => {
  const { startShape } = useMapStore((store) => store);
  const setStartStations = useConfigStore((store) => store.setStartStations);
  return async (shape?: { id: string; loc: LatLngExpression }[]) => {
    const docks = await fetchAllData("2023");
    const loadedShapeOrCurrent = shape ?? startShape;
    if (docks && loadedShapeOrCurrent) {
      const originDocks = Object.values(docks)
        ?.filter((dock) =>
          pointInsidePolygon(
            [dock.latitude, dock.longitude],
            loadedShapeOrCurrent
          )
        )
        .map((dock) => dock.id);
      setStartStations(originDocks);
    }
  };
};

export const useSetShapeFromId = () => {
  const setStartShape = useMapStore((store) => store.setStartShape);
  const setStartStations = useSetStartStations();
  return async (id: string) => {
    const shape = await getShape(id);
    const formattedShape = JSON.parse(shape[0].shape);
    const reassignIds = formattedShape.map((point, index) => ({
      ...point,
      id: index,
    }));
    setStartShape(reassignIds);
    setStartStations(reassignIds);
  };
};
