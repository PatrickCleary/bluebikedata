import { create } from "zustand";
import { CURRENT_MAX } from "../constants";
import { PROJECT_OUTLINES } from "../constants/shapes";
import { DateOptions } from "../types/Data";
import { useMapStore } from "./MapStore";
import { useSelectionStore } from "./SelectionStore";

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
  project?: string;
  incrementMonth: (amount: number) => void;
  setRidership: (ridershipMin: string | number) => void;
  setProject: (shape?: string) => void;
  setDate: (date: DateOptions) => void;
  setFromConfig: (params: { [key: string]: string }) => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  distance: "all",
  ridershipMin: 0,
  project: undefined,
  date: CURRENT_MAX,
  setProject: (project) => set(() => ({ project: project })),
  setRidership: (ridershipMin) => {
    const _ridershipMin =
      typeof ridershipMin === "number" ? ridershipMin : parseInt(ridershipMin);
    return set(() => ({
      ridershipMin: _ridershipMin,
    }));
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
  setFromConfig: (config) => {
    const configStoreObject = {};
    if (config["project"] && PROJECT_OUTLINES[config["project"]] !== undefined)
      configStoreObject["project"] = config["project"];
    if (config["date"]) configStoreObject["date"] = config["date"];

    if (config["ridershipMin"] && !isNaN(parseInt(config["ridershipMin"]))) {
      configStoreObject["ridershipMin"] = parseInt(config["ridershipMin"]);
    }
    return set(() => configStoreObject);
  },
}));

export const isMaxDate = (date) => {
  return date.month === CURRENT_MAX.month && date.year === CURRENT_MAX.year;
};
