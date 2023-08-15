import React, { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { CircleMarker, Tooltip } from "react-leaflet";
import classNames from "classnames";

interface StationMarkerProps {
  position: LatLngExpression;
  name: string;
  select: (() => void) | undefined;
  inside: boolean;
  isMobile: boolean;
  startStationsSelected: boolean;
  percentageValue: number | undefined;
  absValue: number | undefined;
}

export const StationMarker: React.FC<StationMarkerProps> = ({
  position,
  name,
  select,
  percentageValue,
  startStationsSelected,
  absValue,
  isMobile,
  inside,
}) => {
  const [size, setSize] = useState(6);
  const getOpacity = () => {
    if (absValue === undefined && startStationsSelected) return "opacity-50";
    if (!startStationsSelected) return "opacity-100";
    if (inside) return "opacity-100";
    return "opacity-50";
  };
  const getSize = () => {
    if (inside) return isMobile ? 4 : 6;
    if (startStationsSelected && absValue === undefined) {
      return 0;
    }
    if (absValue !== undefined && percentageValue)
      return isMobile ? percentageValue * 20 : percentageValue * 32;
    return isMobile ? 6 : 6;
  };
  const targetSize = getSize();

  const opacity = getOpacity();

  useEffect(() => {
    const startSize = size;

    const animate = () => {
      if (Math.abs(targetSize - size) <= 1) return null;
      let newSize = startSize;
      if (size < targetSize) newSize += 1;
      if (size > targetSize) newSize -= 1;

      setSize(newSize);
      requestAnimationFrame(animate);
      return null;
    };

    requestAnimationFrame(animate);
  }, [size, targetSize, percentageValue]);
  return (
    <CircleMarker
      center={position}
      color={inside ? "#f59e0b" : "#38bdf8"}
      className={classNames(opacity)}
      eventHandlers={
        select
          ? {
              click: select,
            }
          : undefined
      }
      key={`${name}-${inside}-${absValue}-${isMobile}-${targetSize}-${startStationsSelected}`}
      stroke={false}
      fillOpacity={1}
      radius={size}
    >
      {!isMobile ? (
        <Tooltip>
          <p className="text-base">
            {name} {absValue ? `- ${absValue}` : ""}
          </p>
        </Tooltip>
      ) : null}
    </CircleMarker>
  );
};
