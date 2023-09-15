import { useQuery } from "@tanstack/react-query";
import { Destinations, StationTripMap } from "../types/Data";

export const fetchAllData = (year: string): Promise<StationTripMap> => {
  const url = new URL(`/static/${year}_data.json`, window.location.origin);
  return fetch(url.toString()).then((resp) => resp.json());
};

export const fetchAllDocks = (): Promise<StationTripMap> => {
  const url = new URL(`/static/all_docks.json`, window.location.origin);
  return fetch(url.toString()).then((resp) => resp.json());
};

export const fetchMonthlyDestinations = (
  year: number,
  month: number,
  type: "origins" | "destinations"
): Promise<Destinations> => {
  const url = new URL(
    `/static/${type}_data/output_${year.toString()}${(month + 1)
      .toString()
      .padStart(2, "0")}.json`,
    window.location.origin
  );
  return fetch(url.toString()).then((resp) => resp.json());
};

export const useMonthlyData = (
  stations: string[] | undefined,
  year: number,
  month: number,
  type: "origins" | "destinations"
): { docks: string[]; totals: { [key: string]: number } } | undefined => {
  const destinationsData = useQuery([type, year, month], () =>
    fetchMonthlyDestinations(year, month, type)
  );

  const preFetchNextMonth = useQuery(
    [type, year, month + 1],
    () => fetchMonthlyDestinations(year, month + 1, type),
    { enabled: month < 11 }
  );

  const preFetchNextYear = useQuery(
    [type, year + 1, 0],
    () => fetchMonthlyDestinations(year + 1, 0, type),

    { enabled: month === 11 }
  );
  const currentDocks = destinationsData.data
    ? Object.keys(destinationsData.data)
    : [];

  if (!destinationsData.data) return undefined;
  const totals = {};
  stations?.forEach((station) => {
    if (!destinationsData.data[station]) return undefined;
    destinationsData.data[station].forEach((value) => {
      const [station, count] = Object.entries(value).flat();
      if (!totals[station]) totals[station] = count;
      else totals[station] += count;
    });
  });
  return { docks: currentDocks, totals: totals };
};
