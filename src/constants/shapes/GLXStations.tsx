import { CircleMarker } from "react-leaflet";
import { GLX_STATIONS } from "../shapes";

// TODO: don't make cursor pointer on hover.
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
