import classNames from "classnames";
import React from "react";
import { shapeOptions } from "../constants/shapes";
import { useClearStartStations } from "../store/ConfigStore";
import { useMapStore } from "../store/MapStore";

export const ShapeSelection = () => {
  const { shapes, setShapes, clearStartShape } = useMapStore();
  const clearSelection = useClearStartStations();
  return (
    <div className="h-[25vh] md:h-[80vh] left-0 md:top-50 lg:top-40 bottom-0 top-auto fixed z-10 w-90 w-full md:w-auto m-2 bg-gray-700 gap-1 px-2 py-2 text-gray-100 rounded-md ">
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
                selected ? "bg-gray-800" : ""
              )}
            ></div>
            <p className="truncate">{name}</p>
          </div>
        );
      })}
      <button onClick={clearSelection}>clear selection.</button>
      <button onClick={clearStartShape}>clear startShape.</button>
      <p className="px-2 pt-4">More coming soon...</p>
    </div>
  );
};
