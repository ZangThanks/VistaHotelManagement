import React, { useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface FloatingInputProps {
  label: string;
  id?: string;
  type?: string;
  value?: string; // nếu truyền => controlled
  defaultValue?: string; // nếu không truyền value => uncontrolled
  onChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  borderColor?: string;
  focusBorderColor?: string;
  labelColor?: string;
  focusLabelColor?: string;
  iconLeft?: IconDefinition;
  disabled?: boolean;
  className?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  id,
  type = "text",
  value, // ← không default = "" nữa
  defaultValue = "",
  onChange,
  size = "md",
  borderColor = "border-gray-300",
  focusBorderColor = "focus:border-blue-600",
  labelColor = "text-gray-500",
  focusLabelColor = "text-blue-600",
  iconLeft,
  disabled = false,
  className = "",
}) => {
  const autoId = useId();
  const inputId = id ?? `fi-${autoId}`;

  // Uncontrolled internal state
  const [innerValue, setInnerValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value! : innerValue;

  const [focused, setFocused] = useState(false);
  const active = focused || currentValue.length > 0;

  const sizePad = size === "sm" ? "py-1.5" : size === "lg" ? "py-3" : "py-2";
  const leftPadding = iconLeft ? "pl-7" : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!isControlled) setInnerValue(v);
    onChange?.(v);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={inputId}
        type={type}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`peer w-full bg-transparent border-0 border-b ${borderColor} ${focusBorderColor}
                    outline-none transition-colors duration-200 ${sizePad} ${leftPadding}
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        aria-labelledby={`${inputId}-label`}
        autoComplete="off"
        spellCheck={false}
      />

      {iconLeft && (
        <FontAwesomeIcon
          icon={iconLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}

      <label
        id={`${inputId}-label`}
        htmlFor={inputId}
        className={`absolute ${iconLeft ? "left-7" : "left-0"} cursor-text
                    transform transition-all duration-200
                    ${
                      active
                        ? "-top-3 text-xs " + focusLabelColor
                        : "top-1/2 -translate-y-1/2 " + labelColor
                    }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
