import classNames from "classnames";
import { PROJECT_OUTLINES } from "../constants/shapes";
import { useMapStore } from "../store/MapStore";

export const ProjectOutlines = () => {
  const { shapeKey, setShapeKey } = useMapStore();
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm w-full italix">Projects</h3>
      <div className="flex flex-col gap-1">
        {Object.values(PROJECT_OUTLINES).map((shape) => {
          const selected = shapeKey === shape.key;
          return (
            <div
              className={classNames(
                selected ? "text-gray-800" : "text-gray-100 bg-opacity-10",
                "px-4 py-1  flex flex-row gap-2 items-center select-none cursor-pointer w-full rounded-sm bg-neutral-100"
              )}
              onClick={() => {
                if (selected) {
                  setShapeKey(undefined);
                } else {
                  setShapeKey(shape.key);
                }
              }}
            >
              <div
                className={classNames(
                  "h-3 w-3 border border-gray-100 rounded-full",
                  selected ? "bg-gray-800" : ""
                )}
              ></div>
              <p className="truncate">{shape.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
