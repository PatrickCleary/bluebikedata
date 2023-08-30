import classNames from "classnames";
import { PROJECT_OUTLINES } from "../constants/shapes";
import { useConfigStore } from "../store/ConfigStore";

export const ProjectOutlines = () => {
  const { shape, setShape } = useConfigStore();
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm w-full italix">Projects</h3>
      <div className="flex flex-col gap-1">
        {Object.values(PROJECT_OUTLINES).map((shapeObject) => {
          const selected = shape === shapeObject.key;
          return (
            <div
              className={classNames(
                selected ? "bg-gray-500" : "",
                "px-4 py-1  flex flex-row gap-2  text-gray-100 items-center select-none cursor-pointer w-full rounded-sm bg-gray-700"
              )}
              onClick={() => {
                if (selected) {
                  setShape(undefined);
                } else {
                  setShape(shapeObject.key);
                }
              }}
            >
              <div
                className={classNames(
                  "h-3 w-3 border border-gray-100 rounded-full",
                  selected ? "bg-gray-100" : ""
                )}
              ></div>
              <p className="truncate">{shapeObject.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
