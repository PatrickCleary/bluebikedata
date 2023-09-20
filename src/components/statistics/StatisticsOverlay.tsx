import classNames from "classnames";
import React from "react";
import { useSelectionType } from "../../store/SelectionStore";
import { useStatisticStore } from "../../store/StatisticStore";

export const StatisticsOverlay = () => {
    const statistics = useStatisticStore((store) => store.statistics);
    const selectionType = useSelectionType();
    const isDoubleSelection = selectionType === "both";
    if (selectionType === "none") return null;
    if (isDoubleSelection) {
        const pctOfOutbound = (
            (100 * statistics["dest"]) /
            statistics["out"]
        ).toPrecision(2);
        return (
            <div className="text-white flex flex-col md:gap-2 px-4 w-full">
                <p className="flex flex-row items-baseline gap-2 justify-center md:justify-start">
                    <span className="text-2xl md:text-3xl font-numbers">
                        {statistics["dest"]?.toLocaleString()}
                    </span>
                    <span>Trips</span>
                </p>
                <div className="flex flex-col gap-1 justify-center md:justify-start">
                    <p className="text-center md:text-start">
                        <span>
                            <span className="">{pctOfOutbound}</span>
                            <span className="text-sm">%</span>
                        </span>
                        <span className="text-sm">
                            {" "}
                            of trips departing <span className="text-amber-500">origin</span>
                        </span>
                    </p>

                    {/* <p> <span><span className="">{pctOfTotal}</span>
                        <span className="text-sm">%</span></span>
                        <span className="text-sm"> of total trips from <span className="text-amber-500">origin</span></span>
                    </p> */}
                </div>
            </div>
        );
    }
    const pctOfTotal = (
        (100 * statistics["out"]) /
        statistics["total"]
    ).toPrecision(2);
    const within = statistics["total"] - statistics["out"];
    const pctOfTotalWithin = ((100 * within) / statistics["total"]).toPrecision(
        2
    );
    return (
        <div className="text-white flex flex-col gap-1 md:gap-2 px-4 w-full">
            <p className="flex flex-row items-baseline gap-2 justify-center md:justify-start">
                <span className="text-2xl md:text-3xl font-numbers">
                    {statistics["total"]?.toLocaleString()}
                </span>
                <span>Total trips</span>
            </p>
            <span className="flex flex-row md:flex-col justify-between w-full">
                <p className="flex items-baseline md:gap-2 md:text-lg  flex-col md:flex-row">
                    <span>
                        <span className="text-lg md:text-xl font-numbers text-sky-400">
                            {statistics["out"]?.toLocaleString()}
                        </span>{" "}
                        <span>
                            ({pctOfTotal}
                            <span className="text-sm">%</span>)
                        </span>
                    </span>
                    {" "}
                    <span className="text-sm">
                        {selectionType === "origin"
                            ? "Departing region"
                            : "from out of region"}
                    </span>
                </p>

                <p className="flex flex-col md:flex-row items-baseline md:gap-2 md:text-lg">
                    <span><span
                        className={classNames(
                            "text-lg md:text-xl font-numbers",
                            selectionType === "origin" ? "text-amber-500" : "text-fuchsia-400"
                        )}
                    >
                        {within?.toLocaleString()}
                    </span>
                        {" "}
                        <span>
                            ({pctOfTotalWithin}
                            <span className="text-sm">%</span>)
                        </span></span>
                    <span className="text-sm">{"Within region"}</span>
                </p></span>
        </div>
    );
};
