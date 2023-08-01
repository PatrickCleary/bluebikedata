export type FetchDestinationsOptions = {
  [key in FetchDestinationsParams]?: string;
};

export enum FetchDestinationsParams {
  stationId = "station_id",
}

export type FetchDestinationsResponse = {
  name: string;
  end_docks: { [key: string]: number }[];
};
