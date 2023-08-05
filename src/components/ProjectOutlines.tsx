import classNames from "classnames";
import { PROJECT_OUTLINES } from "../constants/shapes";
import { useMapStore } from "../store/MapStore";

export const ProjectOutlines = () => {
  const { shapes, setShapes, clearStartShape } = useMapStore();
  return (
    <>
      <h3 className="text-lg pb-2">Projects:</h3>
      {Object.entries(PROJECT_OUTLINES).map(([name, shape]) => {
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
    </>
  );
};
