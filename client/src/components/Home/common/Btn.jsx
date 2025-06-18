import React from "react";
import clsx from "clsx";

const Btn = ({ type = "button", name, value, handler, icon, className }) => {
  return (
    <button
      type={type}
      value={value}
      onClick={handler}
      name={name}
      className={clsx(
        "size-8 rounded-full text-gray-600 hover:text-black hover:bg-gray-200 flex items-center justify-center transition-all duration-300",
        className
      )}
    >
      {icon}
    </button>
  );
};

export default Btn;
