import React from "react";
export const Loading = () => {
  return (
    <div className="fixed m-auto left-0 right-0 top-0 bottom-0 w-32 h-24 bg-black backdrop-blur-sm bg-opacity-50 rounded-lg gap-1 text-white items-center flex justify-center flex-col">
      <div className="rounded-full h-12 w-12 bg-gradient-to-r from-amber-500 to-sky-400 animate-spin bg-opacity-100 border border-black"></div>
      <p>Loading config.</p>
    </div>
  );
};
