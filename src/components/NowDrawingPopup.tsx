import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useMapStore } from "../store/MapStore";

export const NowDrawingPopup = () => {
  const isDrawing = useMapStore((store) => store.isDrawing);
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    setIsShowing(true);
    setTimeout(() => setIsShowing(false), 3000);
  }, [isDrawing]);
  return (
    <div className="fixed bottom-0 h-0 w-full z-10 flex justify-center">
      <Transition
        as={Fragment}
        show={isShowing}
        enter="transform transition duration-[400ms]"
        enterFrom="opacity-0 translate-y-5"
        enterTo="opacity-100  -translate-y-5"
        leave="transform duration-200 transition ease-in-out "
        leaveFrom="opacity-100   -translate-y-5"
        leaveTo="opacity-0  translate-y-5 "
      >
        <div className="px-4 py-2 opacity-80 shadow-sm  bottom-4 fixed rounded-md bg-white ">
          <p>
            {isDrawing ? "Click/tap on the map to draw." : "Drawing mode off"}
          </p>
        </div>
      </Transition>
    </div>
  );
};
