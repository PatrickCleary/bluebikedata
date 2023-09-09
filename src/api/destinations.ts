import { useQuery, useQueries } from "@tanstack/react-query";
import { DATE_RANGES } from "../constants";

import { API_URL } from "../constants/api";
import { useConfigStore } from "../store/ConfigStore";
import {
  FetchDestinationsOptions,
  FetchDestinationsParams,
  FetchDestinationsResponse,
} from "../types/apis";

export const fetchDestinations = async (
  params: FetchDestinationsOptions
): Promise<FetchDestinationsResponse | undefined> => {
  if (!params[FetchDestinationsParams.stationId]) return undefined;
  const url = new URL(`${API_URL}/api/destinations`, window.location.origin);
  Object.keys(params).forEach((paramKey) => {
    url.searchParams.append(paramKey, params[paramKey]);
  });
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch ridership counts");
  return await response.json();
};

export const useDestinationsData = (
  params: FetchDestinationsOptions,
  enabled?: boolean
) => {
  return useQuery(["trips", params], () => fetchDestinations(params));
};

export const useMultipleDestinationsData = (
  stations: string[],
  enabled?: boolean
) => {
  return {
    "2023": useQueries({
      queries: stations.map((station) => {
        return {
          queryKey: [station, DATE_RANGES["2023"]],
          queryFn: () =>
            fetchDestinations({ station_id: station, ...DATE_RANGES["2023"] }),
          stations,
          enabled: enabled,
        };
      }),
    }),
    "2022": useQueries({
      queries: stations.map((station) => {
        return {
          queryKey: [station, DATE_RANGES["2022"]],
          queryFn: () =>
            fetchDestinations({ station_id: station, ...DATE_RANGES["2022"] }),
          enabled: enabled,
        };
      }),
    }),
  };
};
