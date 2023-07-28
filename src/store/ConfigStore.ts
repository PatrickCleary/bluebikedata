import { create } from "zustand";
import { DateOptions, MetricsType, TripDistancesType } from "../types/Data";

interface ConfigStore {
  distance: TripDistancesType;
  ridershipMin: number;
  metric: MetricsType;
  date: DateOptions;

  setDistance: (distance: TripDistancesType) => void;
  setRidership: (ridershipMin: string | number) => void;
  setMetric: (metric: MetricsType) => void;
  setDate: (date: DateOptions) => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  distance: "nonzero",
  ridershipMin: 0,
  metric: "total",
  date: "comp",
  setDistance: (distance) => set(() => ({ distance: distance })),
  setRidership: (ridershipMin) =>
    set(() => ({
      ridershipMin:
        typeof ridershipMin === "number"
          ? ridershipMin
          : parseInt(ridershipMin),
    })),
  setMetric: (metric) => set(() => ({ metric: metric })),
  setDate: (date) => set(() => ({ date: date })),
}));
