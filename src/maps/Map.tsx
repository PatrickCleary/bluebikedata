import React, { SetStateAction, useCallback, useMemo, useState } from "react";

import {
  MapContainer,
  Pane,
  Polygon,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";

import { StationMarkerFactory } from "./DockMarkerFactory";
import { LatLngExpression, Map } from "leaflet";
import { useMapStore } from "../store/MapStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { PolygonVertices } from "../shapes/PolygonVertices";
import { PROJECT_OUTLINES } from "../constants/shapes";
import { useConfigStore } from "../store/ConfigStore";
import { COLORS } from "../constants";
import { useSelectionStore, useSetDocks } from "../store/SelectionStore";

const center: LatLngExpression = [42.371298659713226, -71.09789436448169];

export const MapView: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setIsLoading }) => {
  const [map, setMap] = useState<Map | null>(null);
  const mapStore = useMapStore((store) => store);
  const { project } = useConfigStore((store) => store);
  const { direction, shape } = useSelectionStore(store => store);
  map?.zoomControl.setPosition("bottomright");

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
          <Pane name="projects">
            {project ? PROJECT_OUTLINES[project].shape : null}
          </Pane>
          <StationMarkerFactory setIsLoading={setIsLoading} />

          <Pane name={"originDocks"}>
            <Polygon
              pathOptions={{ color: "#be0bf580" }}
              positions={shape['origin']?.map((entry) => entry.loc) || []}
            />
            <PolygonVertices direction='origin' />
          </Pane>
          <Pane name={"destinationDocks"}>
            <Polygon
              pathOptions={{ color: "#f59e0b80" }}
              positions={shape['destination']?.map((entry) => entry.loc) || []}
            />
            <PolygonVertices direction='destination' />
          </Pane>
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />
          <UpdateMapValues />
        </MapContainer>
      </>
    ),
    [mapStore, project, setIsLoading, shape]
  );

  return displayMap;
};

const UpdateMapValues: React.FC = () => {
  const mapStore = useMapStore((store) => store);
  const { addShapeVertex, isDrawing } = useSelectionStore((store) => store)
  const map = useMap();
  const setDocks = useSetDocks();
  const onZoom = useCallback(() => {
    mapStore.setZoom(map.getZoom());
  }, [map, mapStore]);
  useMapEvent("zoom", onZoom);

  useMapEvent("click", (e) => {
    if (!isDrawing) return null;
    const latLng = e.latlng;
    addShapeVertex([parseFloat(latLng.lat.toPrecision(7)), parseFloat(latLng.lng.toPrecision(7))]);
    setDocks();
  });

  return <></>;
};
