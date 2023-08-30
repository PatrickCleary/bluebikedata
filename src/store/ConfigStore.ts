import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { create } from "zustand";
import { PROJECT_OUTLINES } from "../constants/shapes";
import { DateOptions } from "../types/Data";
import { useMapStore } from "./MapStore";

export type paramsType = keyof typeof Params;

export enum Params {
  ridershipMin = "ridershipMin",
}
export type paramsMap = {
  [key in paramsType]?: string;
};
interface ConfigStore {
  ridershipMin: number;
  date: DateOptions;
  startStations: string[] | undefined;
  shape?: string;

  setRidership: (ridershipMin: string | number) => void;
  setShape: (shape?: string) => void;
  setDate: (date: DateOptions) => void;
  setStartStations: (startStations: string[] | undefined) => void;
  setOrClearStartStation: (startStation: string) => void;
  loadFromParams: (params: { [key: string]: string }) => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  distance: "all",
  ridershipMin: 0,
  metric: "total",
  shape: undefined,
  date: "2023",
  startStations: undefined,
  setShape: (shape) => set(() => ({ shape: shape })),
  setRidership: (ridershipMin) => {
    const _ridershipMin =
      typeof ridershipMin === "number" ? ridershipMin : parseInt(ridershipMin);
    return set(() => ({
      ridershipMin: _ridershipMin,
    }));
  },
  setDate: (date) => set(() => ({ date: date })),
  setOrClearStartStation: (startStation) => {
    const startStations = get().startStations;
    if (startStations?.includes(startStation))
      return set(() => ({ startStations: undefined }));
    return set(() => ({ startStations: [startStation] }));
  },
  setStartStations: (startStations) =>
    set(() => ({ startStations: startStations })),
  loadFromParams: (searchParams) => {
    const configStoreObject = {};
    if (
      searchParams["shape"] &&
      PROJECT_OUTLINES[searchParams["shape"]] !== undefined
    )
      configStoreObject["shape"] = searchParams["shape"];
    if (searchParams["station"])
      configStoreObject["station"] = searchParams["station"];

    if (
      searchParams["ridershipMin"] &&
      !isNaN(parseInt(searchParams["ridershipMin"]))
    ) {
      configStoreObject["ridershipMin"] = parseInt(
        searchParams["ridershipMin"]
      );
    }
    return set(() => configStoreObject);
  },
}));

export const useUpdateRidershipMin = () => {
  const setRidership = useConfigStore((store) => store.setRidership);
  const [searchParams, setSearchParams] = useSearchParams();
  return (ridershipMin: string | number) => {
    const _ridershipMin =
      typeof ridershipMin === "number" ? ridershipMin : parseInt(ridershipMin);
    setRidership(_ridershipMin);
    searchParams.set("ridershipMin", _ridershipMin.toString());
    setSearchParams(searchParams);
  };
};

export const useUpdateShape = () => {
  const setShape = useConfigStore((store) => store.setShape);
  const [searchParams, setSearchParams] = useSearchParams();
  return (shape?: string) => {
    setShape(shape);
    if (!shape) searchParams.delete("shape");
    else searchParams.set("shape", shape);
    setSearchParams(searchParams);
  };
};

export const useAddOrRemoveStartStation = () => {
  const setStartStations = useConfigStore((store) => store.setStartStations);
  const [searchParams, setSearchParams] = useSearchParams();
  return (startStation: string) => {
    const searchParamsArray =
      searchParams.get("startStations")?.split(",") ?? [];
    if (searchParamsArray.includes(startStation)) {
      searchParamsArray.splice(searchParamsArray.indexOf(startStation), 1);
      searchParamsArray.length > 0
        ? searchParams.set("startStations", searchParamsArray.join(","))
        : searchParams.delete("startStations");
    } else {
      searchParamsArray.push(startStation);
      searchParams.set("startStations", searchParamsArray.join(","));
    }
    setStartStations(searchParamsArray);
    setSearchParams(searchParams);
  };
};

export const useClearStartStations = () => {
  const setStartStations = useConfigStore((store) => store.setStartStations);
  const [searchParams, setSearchParams] = useSearchParams();
  const clearStartShape = useMapStore((store) => store.clearStartShape);
  return () => {
    searchParams.delete("startStations");
    setSearchParams(searchParams);
    setStartStations(undefined);
    clearStartShape();
  };
};
