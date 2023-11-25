import React, { useEffect, useState } from "react";
import ReactGA from 'react-ga4';
import "./App.css";
import { MapView } from "./maps/Map";
import { Header } from "./components/Header";
import { useSearchParams } from "react-router-dom";
import { DesktopMenu } from "./components/DesktopMenu";
import { Notifications } from "./components/Notifications";
import { Loading } from "./components/Loading";
import { useSetConfigFromId } from "./store/MapStore";
import { DataWidget } from "./components/statistics/DataLabel";
import { ShareButton } from "./components/ShareButton";
import { DateControl } from "./components/date/DateControl";
import { useLoadingStore } from "./store/LoadingStore";

export const Main = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, setIsLoading } = useLoadingStore((store) => store);
    const setConfigFromId = useSetConfigFromId();

    useEffect(() => {
        const url = new URL(window.location.toString())
        url.searchParams.delete('id')
        window.history.replaceState(null, '', url);
        const id = searchParams.get('id')
        if (id) {
            setIsLoading(true)
            setConfigFromId(id);
            searchParams.delete('id')
            setSearchParams(searchParams)
        }
    }, [searchParams, setSearchParams, setConfigFromId, setIsLoading])

    useEffect(() => {
        ReactGA.send({ hitType: "pageview" });
    }, [])

    return (
        <div className="h-full w-[100vw] bg-[#222122] gap-y-4 flex flex-col">
            <div className="absolute z-10 h-full w-full pointer-events-none p-2 flex gap-1 md:gap-0  flex-col pb-5">
                <Header />
                <div className="md:w-full  md:flex md:h-full justify-end flex flex-col gap-1">
                    <div className="hidden md:flex flex-col rounded-md px-2 py-2 gap-2 items-baseline bg-gray-800 shadow-sm border border-gray-700 w-fit md:max-w-sm pointer-events-auto">
                        <DateControl />
                    </div>
                    <DataWidget />
                    <DesktopMenu />
                </div>
                <div className="w-full flex justify-between md:hidden">
                    <DateControl /><ShareButton />
                </div>

            </div>
            <div className="absolute z-0 h-full w-full">
                <MapView />
            </div>
            <Notifications />

            {isLoading ? <Loading /> : null}
        </div>
    );
}
