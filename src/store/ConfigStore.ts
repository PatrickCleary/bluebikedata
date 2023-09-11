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
  project?: string;

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
  date: "2023",
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

// TODO: The following 3 functions were made to be used with search params. I stopped using URL params so these can be simplified.
export const useUpdateRidershipMin = () => {
  const setRidership = useConfigStore((store) => store.setRidership);
  return (ridershipMin: string | number) => {
    const _ridershipMin =
      typeof ridershipMin === "number" ? ridershipMin : parseInt(ridershipMin);
    setRidership(_ridershipMin);
  };
};

export const useUpdateProject = () => {
  const setProject = useConfigStore((store) => store.setProject);
  return (project?: string) => {
    setProject(project);
  };
};

export const useClearStartStations = () => {
  const setStartStations = useConfigStore((store) => store.setStartStations);
  const clearStartShape = useMapStore((store) => store.clearStartShape);
  return () => {
    setStartStations(undefined);
    clearStartShape();
  };
};
