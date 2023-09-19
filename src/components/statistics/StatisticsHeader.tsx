import React from "react";
import { useSelectionType } from "../../store/SelectionStore";

export const StatisticsHeader = () => {
    const selectionType = useSelectionType();

    if (selectionType === "both")
        return (
            <span>
                from{" "}
                <span className="bg-amber-500 px-1 rounded-sm shadow-sm"> origin</span>{" "}
                to{" "}
                <span className="bg-fuchsia-500 px-1 rounded-sm shadow-sm">
                    destination
                </span>
            </span>
        );
    if (selectionType === "origin")
        return (
            <span>
                from{" "}
                <span className="bg-amber-500 px-1 rounded-sm shadow-sm"> origin</span>{" "}
            </span>
        );
    if (selectionType === "destination")
        return (
            <span>
                to{" "}
                <span className="bg-fuchsia-500 px-1 rounded-sm shadow-sm">
                    {" "}
                    destination
                </span>{" "}
            </span>
        );
    return null;
};
