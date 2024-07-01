"use client";
import React, { useEffect } from "react";
import logo from "/public/logo.png";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
      className={`fixed inset-0 z-30 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out bg-blue-950 text-white w-64 p-4 flex flex-col justify-between lg:static lg:transform-none lg:translate-x-0`}
    >
      <div>
        <div className="flex justify-between items-center mb-4 lg:hidden">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">Logo</h2>
          </div>
          <button onClick={toggleSidebar} className="text-white">
            ✕
          </button>
        </div>
        <div className="flex items-center mb-4 lg:block hidden">
          <h2 className="text-2xl font-bold">Logo</h2>
        </div>
        <ul>
          <li
            className={`mb-2 ${
              pathname === "/" ? "bg-gray-700 rounded text-white font-bold" : ""
            }`}
          >
            <a href="/" className={`block py-2 px-4 rounded hover:bg-gray-700`}>
              Profile
            </a>
          </li>
        </ul>
      </div>
      <div>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            router.push("/login");
          }}
          className="w-full py-2 px-4 rounded bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
