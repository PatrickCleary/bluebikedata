import React, { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { CircleMarker, Tooltip } from "react-leaflet";
import classNames from "classnames";

interface DockMarkerProps {
  position: LatLngExpression;
  name: string;
  id: string;
  color: string;
  select: (() => void) | undefined;
  inside: boolean;
  isMobile: boolean;
  startStationsSelected: boolean;
  absValue: number | undefined;
  size: number;
}

export const DockMarker: React.FC<DockMarkerProps> = ({
  position,
  name,
  id,
  color,
  select,
  startStationsSelected,
  absValue,
  isMobile,
  inside,
  size,
}) => {
  const getOpacity = () => {
    if (inside) return "opacity-100";
    if (absValue === undefined && startStationsSelected) return "opacity-50";
    if (!startStationsSelected) return "opacity-100";
    return "opacity-50";
  };
  const opacity = getOpacity();
  const [currentSize, setCurrentSize] = useState(0);

  useEffect(() => {
    if (!startStationsSelected || size === 0)
      setCurrentSize(size)
    else if (Math.abs(size - currentSize) > 1) {
      setTimeout(() => setCurrentSize(currentSize + (size - currentSize) / (2 * Math.abs((size - currentSize)))), 5);
    }
  }, [currentSize, size, startStationsSelected])
  return (
    <CircleMarker
      center={position}
      color={color}
      className={classNames(opacity)}
      eventHandlers={
        select
          ? {
            click: select,
          }
          : undefined
      }

      key={`${name}-${inside}-${absValue}-${isMobile}-${size}-${startStationsSelected}-${color}`}
      stroke={false}
      fillOpacity={1}
      radius={currentSize}
    >
      {!isMobile ? (
        <Tooltip >
          <p className="text-base">
            {name} {absValue ? `- ${absValue}` : ""}
          </p>
        </Tooltip>
      ) : null}
    </CircleMarker>
  );
};
