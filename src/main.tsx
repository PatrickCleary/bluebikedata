import React, { useEffect, useState } from "react";
import ReactGA from 'react-ga';
import "./App.css";
import { MapView } from "./maps/Map";
import { Header } from "./components/Header";
import { useSearchParams } from "react-router-dom";
import { ShapeSelection as DesktopMenu } from "./components/ShapeSelection";
import { NotificationPopUp } from "./components/NowDrawingPopup";
import { MobileFilters } from "./components/MobileFilters";
import { Loading } from "./components/Loading";
import { useSetConfigFromId } from "./store/MapStore";
import { DateLabel } from "./components/DateLabel";
import { ShareButton } from "./components/ShareButton";

export const Main = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const setConfigFromId = useSetConfigFromId();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        const url = new URL(window.location.toString())
        url.searchParams.delete('id')
        window.history.replaceState(null, '', url);
        const id = searchParams.get('id')
        if (id) {
            setConfigFromId(id);
            searchParams.delete('id')
            setSearchParams(searchParams)
        }
    }, [searchParams, setSearchParams, setConfigFromId])

    useEffect(() => {
        ReactGA.pageview(window.location.pathname);

    }, [])

    return (
        <div className="h-full w-[100vw] bg-[#222122] gap-y-4 flex flex-col">
            <div className="absolute z-10 h-full w-full pointer-events-none p-2 flex gap-1 md:gap-0  flex-col pb-5">
                <Header />
                <div className="md:w-full md:justify-between md:flex md:h-full">
                    <DateLabel />
                    <DesktopMenu />
                </div>
                <div className="w-full flex justify-between md:hidden">
                    <MobileFilters />
                    <ShareButton />
                </div>
            </div>
            <div className="absolute z-0 h-full w-full">
                <MapView setIsLoading={setIsLoading} />
            </div>
            <NotificationPopUp />

            {isLoading ? <Loading /> : null}
        </div>
    );
}
