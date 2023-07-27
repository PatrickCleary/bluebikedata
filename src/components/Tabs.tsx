import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { SetStateAction } from "react";

export interface TabOptions {
  options: {
    [key: string]: string;
  };
  setValue: React.Dispatch<SetStateAction<string>>;
  defaultIndex?: number;
}

export const Tabs: React.FC<TabOptions> = ({
  options,
  setValue: setDate,
  defaultIndex,
}) => {
  return (
    <Tab.Group
      defaultIndex={defaultIndex}
      onChange={(index) => {
        setDate(Object.keys(options)[index]);
      }}
    >
      <Tab.List>
        {Object.entries(options).map(([option, name]) => {
          return (
            <Tab key={option} className="focus:outline-none ">
              {({ selected }) => {
                return (
                  <div
                    className={classNames(
                      selected
                        ? "bg-gray-200 text-gray-800"
                        : "bg-gray-800 text-gray-200",
                      "px-4 py-1 "
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
