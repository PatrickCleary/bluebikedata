import {
  faCircle,
  faCircleNodes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface InfoModalProps {
  defaultOpen?: boolean;
  renderTrigger?: (open: () => void) => React.ReactNode;
}

export const InfoModal = ({ defaultOpen = true, renderTrigger }: InfoModalProps) => {
  let [isOpen, setIsOpen] = useState(defaultOpen);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      {renderTrigger ? (
        renderTrigger(openModal)
      ) : (
        <button
          type="button"
          className="flex items-start justify-start"
          onClick={openModal}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="md:h-6 md:w-6 h-4 w-4 text-gray-100 pl-2"
          />
        </button>
      )}

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-gray-800 text-gray-100 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-2xl font-bold font-medium leading-6">
                    Bluebikes Data
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm">
                      Use this tool to discover insights into Bluebike ridership.
                    </p>
                    <br />
                    <p className="font-bold text-sm">How to use:</p>
                    <ul style={{ listStyleType: "disc" }} className="pl-4 text-sm">
                      <li>
                        Tap/click a station to select as the <b>origin</b> station or use the
                        multiselect{" "}
                        <FontAwesomeIcon icon={faCircleNodes} className="text-amber-500" />{" "}
                        to draw an <b>origin</b> region.
                      </li>
                      <li>
                        Other docks{" "}
                        <FontAwesomeIcon icon={faCircle} className="text-sky-400 opacity-60" />{" "}
                        will inflate according to the number of trips which end at that dock.
                      </li>
                      <li>Hover over a dock to see exact numbers.</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Let's go
                    </button>
                  </div>
                  <div className="mt-4 text-xs text-center">
                    <span className="text-gray-500">Created by </span>
                    <a href="https://www.patrickcleary.com" className="text-gray-400 hover:text-gray-200">
                      Patrick Cleary
                    </a>
                    <span className="text-gray-600 mx-2">|</span>
                    <a href="https://github.com/PatrickCleary/bluebikedata" className="text-gray-400 hover:text-gray-200">
                      GitHub
                    </a>
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
