import classNames from "classnames";
import React from "react";
import { shapeOptions } from "../constants/shapes";
import { useMapStore } from "../store/MapStore";

export const ShapeSelection = () => {
  const { shapes, setShapes } = useMapStore();
  return (
    <div className="h-[440px] md:h-[1088.68px] lg:h-[685.52px] xl:h-[686.13px] 3xl:h-[866.13px] w-full bg-gray-700 gap-1 px-2 py-2 text-gray-100 ">
      <h3 className="text-lg pb-2">Projects:</h3>
      {Object.entries(shapeOptions).map(([name, shape]) => {
        const selected = shapes[name];
        return (
          <div
            className={classNames(
              selected ? "bg-gray-100 text-gray-800" : "text-gray-100",
              "px-4 py-1 rounded-full flex flex-row gap-2 items-center select-none cursor-pointer border border-gray-100"
            )}
            onClick={() => {
              if (selected) {
                delete shapes[name];
                setShapes(shapes);
              } else {
                setShapes({ ...shapes, [name]: shape });
              }
            }}
          >
            <div
              className={classNames(
                "h-3 w-3 border border-gray-100 rounded-full",
                selected ? "bg-gray-700" : ""
              )}
            ></div>
            <p className="truncate">{name}</p>
          </div>
        );
      })}
      <p className="px-2 pt-4">More coming soon...</p>
    </div>
  );
};
