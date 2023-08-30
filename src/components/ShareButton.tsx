import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import React, { Fragment, useEffect, useState } from 'react';
import { saveShape } from '../api/shapes';
import { useMapStore } from '../store/MapStore';
export const ShareButton = () => {

    const [shareURL, setShareURL] = useState<string | undefined>(undefined);
    const [showMsg, setShowMsg] = useState(false);
    const mapStore = useMapStore((store) => store)

    useEffect(() => {
        if (showMsg) {
            setTimeout(() => setShowMsg(false), 1500)
        }

    }, [showMsg])

    const saveShapeById = async () => {
        setShowMsg(true)
        if (!shareURL && mapStore.startShape?.length) {
            const id = await saveShape(mapStore.startShape)
            const url = new URL(window.location.toString())
            url.searchParams.set('id', id)
            setShareURL(url.toString())
            navigator.clipboard.writeText(url.toString())
        }

    }

    useEffect(() => {
        setShareURL(undefined)
    }, [mapStore.startShape])
    return (
        <div className="flex flex-row py-1 border border-gray-600 rounded-md hover:bg-white hover:bg-opacity-20 relative">
            <button
                className={classNames(
                    !mapStore.startShape?.length ? "text-neutral-700" : "text-neutral-100",
                    "rounded-full gap-2 flex flex-row px-10 items-center py-[2px]"
                )}
                disabled={!mapStore.startShape?.length}
                onClick={saveShapeById}
            >
                <FontAwesomeIcon icon={faCopy} className={classNames(mapStore.startShape?.length ? "text-neutral-100" : "text-neutral-700", "h-4 w-4 cursor-pointer")} />

                <p>Copy link</p>

            </button>
            <div className="absolute top-0 left-0 overflow-hidden h-full w-full pointer-events-none	rounded-md">
                <Transition
                    as={Fragment}
                    show={showMsg}
                    enter="transform transition duration-[600ms]"
                    enterFrom="opacity-0 scale-50 bg-gray-800"
                    enterTo="opacity-100 scale-100 bg-gray-700"
                    leave="transform duration-[600ms] transition ease-in-out"
                    leaveFrom="opacity-100 bg-gray-700 text-gray-200"
                    leaveTo=" scale-150 bg-gray-800 text-gray-800"
                >
                    <div className="absolute top-0 left-0 h-full w-full text-gray-200 rounded-md bg-gray-700 shadow-lg items-center justify-center flex pointer-events-auto select-none" >
                        <p className=" text-sm">Copied to clipboard</p>
                    </div>
                </Transition>
            </div>
        </div >)
}