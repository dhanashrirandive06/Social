import React from "react";

const Input = ({
  name = "",
  label = "",
  type = "text",
  placeholder = "",
  value = "",
  onChange = () => null,
  isRequired = false,
  className = "",
}) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label
          className="block text-gray-700 text-sm font-medium mb-2"
          htmlFor={name}
        >
          {label}
        </label>
      )}

      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
        leading-tight focus:outline-none focus:shadow-outline ${className}`}
        id={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={isRequired}
      />
    </div>
  );
};

export default Input;
