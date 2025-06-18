import React from "react";

const InputBox = ({ label, type, value, handler, name, placeholder }) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">{label}</label>
      <input
        type={type || "text"}
        value={value}
        onChange={handler}
        name={name}
        className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default InputBox;
