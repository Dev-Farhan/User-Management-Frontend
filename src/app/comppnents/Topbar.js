import React from "react";
import logo from "/public/logo.png";
import Image from "next/image";

const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center w-full">
      <button onClick={toggleSidebar} className="lg:hidden text-gray-700">
        ☰
      </button>
    </div>
  );
};

export default Topbar;
