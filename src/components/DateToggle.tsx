import classNames from "classnames";
import React from "react";
import { useConfigStore } from "../store/ConfigStore";

export const DateToggle: React.FC = () => {
  const configStore = useConfigStore((store) => store);
  return (
    <div className="flex flex-col gap-2 w-full text-sm">
      <div className="flex flex-row items-center justify-center md:justify-start w-full bg-gray-500 gap-[1px] rounded-md overflow-hidden border border-gray-500">

        <div
          onClick={() => configStore.setDate("2022")}
          className={classNames(configStore.date === '2022' ? 'bg-gray-500 ' : 'bg-gray-700', "cursor-pointer w-full items-center justify-center flex ")}
        >
          <p>
            {"June 2022"}
          </p>
        </div>
        <div
          onClick={() => configStore.setDate("2023")}
          className={classNames(configStore.date === '2023' ? 'bg-gray-500 ' : 'bg-gray-700', "cursor-pointer w-full items-center justify-center flex ")}
        >
          <p
          >
            {"June 2023"}
          </p></div>
      </div>
    </div>
  );
};
