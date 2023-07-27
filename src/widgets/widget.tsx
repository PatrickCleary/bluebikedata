import { useQuery } from "react-query";
import { fetchAllData } from "../api/all_data";
import { round } from "lodash";
import { useConfigStore } from "../store/ConfigStore";
import { DATE_MAP } from "../constants";
import { Tabs } from "../components/Tabs";

const dateObject = {
  "2022": "June 2022",
  "2023": "June 2023",
  comp: "Comparison",
};

export const Widget: React.FC<any> = ({ stationId }) => {
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));
  const configStore = useConfigStore((store) => store);

  if (!data_22.data || !data_23.data) {
    if (data_22.isLoading || data_23.isLoading) return <p>Loading...</p>;
    return <p>Error</p>;
  }
  const station_22 = data_22.data[stationId];
  const station_23 = data_23.data[stationId];

  return (
    <div className="w-full rounded-sm bg-gray-700 shadow-sm px-4 py-4 mt-4">
      <div className="flex flex-row justify-between">
        <h1 className="italic text-base truncate md:text-lg text-stone-300">
          {station_23.name}
        </h1>
        <div className="flex flex-row gap-2 items-baseline">
          <Tabs
            defaultIndex={2}
            setValue={configStore.setDate}
            options={DATE_MAP}
          />
        </div>
      </div>
      <div className="flex md:flex-row flex-col items-center justify-between py-4 gap-4">
        <WidgetValue
          station_22={station_22}
          station_23={station_23}
          value_name={"median_distance_miles"}
          configStore={configStore}
          title={"Median trip Distance"}
          unit="mi"
        />
        <WidgetValue
          station_22={station_22}
          station_23={station_23}
          value_name={"median_trip_duration"}
          configStore={configStore}
          title="Median trip duration"
          unit="seconds"
        />

        <WidgetValue
          station_22={station_22}
          station_23={station_23}
          value_name={"total"}
          configStore={configStore}
          title={"Trips"}
          unit="trips"
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
  const before_value = station_22?.values[configStore.distance][value_name];
  const after_value = station_23?.values[configStore.distance][value_name];
  const diff = after_value - before_value;
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
  return (
    <div className="flex flex-col gap-2 border border-gray-500 rounded-sm p-4 w-full">
      <div className="flex flex-row justify-between items-baseline">
        <h2 className="text-gray-300">{title ?? value_name}</h2>
        <h2 className="text-sm italic text-gray-300">
          {DATE_MAP[configStore.date]}
        </h2>
      </div>
      <p className="text-2xl ƒont-semibold text-gray-100">
        {!isNaN(value) ? (
          <>
            {configStore.date === "comp" ? (diff > 0 ? "+" : "") : null}
            {round(value, 2)}
            <span className="text-sm text-gray-300 pl-1">{unit}</span>
          </>
        ) : (
          <>No data</>
        )}
      </p>
    </div>
  );
};
