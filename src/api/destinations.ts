import { useQuery, useQueries } from "@tanstack/react-query";

import { API_URL } from "../constants/api";
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
  return useQueries({
    queries: stations.map((station) => {
      return {
        queryKey: [station],
        queryFn: () => fetchDestinations({ station_id: station }),
        enabled,
      };
    }),
  });
};
