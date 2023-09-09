import { DateOptions } from "./types/Data";

export const DATE_MAP: { [key in DateOptions]: string } = {
  "2022": "June 2022",
  "2023": "June 2023",
};

export const TRIPS_MAX = 1000;
export const MPH_MAX = 10;
export const DISTANCE_MAX = 1.5;
export const DURATION_MAX = 30;

export const DATE_TITLE_MAP: { [key in DateOptions]: string } = {
  "2022": "June 2022",
  "2023": "June 2023",
};

export const DATE_RANGES = {
  "2022": { start_time: "2022-06-01", end_time: "2022-06-31" },
  "2023": { start_time: "2023-06-01", end_time: "2023-06-31" },
};

export const MAX_STATIONS = 15;
