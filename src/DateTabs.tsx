import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { SetStateAction } from "react";

export interface TabOptions {
  options: {
    [key: string]: string;
  };
  setDate: React.Dispatch<SetStateAction<string>>;
  defaultIndex: number;
}

export const DateTabs: React.FC<TabOptions> = ({
  options,
  setDate,
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
                        ? "bg-gray-100 text-gray-900"
                        : "bg-gray-900 text-gray-100",
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
