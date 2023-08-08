import React, { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { CircleMarker, Tooltip } from "react-leaflet";

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
  const targetSize = getSize(isMobile, inside, percentageValue, absValue);
  const getOpacity = () => {
    if (!startStationsSelected) return 1;
    if (inside) return 1;

    return 0.5;
  };

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
      // className={`transition-all `}
      eventHandlers={
        select
          ? {
              click: select,
            }
          : undefined
      }
      fillOpacity={getOpacity()}
      key={`${name}-${inside}-${absValue}-${isMobile}-${targetSize}-${startStationsSelected}`}
      stroke={false}
      radius={size}
    >
      <Tooltip>
        <p className="text-base">
          {name} {absValue ? `- ${absValue}` : ""}
        </p>
      </Tooltip>
    </CircleMarker>
  );
};

const getSize = (isMobile, inside, percentageValue, absValue) => {
  if (inside) return isMobile ? 4 : 6;
  if (absValue === 0) return 0;
  if (absValue !== undefined)
    return isMobile ? percentageValue * 20 : percentageValue * 32;
  return isMobile ? 6 : 6;
};
