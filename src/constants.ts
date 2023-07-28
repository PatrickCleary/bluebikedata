import { DateOptions, MetricsType, TripDistancesType } from "./types/Data";

export const zoomLevelToMarkerSize = (zoomLevel: number) => {
  if (zoomLevel < 12) return ["h-1 w-1", "h-2 w-2", "h-4 w-4"];
  if (zoomLevel < 13) return ["h-3 w-3", "h-4 w-4", "h-6 w-6"];
  if (zoomLevel < 15) return ["h-5 w-5", "h-6 w-6", "h-8 w-8"];
  if (zoomLevel < 16) return ["h-6 w-6", "h-7 w-7", "h-9 w-9"];
  if (zoomLevel < 17) return ["h-7 w-7", "h-8 w-8", "h-10 w-10"];
  if (zoomLevel < 23) return ["h-10 w-10", "h-11 w-11", "h-13 w-13"];
  return ["h-10 w-10", "h-11 w-11", "h-13 w-13"];
};

export const DATE_MAP: { [key in DateOptions]: string } = {
  comp: "Comparison",
  "2022": "June 2022",
  "2023": "June 2023",
};

export const DISTANCE_MIN_MAP: { [key in TripDistancesType]: string } = {
  all: "all",
  nonzero: "> 0 mi",
  oneplus: "> 1 mi",
};

export const METRIC_MAP: { [key in MetricsType]: string } = {
  total: "Trips",
  median_trip_duration: "Duration",
  median_distance_miles: "Distance",
  median_mph: "Speed",
};

export const TRIPS_MAX = 1000;
export const MPH_MAX = 10;
export const DISTANCE_MAX = 1.5;
export const DURATION_MAX = 30;

export const METRIC_TO_MAX_MAP: { [key in MetricsType]: number } = {
  total: TRIPS_MAX,
  median_trip_duration: DURATION_MAX,
  median_distance_miles: DISTANCE_MAX,
  median_mph: MPH_MAX,
};

export const DISTANCE_TITLE_MAP: { [key in TripDistancesType]: string } = {
  all: "All trips",
  nonzero: "Excludes trips returning to starting dock",
  oneplus: "Trips ending at docks >1 mile away",
};

export const METRIC_TITLE_MAP: { [key in MetricsType]: string } = {
  total: "Total trips",
  median_trip_duration: "Trip duration",
  median_distance_miles: "Trip distance",
  median_mph: "Trip speed",
};

export const DATE_TITLE_MAP: { [key in DateOptions]: string } = {
  comp: "June '22 vs. June '23",
  "2022": "June 2022",
  "2023": "June 2023",
};
