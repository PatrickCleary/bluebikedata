import { LatLngExpression } from "leaflet";

export type FetchDestinationsOptions = {
  [key in FetchDestinationsParams]?: string;
};

export enum FetchDestinationsParams {
  stationId = "station_id",
}

export type FetchDestinationsResponse = {
  name: string;
  end_docks: { [key: string]: number }[];
  start_time: string;
  end_time: string;
};


export type SaveShapeParams = {
  shape: { id: string; loc: LatLngExpression }[]
} 