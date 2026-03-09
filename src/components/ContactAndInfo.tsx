import { InfoModal } from "./InfoModal";

export const ContactAndInfo = () => (
  <InfoModal
    defaultOpen={false}
    renderTrigger={(open) => (
      <button
        className="w-full flex flex-row border rounded-sm hover:bg-gray-700 border-gray-700 justify-center text-neutral-100 py-1"
        onClick={open}
      >
        <p className="text-gray-100 text-sm">Info</p>
      </button>
    )}
  />
);
