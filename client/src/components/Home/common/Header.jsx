import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import clsx from "clsx";
import { FiMenu } from "react-icons/fi";
import { MdSettings } from "react-icons/md";
import { useNotes } from "../../../context/noteContext";
import { useUser } from "../../../context/userContext";

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { setToken } = useUser();
  const { hash, setIsOpenSideBar, isOpenSideBar, loggedInUser } = useNotes();

  const renderMenuText = () => {
    switch (hash) {
      case "#home":
        return "Keep";
      case "#archive":
        return "Archive";
      case "#trash":
        return "Bin";
      default:
        return "Keep";
    }
  };

  const handleSignOut = () => {
    Cookies.remove("authToken");
    setToken(null);
    window.location.href = "/login"; // Redirect to login page after logout
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="px-4 py-2 border-b-2 flex items-center justify-between fixed top-0 left-0 w-full z-10 bg-white">
      <div className="flex items-center gap-x-1 text-gray-700">
        <button
          onClick={() => setIsOpenSideBar(!isOpenSideBar)}
          className="size-11 rounded-full hover:bg-gray-100 flex justify-center items-center"
        >
          <FiMenu size={21} />
        </button>
        <a
          href={hash === "" || hash === "#" || hash === "#home" ? hash : null}
          className="flex items-center gap-x-2"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/2x/keep_2020q4_48dp.png"
            alt="Logo"
            className={clsx(
              "size-10",
              hash === "" || hash === "#" || hash === "#home"
                ? "block"
                : "hidden"
            )}
          />
          <h4 className="text-xl">{renderMenuText()}</h4>
        </a>
      </div>

      {/* Dropdown Menu */}
      <div
        className="flex items-center justify-center relative"
        ref={dropdownRef}
      >
        <MdSettings
          size={18}
          onClick={() => setOpenDropdown(!openDropdown)}
          data-dropdown-placement="bottom"
          className="cursor-pointer"
        />
        {openDropdown && (
          <div className="absolute top-6 right-2 z-50 my-4 text-base list-none bg-blue-50 divide-y divide-gray-300 rounded-lg shadow-md w-max">
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">
                {loggedInUser?.name}
              </span>
              <span className="block text-sm  text-gray-500 truncate">
                {loggedInUser?.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="block px-4 py-2 text-sm text-gray-900 hover:bg-blue-200 w-full text-left"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
