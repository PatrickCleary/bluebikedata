import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { MarkerLayer } from "react-leaflet-marker";
import { StationMarkerFactory } from "./StationMarkerFactory";

export const MapView = () => {
  return (
    <MapContainer
      id="map-container"
      center={[42.366277, -71.09169]}
      zoom={12}
      maxZoom={20}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
      <MarkerLayer>
        <StationMarkerFactory />
      </MarkerLayer>
    </MapContainer>
  );
};
