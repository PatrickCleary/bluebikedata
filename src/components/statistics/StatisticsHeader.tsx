import React from "react";
import { useSelectionType } from "../../store/SelectionStore";
import { RegionSelection } from "../RegionSelection";

export const StatisticsHeader = () => {
    const selectionType = useSelectionType();

    if (selectionType === "both")
        return (
            <span>
                from
                <RegionSelection direction="origin" />
                to
                <RegionSelection direction="destination" />

            </span>
        );
    if (selectionType === "origin")
        return (
            <span>
                from{" "}
                <RegionSelection direction="origin" />
                <RegionSelection direction="destination" active={false} />

            </span>
        );
    if (selectionType === "destination")
        return (
            <span>
                to{" "}
                <RegionSelection direction="destination" />
                <RegionSelection direction="origin" active={false} />
            </span>
        );
    return (
        <span>
            <RegionSelection direction="origin" active={false} />
            <RegionSelection direction="destination" active={false} />
        </span>
    );
}
