import React from "react";
import NavBar from "./NavBar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <NavBar />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg min-h-[calc(100vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
