import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  useSelectStore,
  useSelectionType,
  DockSelection,
} from "../store/SelectStore";
import { useStatisticStore } from "../store/StatisticStore";
import {
  DateOptions,
  Destinations,
  StationTrip,
  StationTripMap,
} from "../types/Data";

export const fetchAllData = (year: string): Promise<StationTripMap> => {
  const url = new URL(`/static/${year}_data.json`, window.location.origin);
  return fetch(url.toString()).then((resp) => resp.json());
};

export const fetchAllDocks = async (
  date: DateOptions
): Promise<StationTripMap> => {
  const url = new URL(`/static/all_docks.json`, window.location.origin);
  const docks = await fetch(url.toString()).then((resp) => resp.json());
  const currentDocks: StationTripMap = {};
  Object.values(docks)
    .filter((dock: StationTrip) => {
      if (!dock.LastUsed) return true;
      const day = dayjs(dock.LastUsed);
      const month = day.get("month");
      const year = day.get("year");
      return year <= date.year || (month <= date.month && year === date.year);
    })
    .forEach((dock: StationTrip) => {
      currentDocks[`${dock.id}:${dock.name}`] = { ...dock };
    });
  return currentDocks;
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
  selectedDocks: DockSelection,
  year: number,
  month: number
): { docks: string[]; totals: { [key: string]: number } } | undefined => {
  const { shape } = useSelectStore((store) => store);
  const isDoubleSelection = useSelectionType() === "both";
  const setStatistic = useStatisticStore((store) => store.setStatistic);
  const originOrDestination = ["origin", "destination"];
  let type = 0; // 0 === origin
  if (
    // If no origin docks selected, use destination data.
    (shape.destination.length > 0 || selectedDocks.destination.size > 0) &&
    shape.origin.length === 0 &&
    selectedDocks.origin.size === 0
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
  docksToUse?.forEach((dock: string) => {
    if (!dockData[dock]) {
      return undefined;
    }
    dockData[dock].forEach((value) => {
      let [_dock, count] = Object.entries(value).flat();
      if (typeof count === "string") count = parseInt(count);
      total += count;

      if (!docksToUse.has(_dock)) outwardTotal += count;
      if (isDoubleSelection) {
        if (
          selectedDocks[originOrDestination[(type + 1) % 2]].has(
            _dock.toString()
          )
        )
          toDestination += count;
      } else {
        if (!totals[_dock]) totals[_dock] = count;
        else totals[_dock] += count;
      }
    });
  });
  setStatistic("total", total);
  setStatistic("out", outwardTotal);
  setStatistic("dest", toDestination);
  return { docks: currentDocks, totals: totals };
};
