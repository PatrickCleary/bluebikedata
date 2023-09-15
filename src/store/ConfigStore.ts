import { create } from "zustand";
import { CURRENT_MAX } from "../constants";
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
  direction: "destinations" | "origins";
  startStations: string[] | undefined;
  project?: string;
  incrementMonth: (amount: number) => void;
  setRidership: (ridershipMin: string | number) => void;
  switchDirections: () => void;
  setProject: (shape?: string) => void;
  setDate: (date: DateOptions) => void;
  setStartStations: (startStations: string[] | undefined) => void;
  setOrClearStartStation: (startStation: string) => void;
  setFromConfig: (params: { [key: string]: string }) => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  distance: "all",
  ridershipMin: 0,
  direction: "destinations",
  project: undefined,
  date: CURRENT_MAX,
  startStations: undefined,
  setProject: (project) => set(() => ({ project: project })),
  setRidership: (ridershipMin) => {
    const _ridershipMin =
      typeof ridershipMin === "number" ? ridershipMin : parseInt(ridershipMin);
    return set(() => ({
      ridershipMin: _ridershipMin,
    }));
  },
  switchDirections: () => {
    if (get().direction === "origins")
      return set(() => ({ direction: "destinations" }));
    return set(() => ({ direction: "origins" }));
  },
  setDate: (date) => set(() => ({ date: date })),
  incrementMonth: (amount) => {
    const date = get().date;
    const newMonth = (((date.month + amount) % 12) + 12) % 12;
    const newYear = date.year + Math.floor((date.month + amount) / 12);
    return set(() => ({
      date: { month: newMonth, year: newYear },
    }));
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

export const isMaxDate = (date) => {
  return date.month === CURRENT_MAX.month && date.year === CURRENT_MAX.year;
};
