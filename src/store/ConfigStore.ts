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
  project?: string;
  incrementMonth: () => void;
  setRidership: (ridershipMin: string | number) => void;
  setProject: (shape?: string) => void;
  setDate: (date: DateOptions) => void;
  setStartStations: (startStations: string[] | undefined) => void;
  setOrClearStartStation: (startStation: string) => void;
  setFromConfig: (params: { [key: string]: string }) => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  distance: "all",
  ridershipMin: 0,
  metric: "total",
  project: undefined,
  date: { year: 2015, month: 0 },
  startStations: undefined,
  setProject: (project) => set(() => ({ project: project })),
  setRidership: (ridershipMin) => {
    const _ridershipMin =
      typeof ridershipMin === "number" ? ridershipMin : parseInt(ridershipMin);
    return set(() => ({
      ridershipMin: _ridershipMin,
    }));
  },
  setDate: (date) => set(() => ({ date: date })),
  incrementMonth: () => {
    const date = get().date;
    if (date.month < 11)
      return set(() => ({ date: { month: date.month + 1, year: date.year } }));
    if (date.month === 11)
      return set(() => ({ date: { month: 0, year: date.year + 1 } }));
  },
  setOrClearStartStation: (startStation) => {
    const startStations = get().startStations;
    if (startStations?.includes(startStation))
      return set(() => ({ startStations: undefined }));
    return set(() => ({ startStations: [startStation] }));
  },
  setStartStations: (startStations) =>
    set(() => ({ startStations: startStations })),
  setFromConfig: (config) => {
    const configStoreObject = {};
    if (config["project"] && PROJECT_OUTLINES[config["project"]] !== undefined)
      configStoreObject["project"] = config["project"];
    if (config["station"])
      configStoreObject["startStations"] = [config["station"]];
    if (config["date"]) configStoreObject["date"] = config["date"];

    if (config["ridershipMin"] && !isNaN(parseInt(config["ridershipMin"]))) {
      configStoreObject["ridershipMin"] = parseInt(config["ridershipMin"]);
    }
    return set(() => configStoreObject);
  },
}));

export const useClearStartStations = () => {
  const setStartStations = useConfigStore((store) => store.setStartStations);
  const clearStartShape = useMapStore((store) => store.clearStartShape);
  return () => {
    setStartStations(undefined);
    clearStartShape();
  };
};
