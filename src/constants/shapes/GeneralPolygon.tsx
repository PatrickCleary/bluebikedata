import React from "react";
import { LatLngExpression } from "leaflet";
import { Polygon } from "react-leaflet";

interface GeneralPolygonProps {
  shapes: LatLngExpression[];
}

export const GeneralPolygon: React.FC<GeneralPolygonProps> = ({ shapes }) => {
  return <Polygon pathOptions={{ color: "white" }} positions={shapes} />;
};
