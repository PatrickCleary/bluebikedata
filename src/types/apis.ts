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

export type ConfigParams = {
  center: LatLngExpression;
  zoom: number;
  shape?: Shape;
  project?: string;
  ridershipMin?: number;
  date?: { year: number; month: number };
  originDock?: string; // Only used when no shape is drawn and there is a station selected.
  destinationDock?: string; // Only used when no shape is drawn and there is a station selected.
};

export type SaveConfigParams = {
  id: string;
  version: string;
  configParams: ConfigParams;
};

export type Shape = {
  origin: ShapeVertex[] | undefined;
  destination: ShapeVertex[] | undefined;
};

export type ShapeVertex = {
  id: string;
  loc: LatLngExpression;
};
