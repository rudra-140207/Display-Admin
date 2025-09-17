import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Home, Plus, Upload, Image, Bell, Zap, LogOut } from "lucide-react";
import logo from "../assets/logo.png";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/add-activity", label: "Add Activity", icon: Plus },
    { to: "/upload-pdf", label: "Upload PDF", icon: Upload },
    { to: "/add-image", label: "Add Image", icon: Image },
    { to: "/notification", label: "Notification", icon: Bell },
    { to: "/ac-control", label: "AC Control", icon: Zap },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <img src={logo} alt="Logo" className="h-8 w-32 object-contain" />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                    isActive ? "bg-white/25 shadow-md" : ""
                  }`
                }
              >
                <Icon size={18} />
                <span className="hidden xl:block">{label}</span>
              </NavLink>
            ))}
            
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
              className="flex items-center space-x-2 px-4 py-2 ml-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <LogOut size={18} />
              <span className="hidden xl:block">Logout</span>
            </button>
          </div>

          <button 
            onClick={toggleMenu} 
            className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-black/20 backdrop-blur-sm rounded-lg mt-2 mb-4 shadow-xl">
            <div className="p-4 space-y-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={toggleMenu}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/20 ${
                      isActive ? "bg-white/25 shadow-md" : ""
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              ))}
              
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 mt-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
