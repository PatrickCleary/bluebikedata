import { CircleMarker } from "react-leaflet";
import { GLX_STATIONS } from "../shapes";

export const GLXStations = () => {
  return (
    <>
      {GLX_STATIONS.map((loc) => (
        <CircleMarker
          center={loc}
          pathOptions={{ color: "white" }}
        ></CircleMarker>
      ))}
    </>
  );
};
