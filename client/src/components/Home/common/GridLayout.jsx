import React from "react";

const GridLayout = ({ children }) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {children}
    </div>
  );
};

export default GridLayout;
