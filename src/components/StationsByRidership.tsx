import classNames from "classnames";
import React, { SetStateAction } from "react";
import { useQuery } from "react-query";
import { fetchAllData } from "../api/all_data";
import { DISTANCE_MIN_MAP } from "../constants";
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
  const configStore = useConfigStore((store) => store);
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));

  if (!data_23.data) return <p>loading</p>;
  const sortedData = Object.values(data_23.data).sort(
    (valueA: StationTrip, valueB: StationTrip) =>
      valueB.values[configStore.distance]?.total -
      valueA.values[configStore.distance]?.total
  );
  return (
    <div className="text-gray-100 w-full md:col-span-1 h-full overflow-hidden">
      <div className="w-full sticky flex flex-row h-10 justify-between py-2 bg-gray-800 px-2 truncate gap-4">
        <p>Station</p>
        <p className="truncate">
          Trips {configStore.date === "2022" ? "June 2022" : "June 2023"} (
          {DISTANCE_MIN_MAP[configStore.distance]})
        </p>
      </div>
      <div>
        <ol className="w-full bg-gray-700 shadow-sm  h-[440px] md:h-[1048.68px] lg:h-[645.52px] xl:h-[646.13px] 3xl:h-[826.13px]  overflow-y-auto overflow-x-hidden px-1">
          {sortedData.map((entry: StationTrip) => (
            <li
              key={entry.id}
              className={classNames(
                selectedStation === entry.id
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-700",
                "w-full shadow-sm rounded-md py-2 px-2 cursor-pointer overflow-hidden "
              )}
              onClick={() => setSelectedStation(entry.id)}
            >
              <div className="w-full flex flex-row justify-between gap-1 truncate">
                <p className="truncate">{entry.name}</p>
                <p className="italic ">
                  {entry.values[configStore.distance]?.total}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
