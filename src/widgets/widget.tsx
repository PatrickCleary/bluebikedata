import React from "react";
import classNames from "classnames";
import { useQuery } from "@tanstack/react-query";
import { round } from "lodash";
import { fetchAllData } from "../api/all_data";
import { useConfigStore, useUpdateMetric } from "../store/ConfigStore";
import { DATE_MAP, DATE_TITLE_MAP, DISTANCE_TITLE_MAP } from "../constants";
import { Tabs } from "../components/Tabs";
import { getDivergingColor } from "../helpers/colors";
import { useMultipleDestinationsData } from "../api/destinations";

export const Widget: React.FC = () => {
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));

  const configStore = useConfigStore((store) => store);
  const stationId = configStore.station;

  if (!data_22.data || !data_23.data) {
    if (data_22.isLoading || data_23.isLoading) return <p>Loading...</p>;
    return <p>Error</p>;
  }
  if (!stationId)
    return (
      <div className="w-full flex h-32 bg-gray-800 px-4 py-4 mt-4 rounded-md md:rounded-none md:rounded-bl-md items-center justify-center">
        <p className="text-gray-100 text-2xl">Select a dock to learn more.</p>
      </div>
    );

  const station_22 = data_22.data[stationId];
  const station_23 = data_23.data[stationId];

  return (
    <div className="w-full rounded-md md:rounded-none md:rounded-bl-md bg-gray-800 shadow-sm px-4 py-4 mt-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <div className="text-gray-300 truncate w-full flex flex-col">
          <h1 className="text-base w-10 md:w-full md:truncate md:text-lg block">
            Trips from {station_23.name}
          </h1>
          <h3 className="text-sm italic truncate block">
            {DISTANCE_TITLE_MAP[configStore.distance]}
          </h3>
        </div>
        <div className="flex flex-row gap-2 items-baseline">
          <Tabs
            defaultIndex={2}
            setValue={configStore.setDate}
            options={DATE_MAP}
          />
        </div>
      </div>
      <div className="flex xl:flex-row flex-col items-center justify-between py-4 gap-4">
        <WidgetValue
          station_22={station_22}
          station_23={station_23}
          value_name={"total"}
          configStore={configStore}
          title={"Trips"}
          unit="trips"
        />
        <WidgetValue
          station_22={station_22}
          station_23={station_23}
          value_name={"median_trip_duration"}
          configStore={configStore}
          title="Median duration"
          unit="seconds"
        />
        <WidgetValue
          station_22={station_22}
          station_23={station_23}
          value_name={"median_distance_miles"}
          configStore={configStore}
          title={"Median distance"}
          unit="mi"
        />
      </div>
    </div>
  );
};

const WidgetValue: React.FC<any> = ({
  station_22,
  station_23,
  value_name,
  configStore,
  title,
  unit,
}) => {
  const selected = configStore.metric === value_name;
  const before_value = station_22?.values[configStore.distance][value_name];
  const after_value = station_23?.values[configStore.distance][value_name];
  const diff = after_value - before_value;
  const percentDiff = before_value !== 0 ? diff / before_value : undefined;
  let value;
  switch (configStore.date) {
    case "comp":
      value = diff;
      break;
    case "2022":
      value = before_value;
      break;
    case "2023":
      value = after_value;
      break;
  }
  const updateMetric = useUpdateMetric();
  return (
    <div
      className={classNames(
        selected ? "bg-gray-600 border-gray-300" : "border-gray-500",
        "flex flex-col gap-2 border rounded-sm p-4 w-full cursor-pointer"
      )}
      onClick={() => updateMetric(value_name)}
    >
      <div className="flex flex-row lg:flex-col 3xl:flex-row justify-between items-baseline">
        <h2 className="text-gray-300">{title ?? value_name}</h2>
        <h2 className="text-sm italic text-gray-300">
          {DATE_TITLE_MAP[configStore.date]}
        </h2>
      </div>
      <div className="flex flex-row items-center justify-between">
        <p className="text-2xl ƒont-semibold text-gray-100">
          {!isNaN(value) ? (
            <>
              {configStore.date === "comp" ? (diff > 0 ? "+" : "") : null}
              {round(value, 2)}
              <span className="text-sm text-gray-300 pl-1">{unit}</span>

              {percentDiff && configStore.date === "comp" ? (
                <span
                  className="pl-4 text-lg"
                  style={{ color: getDivergingColor(percentDiff, true) }}
                >
                  {percentDiff > 0 ? "+" : ""}
                  {round(100 * percentDiff, 0)}%
                </span>
              ) : null}
            </>
          ) : (
            <>No data</>
          )}
        </p>
      </div>
    </div>
  );
};
