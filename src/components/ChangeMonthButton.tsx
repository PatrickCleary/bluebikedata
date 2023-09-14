import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import { useConfigStore } from "../store/ConfigStore";

interface ChangeMonthButtonProps {
    amount: number;
    disabled?: boolean; // TODO: Don't set disbled "manually"
}
export const ChangeMonthButton: React.FC<ChangeMonthButtonProps> = ({
    amount,
    disabled,
}) => {
    const incrementMonth = useConfigStore((store) => store.incrementMonth);
    return (
        <button
            className={classNames(
                "bg-gray-700 px-2 h-full",
                disabled ? "text-gray-500 bg-gray-700" : "text-white hover:bg-gray-500 "
            )}
            onClick={() => incrementMonth(amount)}
            disabled={disabled}
        >
            <FontAwesomeIcon icon={amount > 0 ? faPlus : faMinus} />
        </button>
    );
};
