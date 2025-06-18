import React from "react";
import clsx from "clsx";

const EmptyBox = ({ Icon, text, className }) => {
  return (
    <div
      className={clsx(
        "w-max mx-auto mt-36 flex flex-col gap-y-5 justify-center items-center",
        className
      )}
    >
      <Icon className="text-[#e5e5e5]" size={110} />
      <p className="sm:text-xl text-gray-600">{text}</p>
    </div>
  );
};

export default EmptyBox;
