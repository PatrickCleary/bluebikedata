import { useQuery } from "@tanstack/react-query";
import { useSelectionStore, useSelectionType } from "../store/SelectionStore";
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
    fetch(originUrl.toString()).then((resp) => resp.json()),
    fetch(destinationUrl.toString()).then((resp) => resp.json()),
  ]);
};

// This is absolute spaghetti and should be burned with fire.
export const useMonthlyData = (
  selectedDocks: {
    origin: string[];
    destination: string[];
  },
  year: number,
  month: number
): { docks: string[]; totals: { [key: string]: number } } | undefined => {
  const { shape } = useSelectionStore((store) => store);
  const isDoubleSelection = useSelectionType() === "both";
  const setStatistic = useStatisticStore((store) => store.setStatistic);
  const originOrDestination = ["origin", "destination"];
  let type = 0; // 0 === origin
  if (
    // If no origin docks selected, use destination data.
    shape.destination.length > 0 &&
    shape.origin.length === 0
  ) {
    type = 1;
  }
  const data = useQuery([year, month], () =>
    fetchMonthlyDestinations(year, month)
  );
  const preFetchNextMonth = useQuery(
    [year, month + 1],
    () => fetchMonthlyDestinations(year, month + 1),
    { enabled: month < 11 }
  );

  const preFetchNextYear = useQuery(
    [year + 1, 0],
    () => fetchMonthlyDestinations(year + 1, 0),

    { enabled: month === 11 }
  );
  if (!data.data) return undefined;
  const dockData = data.data[type];
  const currentDocks = Object.keys(dockData);
  const totals = {};
  const docksToUse = selectedDocks[originOrDestination[type]];
  let total = 0;
  let outwardTotal = 0;
  let toDestination = 0;
  docksToUse?.forEach((dock) => {
    if (!dockData[dock]) return undefined;
    dockData[dock].forEach((value) => {
      let [_station, count] = Object.entries(value).flat();
      if (typeof count === "string") count = parseInt(count);
      total += count;
      if (!docksToUse.includes(_station)) outwardTotal += count;

      if (isDoubleSelection) {
        if (
          selectedDocks[originOrDestination[(type + 1) % 2]].includes(
            _station.toString()
          )
        )
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
