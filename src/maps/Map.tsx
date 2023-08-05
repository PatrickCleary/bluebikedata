import React, { useCallback, useMemo, useState } from "react";

import {
  LayerGroup,
  MapContainer,
  Polygon,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";

import { StationMarkerFactory } from "./StationMarkerFactory";
import { LatLngExpression, Layer, Map } from "leaflet";
import { useMapStore } from "../store/MapStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useConfigStore } from "../store/ConfigStore";
import { PolygonVertices } from "../shapes/PolygonVertices";
import { GLXStations } from "../constants/shapes/GLXStations";
import { PROJECT_OUTLINES } from "../constants/shapes";
const whiteOptions = { color: "white" };

const center: LatLngExpression = [42.336277, -71.09169];

export const MapView: React.FC = () => {
  const [map, setMap] = useState<Map | null>(null);
  const mapStore = useMapStore((store) => store);
  const configStore = useConfigStore((store) => store);

  const displayMap = useMemo(
    () => (
      <>
        <div className="rounded-full shadow-sm h-6 bg-gradient-to-r from-sky-400 to-amber-500 via-neutral-400 absolute top-4 right-4 z-10 justify-between flex flex-row text-gray-100 text-sm gap-12 items-center px-2 font-bold">
          <FontAwesomeIcon
            icon={faArrowDown}
            className="text-neutral-100 px-3"
            size={"lg"}
          />
          <FontAwesomeIcon
            icon={faArrowUp}
            className="text-neutral-100 px-3"
            size={"lg"}
          />
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
          <LayerGroup>
            <Polygon
              pathOptions={{ color: "#f59e0b" }}
              positions={mapStore.startShape?.map((entry) => entry.loc) || []}
            />
            <PolygonVertices />
          </LayerGroup>
          <LayerGroup>
            {mapStore.shapeKey
              ? PROJECT_OUTLINES[mapStore.shapeKey].shape
              : null}
          </LayerGroup>
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
          <StationMarkerFactory />
          <UpdateMapValues />
        </MapContainer>
      </>
    ),
    [mapStore]
  );

  return displayMap;
};

const UpdateMapValues: React.FC = () => {
  const mapStore = useMapStore((store) => store);
  const map = useMap();
  const onZoom = useCallback(() => {
    mapStore.setZoom(map.getZoom());
  }, [map, mapStore]);
  useMapEvent("zoom", onZoom);

  useMapEvent("click", (e) => {
    if (!mapStore.isDrawing) return null;
    const latLng = e.latlng;
    mapStore.addToStartShape([latLng.lat, latLng.lng]);
  });

  return <></>;
};
