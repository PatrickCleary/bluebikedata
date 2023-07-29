import React, { useCallback, useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import { MarkerLayer } from "react-leaflet-marker";
import { StationMarkerFactory } from "./StationMarkerFactory";
import { LatLngExpression, Map } from "leaflet";
import { useMapStore } from "../store/MapStore";
const whiteOptions = { color: "white" };

const center: LatLngExpression = [42.336277, -71.09169];

export const MapView: React.FC = () => {
  const [map, setMap] = useState<Map | null>(null);
  const mapStore = useMapStore((store) => store);

  const displayMap = useMemo(
    () => (
      <>
        <div className="rounded-full shadow-sm h-6 bg-gradient-to-r from-sky-400 to-amber-500 via-neutral-400 absolute top-4 right-4 z-10 justify-between flex flex-row text-gray-100 text-sm gap-12 items-center px-2 font-bold">
          <p className="text-neutral-100">-100%</p>
          <p className="text-neutral-100">+100%</p>
        </div>

        <MapContainer
          id="map-container"
          className="z-0"
          center={center}
          zoom={mapStore.zoom}
          ref={setMap}
          maxZoom={18}
          minZoom={10}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          {Object.entries(mapStore.shapes).map(([name, shape]) => (
            <>
              <Polygon
                pathOptions={whiteOptions}
                positions={shape}
                key={name}
              />
            </>
          ))}

          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
          <MarkerLayer>
            <StationMarkerFactory />
          </MarkerLayer>
        </MapContainer>
      </>
    ),
    [mapStore]
  );

  return (
    <>
      {map ? <UpdateMapValues map={map} /> : null}
      {displayMap}
    </>
  );
};

const UpdateMapValues = ({ map }) => {
  const mapStore = useMapStore((store) => store);

  const onZoom = useCallback(() => {
    mapStore.setZoom(map.getZoom());
  }, [map, mapStore]);

  useEffect(() => {
    map.on("zoom", onZoom);
    return () => {
      map.off("zoom", onZoom);
    };
  }, [map, onZoom]);

  return <></>;
};
