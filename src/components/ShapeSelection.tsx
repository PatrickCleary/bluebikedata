import React from "react";
import { ContactAndInfo } from "./ContactAndInfo";
import { ShareButton } from "./ShareButton";

export const ShapeSelection = () => {

  return (
    <div className="hidden md:flex flex-row rounded-md p-2 gap-2 bg-gray-800 shadow-sm border border-gray-700 w-full max-w-sm text-white pointer-events-auto">
      <ShareButton />
      <ContactAndInfo />
    </div>
  );
};
