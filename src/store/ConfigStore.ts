import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { create } from "zustand";
import { DateOptions, MetricsType, TripDistancesType } from "../types/Data";

export type paramsType = keyof typeof Params;

export enum Params {
  metric = "metric",
  ridershipMin = "ridershipMin",
  distance = "distance",
}
export type paramsMap = {
  [key in paramsType]?: string;
};
interface ConfigStore {
  distance: TripDistancesType;
  ridershipMin: number;
  metric: MetricsType;
  date: DateOptions;

  setDistance: (distance: TripDistancesType) => void;
  setRidership: (ridershipMin: string | number) => void;
  setMetric: (metric: MetricsType) => void;
  setDate: (date: DateOptions) => void;
  loadFromParams: (params: { [key: string]: string }) => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  distance: "nonzero",
  ridershipMin: 100,
  metric: "total",
  date: "comp",
  setDistance: (distance) => set(() => ({ distance: distance })),
  setRidership: (ridershipMin) => {
    const _ridershipMin =
      typeof ridershipMin === "number" ? ridershipMin : parseInt(ridershipMin);
    return set(() => ({
      ridershipMin: _ridershipMin,
    }));
  },
  setMetric: (metric) => set(() => ({ metric: metric })),
  setDate: (date) => set(() => ({ date: date })),
  loadFromParams: (searchParams) => {
    const configStoreObject = {};
    if (
      searchParams["distance"] &&
      ["all", "nonzero", "oneplus"].includes(searchParams["distance"])
    )
      configStoreObject["distance"] = searchParams["distance"];

    if (
      searchParams["metric"] &&
      ["total", "median_trip_duration", "median_distance_miles"].includes(
        searchParams["metric"]
      )
    )
      configStoreObject["metric"] = searchParams["metric"];

    if (
      searchParams["ridershipMin"] &&
      !isNaN(parseInt(searchParams["ridershipMin"]))
    )
      configStoreObject["ridershipMin"] = parseInt(
        searchParams["ridershipMin"]
      );

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

export const useUpdateMetric = () => {
  const setMetric = useConfigStore((store) => store.setMetric);
  const [searchParams, setSearchParams] = useSearchParams();
  return (metric: MetricsType) => {
    setMetric(metric);
    searchParams.set("metric", metric);
    setSearchParams(searchParams);
  };
};
