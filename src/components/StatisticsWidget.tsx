import React from 'react';
import { useStatisticStore } from "../store/StatisticStore"

export const StatisticsWidget = () => {
    const statistics = useStatisticStore((store) => store.statistics)
    if (statistics['dest']) {
        const pctOfOutbound = (100 * statistics['dest'] / statistics['out']).toPrecision(2)
        const pctOfTotal = (100 * statistics['dest'] / statistics['total']).toPrecision(2)
        return (<div className="text-white">
            <br />
            <p>{statistics['dest']}</p>
            <p>{pctOfOutbound}% of outbound</p>
            <p>{pctOfTotal}% of total</p>
        </div>)
    }
    const pctOfTotal = (100 * statistics['out'] / statistics['total']).toPrecision(2)
    return (<div className="text-white items-end h-full flex-row">
        <br />
        <p>{statistics['out']}</p>
        <p>{pctOfTotal}% of total</p>
    </div>)
}