import React, { useEffect, useState } from "react";
import "./App.css";
import { MapView } from "./maps/Map";
import { Header } from "./components/Header";
import { useSearchParams } from "react-router-dom";
import { useConfigStore } from "./store/ConfigStore";
import { ShapeSelection as DesktopMenu } from "./components/ShapeSelection";
import { NowDrawingPopup } from "./components/NowDrawingPopup";
import { MobileFilters } from "./components/MobileFilters";
import { Loading } from "./components/Loading";
import { useSetShapeFromId, useSetStartStations } from "./store/MapStore";
import { DateLabel } from "./components/DateLabel";

export const Main = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const setShapeFromId = useSetShapeFromId();
    const setStartStations = useSetStartStations();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const loadFromParams = useConfigStore((store) => store.loadFromParams);
    useEffect(() => {
        loadFromParams(Object.fromEntries(searchParams.entries()));
        const url = new URL(window.location.toString())
        url.searchParams.delete('id')
        window.history.replaceState(null, '', url);
        const id = searchParams.get('id')
        if (id) {
            setShapeFromId(id);
            searchParams.delete('id')
            setSearchParams(searchParams)
        }
    }, [loadFromParams, searchParams, setSearchParams, setShapeFromId, setStartStations])


    return (
        <div className="h-full w-[100vw] bg-[#222122] gap-y-4 flex flex-col">
            <div className="absolute z-10 h-full w-full pointer-events-none p-2 flex gap-1 md:gap-0  flex-col pb-5">
                <Header />
                <div className="md:w-full md:justify-between md:flex md:h-full">
                    <DateLabel />
                    <DesktopMenu />
                </div>
                <MobileFilters />
            </div>
            <div className="absolute z-0 h-full w-full">
                <MapView setIsLoading={setIsLoading} />
            </div>
            <NowDrawingPopup />
            {/* <StationCountPopUp /> */}

            {isLoading ? <Loading /> : null}
        </div>
    );
}
