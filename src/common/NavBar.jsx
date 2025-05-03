import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png'; 

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-500 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo and Brand Name */}
        <div className="flex items-center bg-amber-50 space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-40" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <NavLink to="/" className="text-sm md:text-lg hover:underline">Home</NavLink>
          <NavLink to="/add-activity" className="text-sm md:text-lg hover:underline">Add Activity</NavLink>
          <NavLink to="/upload-pdf" className="text-sm md:text-lg hover:underline">Upload PDF</NavLink>
          <NavLink to="/add-image" className="text-sm md:text-lg hover:underline">Add Image</NavLink>
          <NavLink to="/notification" className="text-sm md:text-lg hover:underline">Notification</NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <NavLink to="/" onClick={toggleMenu} className="block text-sm hover:underline">Home</NavLink>
          <NavLink to="/add-activity" onClick={toggleMenu} className="block text-sm hover:underline">Add Activity</NavLink>
          <NavLink to="/upload-pdf" onClick={toggleMenu} className="block text-sm hover:underline">Upload PDF</NavLink>
          <NavLink to="/add-image" onClick={toggleMenu} className="block text-sm hover:underline">Add Image</NavLink>
          <NavLink to="/notification" onClick={toggleMenu} className="block text-sm hover:underline">Notification</NavLink>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
