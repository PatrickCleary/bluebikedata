import { useQuery } from "@tanstack/react-query";
import { useSelectionStore } from "../store/ShapeStore";
import { useStatisticStore } from "../store/StatisticStore";
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
  selectedDocks: {
    origin: string[];
    destination: string[];
  },
  year: number,
  month: number
): { docks: string[]; totals: { [key: string]: number } } | undefined => {
  const { shape } = useSelectionStore((store) => store);
  const setStatistic = useStatisticStore((store) => store.setStatistic);
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
  const docksToUse =
    selectedDocks.origin.length > 0
      ? selectedDocks.origin
      : selectedDocks.destination;
  let total = 0;
  let outwardTotal = 0;
  let toDestination = 0;
  docksToUse?.forEach((dock) => {
    if (!dockData[dock]) return undefined;
    dockData[dock].forEach((value) => {
      const [_station, count] = Object.entries(value).flat();
      total += count;
      if (!docksToUse.includes(_station)) outwardTotal += count;

      if (doubleSelection) {
        if (selectedDocks.destination.includes(_station.toString()))
          toDestination += count;
      } else {
        if (!totals[_station]) totals[_station] = count;
        else totals[_station] += count;
      }
    });
  });
  setStatistic("total", total);
  setStatistic("out", outwardTotal);
  setStatistic("dest", toDestination);
  return { docks: currentDocks, totals: totals };
};
