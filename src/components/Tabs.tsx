import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { SetStateAction } from "react";

export interface TabsProps {
  options: {
    [key: string]: string;
  };
  setValue: React.Dispatch<SetStateAction<string>>;
  selectedIndex?: number;
  defaultIndex?: number;
}

export const Tabs: React.FC<TabsProps> = ({
  options,
  setValue: setDate,
  selectedIndex,
  defaultIndex,
}) => {
  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      defaultIndex={defaultIndex}
      onChange={(index) => {
        setDate(Object.keys(options)[index]);
      }}
    >
      <Tab.List className="bg-gray-600 gap-[1px] flex flex-row rounded-md overflow-hidden">
        {Object.entries(options).map(([option, name]) => {
          return (
            <Tab key={option} className="focus:outline-none w-full ">
              {({ selected }) => {
                return (
                  <div
                    className={classNames(
                      selected
                        ? "bg-gray-200 text-gray-900"
                        : "bg-gray-900 text-gray-200",
                      "px-2 md:px-4 py-2 md:py-1 whitespace-nowrap"
                    )}
                  >
                    {name}
                  </div>
                );
              }}
            </Tab>
          );
        })}
      </Tab.List>
    </Tab.Group>
  );
};
