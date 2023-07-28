import Slider from "rc-slider";
import React from "react";
import { useConfigStore } from "../store/ConfigStore";

export const TripSlider = () => {
  const configStore = useConfigStore((store) => store);

  return (
    <div className="max-w-[20rem] w-full md:w-auto flex-grow flex flex-col">
      <p className="text-gray-300 italic">Riders (June 23)</p>

      <div className="h-8 flex flex-row gap-4 items-center ">
        <input
          className="h-full bg-gray-800 px-2 outline-none w-20"
          defaultValue={0}
          onChange={(event) =>
            configStore.setRidership(
              event.target.value === "" ? 0 : event.target.value
            )
          }
          value={configStore.ridershipMin}
        />
        <Slider
          min={0}
          value={configStore.ridershipMin}
          max={1000}
          onChange={(value) =>
            Array.isArray(value) ? value[0] : configStore.setRidership(value)
          }
          className="h-full py-2"
        />
      </div>
    </div>
  );
};
