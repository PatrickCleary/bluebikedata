import { useQuery } from "@tanstack/react-query";
import { useSelectionStore } from "../store/ShapeStore";
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
): Promise<Destinations[]> => {
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

  return Promise.all([
    fetch(destinationUrl.toString()).then((resp) => resp.json()),
    fetch(originUrl.toString()).then((resp) => resp.json()),
  ]);
};

export const useMonthlyData = (
  stations: string[] | undefined,
  year: number,
  month: number
): { docks: string[]; totals: { [key: string]: number } } | undefined => {
  const { selectedDocks, shape } = useSelectionStore((store) => store);
  let type = 0;
  const doubleSelection = ["destination", "origin"].every(
    (direction) =>
      selectedDocks[direction].length > 0 || shape[direction].length > 0
  );
  if (
    selectedDocks.origin.length > 0 &&
    selectedDocks.origin.length > selectedDocks.destination.length
  ) {
    type = 1;
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
  let sum = 0;
  stations?.forEach((station) => {
    if (!dockData[station]) return undefined;
    dockData[station].forEach((value) => {
      const [_station, count] = Object.entries(value).flat();
      if (doubleSelection) {
        if (selectedDocks.origin.includes(_station.toString())) sum += count;
      } else {
        sum += count;
        if (!totals[_station]) totals[_station] = count;
        else totals[_station] += count;
      }
    });
  });
  console.log(sum);
  return { docks: currentDocks, totals: totals };
};
