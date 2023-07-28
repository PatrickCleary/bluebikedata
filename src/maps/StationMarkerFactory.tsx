import { SetStateAction } from "react";
import { useQuery } from "react-query";
import { fetchAllData } from "../api/all_data";
import { useConfigStore } from "../store/ConfigStore";
import { StationTrip } from "../types/Data";
import { StationMarker } from "./StationMarker";

interface StationMarkerFactoryProps {
  selectedStation: string | undefined;
  setSelectedStation: React.Dispatch<SetStateAction<string>>;
}

export const StationMarkerFactory: React.FC<StationMarkerFactoryProps> = ({
  selectedStation,
  setSelectedStation,
}) => {
  const configStore = useConfigStore((store) => store);
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));
  if (data_23.isError || data_23.isLoading || !data_23.data || !data_22.data)
    return null;
  return (
    <>
      {Object.values(data_23.data).map((station: StationTrip) => {
        if (station.values["all"]?.total < configStore.ridershipMin)
          return null;
        const lat = station["latitude"];
        const lng = station["longitude"];
        const isNew = data_22.data[station.id] == null;
        const selected = station.id === selectedStation;
        const value =
          (data_23.data[station.id]?.values[configStore.distance]?.[
            configStore.metric
          ] -
            data_22.data[station.id]?.values[configStore.distance]?.[
              configStore.metric
            ]) /
          data_22.data[station.id]?.values[configStore.distance]?.[
            configStore.metric
          ];

        return (
          <StationMarker
            isNew={isNew}
            id={station.id}
            position={[lat, lng]}
            key={station["id"]}
            name={station["name"]}
            selected={selected}
            onClick={() => setSelectedStation(station.id)}
            value={value}
          />
        );
      })}
    </>
  );
};
