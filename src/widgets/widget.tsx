import { useQuery } from "react-query";
import { fetchAllData } from "../api/all_data";
import { round } from "lodash";
import { useState } from "react";
import { DateTabs } from "../DateTabs";

const dateObject = {
  "2022": "June 2022",
  "2023": "June 2023",
  comp: "Comparison",
};

export const Widget: React.FC<any> = ({ stationId }) => {
  const [date, setDate] = useState<"comp" | "2022" | "2023">("comp");
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));

  if (!data_22.data || !data_23.data) {
    if (data_22.isLoading || data_23.isLoading) return <p>Loading...</p>;
    return <p>Error</p>;
  }
  const station_22 = data_22.data[stationId];
  const station_23 = data_23.data[stationId];

  return (
    <div className="w-full xl:w-3/4 rounded-sm bg-gray-700 shadow-sm px-4 py-4 mt-4">
      <div className="flex flex-row justify-between">
        <h1 className="italic text-base truncate md:text-lg text-stone-300">
          {station_23.name}
        </h1>
        <DateTabs options={dateObject} setDate={setDate} defaultIndex={2} />
      </div>
      {station_23 && station_22 ? (
        <div className="flex md:flex-row flex-col items-center justify-between py-4 gap-4">
          <WidgetValue
            station_22={station_22}
            station_23={station_23}
            value_name={"median_distance_miles"}
            filter={"nonzero"}
            title={"Median trip Distance"}
            unit="mi"
            date={date}
          />
          <WidgetValue
            station_22={station_22}
            station_23={station_23}
            value_name={"median_trip_duration"}
            filter={"nonzero"}
            title="Median trip duration"
            unit="seconds"
            date={date}
          />

          <WidgetValue
            station_22={station_22}
            station_23={station_23}
            value_name={"total"}
            filter={"nonzero"}
            title={"Trips"}
            unit="trips"
            date={date}
          />
        </div>
      ) : (
        <p className="text-gray-100">No comparison data for new stations.</p>
      )}
    </div>
  );
};

const WidgetValue: React.FC<any> = ({
  station_22,
  station_23,
  value_name,
  filter,
  title,
  unit,
  date,
}) => {
  if (date === "comp" && (!station_22 || !station_23))
    return <p>No comparison data for new stations.</p>;
  const before_value = station_22.values[filter][value_name];
  const after_value = station_23.values[filter][value_name];
  const diff = after_value - before_value;
  let value;
  switch (date) {
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
  return (
    <div className="flex flex-col gap-2 border border-gray-500 rounded-sm p-4 w-full">
      <div className="flex flex-row justify-between items-baseline">
        <h2 className="text-gray-300">{title ?? value_name}</h2>
        <h2 className="text-sm italic text-gray-300">{dateObject[date]}</h2>
      </div>
      <p className="text-2xl ƒont-semibold text-gray-100">
        {date === "comp" ? (diff > 0 ? "+" : "") : null}
        {round(value, 2)}
        <span className="text-sm text-gray-300 pl-1">{unit}</span>
      </p>
    </div>
  );
};
