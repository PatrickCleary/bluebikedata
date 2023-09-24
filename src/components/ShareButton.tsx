import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import React, { Fragment, useEffect, useState } from "react";
import { saveConfig } from "../api/config";
import { useMapStore } from "../store/MapStore";
import { useBreakpoint } from "../helpers/breakpoints";
import { useNotificationStore } from "../store/NotificationStore";
import { useConfigStore } from "../store/ConfigStore";
import { useSelectionStore } from "../store/SelectionStore";
export const ShareButton = () => {
    const [shareID, setShareID] = useState<string | undefined>(undefined);
    const [showMsg, setShowMsg] = useState(false);
    const setNotification = useNotificationStore((store) => store.setNotification);
    const mapStore = useMapStore((store) => store);
    const selectionStore = useSelectionStore((store) => store)
    const configStore = useConfigStore((store) => store);
    const isMobile = !useBreakpoint("md");
    useEffect(() => {
        if (showMsg) {
            setTimeout(() => setShowMsg(false), 1500);
        }
    }, [showMsg]);

    const saveShapeById = async () => {
        setShowMsg(true);
        const url = new URL(window.location.toString());
        if (shareID) {
            url.searchParams.set("id", shareID);
            navigator.clipboard.writeText(url.toString());
        }
        if (!shareID) {
            const newID = uuidv4().slice(0, 8);
            url.searchParams.set("id", newID);
            navigator.clipboard.writeText(url.toString());
            const destinationDock = selectionStore.shape['destination']?.length ? undefined : selectionStore.selectedDocks['destination']?.[0]
            const originDock = selectionStore.shape['origin']?.length ? undefined : selectionStore.selectedDocks['origin']?.[0]

            await saveConfig({
                id: newID,
                version: '2',
                configParams: {
                    center: [40, -71],
                    zoom: 13,
                    ridershipMin: configStore.ridershipMin,
                    shape: selectionStore.shape,
                    project: configStore.project,
                    date: configStore.date,
                    originDock: originDock,
                    destinationDock: destinationDock,
                }
            });
            setShareID(newID);
        } else {
            navigator.clipboard.writeText(url.toString());
        }
    };

    useEffect(() => {
        setShareID(undefined);
    }, [mapStore, configStore]);

    if (isMobile)
        return (
            <>
                <button
                    type="button"
                    className="flex items-center justify-center w-fit md:hidden bg-gray-800 border border-gray-700  p-2 pointer-events-auto shadow-md rounded-md"
                    onClick={() => {
                        saveShapeById()
                        setNotification({ text: 'Link copied to clipboard' })
                    }}
                >
                    <FontAwesomeIcon
                        icon={faShareFromSquare}
                        className="md:h-6 md:w-6 h-6 w-6 text-gray-300 "
                    />
                </button>
            </>
        );
    return (
        <div className="relative w-full flex justify-center">
            <button
                className={classNames(
                    "w-full flex justify-center gap-2 flex-row border rounded-sm hover:bg-gray-700 border-gray-700 items-center text-neutral-100 py-1 text-sm"
                )}
                onClick={saveShapeById}
            >
                <FontAwesomeIcon
                    icon={faShareFromSquare}
                    className={classNames(
                        "h-3 w-3 cursor-pointer text-neutral-100"
                    )}
                />

                <p>Share</p>
            </button>
            <div className="absolute top-0 left-0 overflow-hidden h-full w-full rounded-md pointer-events-none	border-gray-700 border border-transparent box-border">
                <Transition
                    as={Fragment}
                    show={showMsg}
                    enter="transform transition ease-in-out duration-[600ms]"
                    enterFrom="opacity-0 scale-50 bg-gray-800"
                    enterTo="opacity-100 scale-100 bg-gray-700"
                    leave="transform duration-[600ms] transition ease-in-out"
                    leaveFrom="opacity-100 bg-gray-700 text-gray-200"
                    leaveTo=" scale-150 bg-gray-700 text-gray-700"
                >
                    <div className="absolute top-0 left-0 h-full w-full rounded-[.25rem] text-gray-200 rounded-smbg-gray-700 shadow-lg items-center justify-center flex pointer-events-auto select-none">
                        <p className=" text-sm">Copied to clipboard</p>
                    </div>
                </Transition>
            </div>
        </div>
    );
};
