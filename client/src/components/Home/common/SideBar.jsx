import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { FaRegLightbulb } from "react-icons/fa";
import { BiArchiveIn } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNotes } from "../../../context/noteContext";

const data = [
  { title: "Notes", Icon: FaRegLightbulb, hash: "#home" },
  { title: "Archive", Icon: BiArchiveIn, hash: "#archive" },
  { title: "Bin", Icon: RiDeleteBin6Line, hash: "#trash" },
];

const SideBar = () => {
  const { isOpenSideBar, setIsOpenSideBar } = useNotes();
  const [isActive, setIsActive] = useState(window.location.hash || "#home");

  // Update active state when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setIsActive(window.location.hash || "#home");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsOpenSideBar(true)}
      onMouseLeave={() => setIsOpenSideBar(false)}
      className={clsx(
        "py-3.5 bg-white h-screen fixed left-0 top-16",
        isOpenSideBar && "shadow-2xl z-10"
      )}
    >
      <ul>
        {data.map(({ Icon, title, hash }) => (
          <a
            href={hash}
            key={hash}
            className={clsx(
              "w-full font-medium flex items-center text-sm",
              isActive === hash ? "bg-[#feefc3]" : "bg-white hover:bg-gray-100",
              isOpenSideBar
                ? "pl-7 pr-32 py-3 rounded-r-full gap-x-6"
                : "w-11 h-12 items-center justify-center rounded-full mx-4"
            )}
          >
            <Icon
              size={20}
              className={clsx(isActive !== hash && "text-gray-600")}
            />
            <span className={clsx(isOpenSideBar ? "block" : "hidden")}>
              {title}
            </span>
          </a>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
