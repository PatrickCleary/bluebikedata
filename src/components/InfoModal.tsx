import {
  faQuestion,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export const InfoModal = () => {
  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className=" flex items-center justify-center">
        <button type="button" onClick={openModal}>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className="md:h-8 md:w-8 h-6 w-6 text-gray-100"
          />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-700 text-gray-100 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 "
                  >
                    Blue Bike Data
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm ">
                      Use this tool to discover insights into Blue Bike
                      ridership between June 2022 and June 2023 (more dates to
                      come).
                    </p>
                    <br />
                    <p className="font-bold text-sm">How to use:</p>
                    <ul style={{ listStyleType: "disc" }} className="pl-4">
                      <li>
                        Select one of three metrics: Trips, Duration or
                        Distance.
                      </li>
                      <li>
                        Each dot on the map is a dock, and the metrics are for
                        trips which began at that dock.
                      </li>
                      <li>
                        Brighter <span className="text-amber-500">orange</span>{" "}
                        signifies an increase for the given metric, and brighter{" "}
                        <span className="text-sky-400">blue</span> is a
                        decrease.
                      </li>
                      <li>Values for distance and duration are medians.</li>
                      <li>Select a dock to get more details.</li>
                      <li>Use the filters to select different datasets.</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Let's go
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
