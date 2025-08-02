import React, { useEffect } from "react";
import Navbar from "../../components/hotelOwner/Navbar";
import Sidebar from "../../components/hotelOwner/Sidebar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { isowner, navigate } = useAppContext();

  useEffect(() => {
    if (!isowner) {
      navigate("/");
    }
  }, [isowner]);

  return (
    <div>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex h-full">
          <Sidebar />
          <div className="flex-1 p-4 pt-10 px-10 h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
