import React from "react";
import { useSelectionType, useSetNewShapeAndDocks } from "../../store/SelectionStore";
import { RegionSelection } from "../RegionSelection";

export const StatisticsHeader = () => {
    const selectionType = useSelectionType();
    const setShapeAndDocks = useSetNewShapeAndDocks();

    if (selectionType === "both")
        return (
            <span className="flex flex-row w-full">
                From
                <RegionSelection direction="origin" />
                to
                <RegionSelection direction="destination" />

            </span>
        );
    if (selectionType === "origin")
        return (
            <span className="flex flex-row w-full justify-between">
                <span className="flex flex-row">
                    From{" "}
                    <RegionSelection direction="origin" />
                </span>
                <RegionSelection direction="destination" active={false} />

            </span>
        );
    if (selectionType === "destination")
        return (
            <span className="flex flex-row w-full justify-between">
                <span className="flex flex-row">
                    To{" "}
                    <RegionSelection direction="destination" />
                </span>
                <RegionSelection direction="origin" active={false} />
            </span>
        );
    return (
        <span className="flex flex-row w-full justify-between">
            <RegionSelection direction="origin" active={false} />
            <RegionSelection direction="destination" active={false} />
        </span>
    );
}
