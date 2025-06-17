import React from "react";
import NavBar from "./NavBar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
};

export default MainLayout;
