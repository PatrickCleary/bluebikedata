import React from "react";
import { DATE_MAP, DISTANCE_MIN_MAP, METRIC_MAP } from "../constants";
import { useConfigStore } from "../store/ConfigStore";
import { Tabs } from "./Tabs";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const configStore = useConfigStore((store) => store);
  return (
    <div className="w-full xl:col-span-4 bg-gray-700 rounded-t-md px-4 py-4 text-gray-100 ">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl ">Blue Bike Data June 2022 vs. June 2023</h1>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-baseline">
            <label>Distance:</label>
            <Tabs
              setValue={configStore.setDistance}
              options={DISTANCE_MIN_MAP}
            />
            <label>2023 Ridership:</label>
            <input
              className="bg-gray-800 text-gray-200 px-1 py-1"
              type="number"
              pattern="[0-9]+([\,|\.][0-9]+)?"
              step="10"
              value={configStore.ridershipMin}
              onChange={(event) =>
                configStore.setRidership(event.currentTarget.value)
              }
            />
            <Tabs
              setValue={configStore.setRidership}
              options={{ 0: "Any", 100: "> 100", 500: "> 500" }}
            />
            <label>Metric:</label>
            <Tabs setValue={configStore.setMetric} options={METRIC_MAP} />
          </div>
        </div>
      </div>
    </div>
  );
};
