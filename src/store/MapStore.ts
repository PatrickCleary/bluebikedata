import { useQuery } from "@tanstack/react-query";
import { LatLngExpression } from "leaflet";
import { create } from "zustand";
import { fetchAllData } from "../api/all_data";
import { pointInsidePolygon } from "../helpers/testLocation";
import { useConfigStore } from "./ConfigStore";

interface MapStore {
  zoom: number;
  shapes: { [key: string]: LatLngExpression[] };
  startShape: { id: string; loc: LatLngExpression }[] | undefined;
  startId: number;
  originDocks: string[];
  setZoom: (zoom: number) => void;
  addToStartShape: (latLng: LatLngExpression) => void;
  removeStartShape: (id: string) => void;
  clearStartShape: () => void;
  setOriginDocks: (docks: string[]) => void;
  setShapes: (shapes: { [key: string]: LatLngExpression[] }) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  zoom: 12,
  shapes: {},
  startId: 0,
  startShape: [],
  originDocks: [],
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
  setShapes: (shapes) => set(() => ({ shapes: shapes })),
}));

export const useSetOriginDocks = () => {
  const docks = useQuery(["all_stations_2023"], () => fetchAllData("2023"));
  const { setOriginDocks, startShape } = useMapStore((store) => store);
  const setStartStations = useConfigStore((store) => store.setStartStations);
  return () => {
    if (docks.data && startShape) {
      const originDocks = Object.values(docks.data)
        ?.filter((dock) =>
          pointInsidePolygon([dock.latitude, dock.longitude], startShape)
        )
        .map((dock) => dock.id);
      setOriginDocks(originDocks);
      setStartStations(originDocks);
    }
  };
};
