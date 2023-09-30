import React from "react";

const Button = ({
  label = "",
  className = "",
  onClick = () => null,
  disabled = false,
}) => {
  return (
    <button
      className={` text-white 
       p-2 rounded ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
