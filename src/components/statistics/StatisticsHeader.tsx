import React from 'react';
import { useSelectionType } from '../../store/SelectionStore';

export const StatisticsHeader = () => {
    const selectionType = useSelectionType();

    if (selectionType === 'both')
        return <span>from <span className='text-amber-500'> origin</span> to <span className="text-fuchsia-500">destination</span></span>
    if (selectionType === 'origin')
        return <span>from <span className='text-amber-500'> origin</span> </span>
    if (selectionType === 'destination')
        return <span>to <span className='text-fuchsia-500'> destination</span> </span>
    return null;
}