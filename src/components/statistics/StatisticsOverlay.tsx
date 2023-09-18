import React from "react";
import { useIsDoubleSelection } from "../../store/SelectionStore";
import { useStatisticStore } from "../../store/StatisticStore";

export const StatisticsOverlay = () => {
    const statistics = useStatisticStore((store) => store.statistics);
    const isDoubleSelection = useIsDoubleSelection();
    if (isDoubleSelection) {
        const pctOfOutbound = (
            (100 * statistics["dest"]) /
            statistics["out"]
        ).toPrecision(2);
        const pctOfTotal = (
            (100 * statistics["dest"]) /
            statistics["total"]
        ).toPrecision(2);
        return (
            <div className="text-white flex flex-col gap-2 px-4">
                <p className="flex flex-row items-baseline gap-2">
                    <span className="text-3xl font-mono">
                        {statistics["dest"]?.toLocaleString()}
                    </span>
                    <span>Trips</span>
                </p>
                <div className="flex flex-col gap-1">
                    <p> <span><span className="">{pctOfOutbound}</span>
                        <span className="text-sm">%</span></span>
                        <span className="text-sm"> of trips departing <span className="text-amber-500">origin</span></span>
                    </p>
                    <p> <span><span className="">{pctOfTotal}</span>
                        <span className="text-sm">%</span></span>
                        <span className="text-sm"> of total trips from <span className="text-amber-500">origin</span></span>
                    </p>
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
        <div className="text-white flex flex-col gap-2 px-4">
            <p className="flex flex-row items-baseline gap-2">
                <span className="text-3xl font-mono">
                    {statistics["total"]?.toLocaleString()}
                </span>
                <span>Total trips</span>
            </p>
            <p className="flex flex-row items-baseline gap-2 text-lg">
                <span className="text-xl font-mono text-sky-400">
                    {statistics["out"]?.toLocaleString()}
                </span>
                <span>(<span className="font-mono text-sky-400">{pctOfTotal}</span>
                    <span className="text-sm">%</span>)</span>
                <span className="text-sm">Departing region</span>
            </p>
            <p className="flex flex-row items-baseline gap-2 text-lg">
                <span className="text-xl font-mono text-amber-500">
                    {within?.toLocaleString()}
                </span>
                <span>(<span className="font-mono text-amber-500">{pctOfTotalWithin}</span>
                    <span className="text-sm">%</span>)</span>
                <span className="text-sm">Within region</span>
            </p>
        </div>
    );
};
