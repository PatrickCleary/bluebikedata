export type TripDistancesType = keyof typeof TripDistances;

export enum TripDistances {
  all = "all",
  nonzero = "nonzero",
  oneplus = "oneplus",
}

export interface StationTripMap {
  [key: string]: StationTrip;
}

export interface StationTrip {
  name: string;
  id: string;
  Latitude: number;
  Longitude: number;
  "Deployment Year"?: string;
  District?: string;
  Public?: boolean;
  Total?: number;
  LastUsed?: string;
}
export interface AggregatedTripData {
  total: number;
  median_trip_duration: number;
  mean_trip_duration: number;
  median_mph: number;
  mean_mph: number;
  median_distance_miles: number;
  mean_distance_miles: number;
}

export type DateOptions = {
  month: number;
  year: number;
};

export interface Destinations {
  [startStation: string]: { [endStation: string]: number }[];
}
