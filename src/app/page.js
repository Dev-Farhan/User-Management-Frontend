"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./comppnents/Sidebar";
import Topbar from "./comppnents/Topbar";
import UserProfile from "./comppnents/UserProfile";
import { Box } from "@mui/material";
import { HashLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!isLoading) {
      const token = localStorage.getItem("authToken");

      if (!token) {
        router.push("/login");
      }
    }
  }, [isLoading, router]);
  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
          }}
        >
          <HashLoader color="#2978e6" />
        </Box>
      ) : (
        <div className="flex h-screen">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1">
            <Topbar toggleSidebar={toggleSidebar} />
            <UserProfile />
          </div>
        </div>
      )}
    </>
  );
}
