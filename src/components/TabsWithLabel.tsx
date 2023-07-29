import React, { SetStateAction } from "react";
import { Tabs } from "./Tabs";

export interface TabsWithLabelProps {
  label: string;
  options: {
    [key: string]: string;
  };
  setValue: React.Dispatch<SetStateAction<string>>;
  selectedIndex?: number;
}

export const TabsWithLabel: React.FC<TabsWithLabelProps> = ({
  label,
  options,
  setValue,
  selectedIndex,
}) => {
  return (
    <div className="flex flex-col ">
      <p className="text-gray-300 italic">{label}</p>
      <Tabs
        options={options}
        setValue={setValue}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};
