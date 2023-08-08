import { Switch } from "@headlessui/react";
import React, { useState } from "react";
import { useBreakpoint } from "../helpers/breakpoints";
import { useConfigStore } from "../store/ConfigStore";

export const DateToggle: React.FC = () => {
  const configStore = useConfigStore((store) => store);
  const isMobile = !useBreakpoint("md");
  const enabled = configStore.date === "2023";
  return (
    <div className="flex flex-col gap-2 w-full text-sm">
      <h1 className=" text-sm text-center italic w-full">Date</h1>
      <div className="flex flex-row items-center justify-center md:justify-start gap-1 md:gap-3">
        <p
          className="cursor-pointer  text-center"
          onClick={() => configStore.setDate("2022")}
        >
          {isMobile ? "June '22" : "June 2022"}
        </p>
        <Switch
          checked={!enabled}
          onChange={(value) => {
            configStore.setDate(value ? "2022" : "2023");
          }}
          className={`${
            enabled ? "bg-gray-200" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-black transition`}
          />
        </Switch>
        <p
          className="cursor-pointer"
          onClick={() => configStore.setDate("2023")}
        >
          {isMobile ? "June '23" : "June 2023"}
        </p>
      </div>
    </div>
  );
};
