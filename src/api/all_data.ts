import { useConfigStore } from "../store/ConfigStore";
import { StationTripMap } from "../types/Data";

export const fetchAllData = (year: string): Promise<StationTripMap> => {
  const url = new URL(`/static/${year}_data.json`, window.location.origin);
  return fetch(url.toString()).then((resp) => resp.json());
};

export const useFetchAllDataQueries = (year: string) => {
  const { ridershipMin, distance } = useConfigStore((store) => store);

  return fetchAllData(year);
};
