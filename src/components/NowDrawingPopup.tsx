import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useNotificationStore } from "../store/NotificationStore";

export const NotificationPopUp = () => {
  const notification = useNotificationStore((store) => store.notification)
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (!notification)
      return
    setIsShowing(true);
    setTimeout(() => setIsShowing(false), 3000);
  }, [notification]);
  return (
    <div className="fixed bottom-0 h-0 w-full z-10 flex justify-center">
      <Transition
        as={Fragment}
        show={isShowing}
        enter="transform transition duration-[400ms] ease-in-out"
        enterFrom="opacity-0 translate-y-5"
        enterTo="opacity-100  -translate-y-5"
        leave="transform duration-200 transition ease-in-out "
        leaveFrom="opacity-100   -translate-y-5"
        leaveTo="opacity-0  translate-y-5 "
      >
        <div className="px-4 py-2 opacity-80 shadow-sm  bottom-4 fixed rounded-md bg-white italic">
          <p>
            {notification?.text}
          </p>
        </div>
      </Transition>
    </div>
  );
};
