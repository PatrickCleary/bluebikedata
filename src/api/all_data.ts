import { useQuery } from "@tanstack/react-query";
import { useSelectionStore } from "../store/SelectionStore";
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
  month: number
): { destination: Promise<Destinations>; origin: Promise<Destinations> } => {
  const destinationUrl = new URL(
    `/static/destination_data/output_${year.toString()}${(month + 1)
      .toString()
      .padStart(2, "0")}.json`,
    window.location.origin
  );
  const originUrl = new URL(
    `/static/origin_data/output_${year.toString()}${(month + 1)
      .toString()
      .padStart(2, "0")}.json`,
    window.location.origin
  );
  return {
    destination: fetch(destinationUrl.toString()).then((resp) => resp.json()),
    origin: fetch(originUrl.toString()).then((resp) => resp.json()),
  };
};

export const useMonthlyData = (
  stations: string[] | undefined,
  year: number,
  month: number
): { docks: string[]; totals: { [key: string]: number } } | undefined => {
  const { selectedDocks } = useSelectionStore((store) => store);
  let type = "destination";
  if (
    selectedDocks.origin.length > 0 &&
    selectedDocks.origin.length > selectedDocks.destination.length
  ) {
    type = "origin";
  }
  const data = useQuery([type, year, month], () =>
    fetchMonthlyDestinations(year, month)
  );
  const preFetchNextMonth = useQuery(
    [type, year, month + 1],
    () => fetchMonthlyDestinations(year, month + 1),
    { enabled: month < 11 }
  );

  const preFetchNextYear = useQuery(
    [type, year + 1, 0],
    () => fetchMonthlyDestinations(year + 1, 0),

    { enabled: month === 11 }
  );
  if (!data.data) return undefined;
  const dockData = data.data[type];
  const currentDocks = Object.keys(dockData);
  const totals = {};
  console.log(currentDocks);
  stations?.forEach((station) => {
    console.log(dockData);
    if (!dockData[station]) return undefined;
    dockData[station].forEach((value) => {
      const [_station, count] = Object.entries(value).flat();
      if (!totals[station]) totals[station] = count;
      else totals[station] += count;
    });
  });
  return { docks: currentDocks, totals: totals };
};
