import * as React from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled,
}) => {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition border-2 ${
        checked
          ? "bg-green-500 border-green-600 shadow-md"
          : "bg-gray-300 border-gray-400"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition shadow ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};
