import classNames from "classnames";
import React, { SetStateAction } from "react";
import { useQuery } from "react-query";
import { fetchAllData } from "../api/all_data";
import { DATE_MAP } from "../constants";
import { useConfigStore } from "../store/ConfigStore";
import { StationTrip } from "../types/Data";

interface StationsByRidershipProps {
  selectedStation: string | undefined;
  setSelectedStation: React.Dispatch<SetStateAction<string>>;
}

export const StationsByRidership: React.FC<StationsByRidershipProps> = ({
  selectedStation,
  setSelectedStation,
}) => {
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const configStore = useConfigStore((store) => store);
  let data;
  switch (configStore.date) {
    case "2022":
      data = data_22.data;
      break;
    case "2023":
      data = data_23.data;
      break;
    default:
      data = data_23.data;
  }
  if (!data) return <p>loading</p>;
  const sortedData = Object.values(data).sort(
    (valueA: StationTrip, valueB: StationTrip) =>
      valueB.values[configStore.distance]?.total -
      valueA.values[configStore.distance]?.total
  );
  return (
    <div className="text-gray-100 col-span-1">
      <div className="w-full sticky flex flex-row justify-between py-2 bg-gray-800 px-2 rounded-t-md">
        <p>Station</p>
        <p>
          {configStore.date === "2022" ? "June 2022" : "June 2023"} Ridership
        </p>
      </div>
      <ol className="w-full bg-gray-700 shadow-sm rounded-b-md max-h-[75vh] overflow-y-auto px-1">
        {sortedData.map((entry: StationTrip) => (
          <li
            key={entry.id}
            className={classNames(
              selectedStation === entry.id
                ? "bg-gray-200 text-gray-900"
                : "bg-gray-700",
              "w-full shadow-sm rounded-md py-2 px-2 cursor-pointer"
            )}
            onClick={() => setSelectedStation(entry.id)}
          >
            <div className="w-full flex flex-row justify-between gap-1">
              <p className="truncate">{entry.name}</p>
              <p className="italic">
                {entry.values[configStore.distance]?.total}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
