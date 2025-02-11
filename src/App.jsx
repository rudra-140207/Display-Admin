import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import Home from "./components/Home";
import AddActivity from "./components/AddActivity";
import AddImage from "./components/AddImage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-500 p-4 text-white flex justify-around">
          <NavLink to="/" className="text-lg">Home</NavLink>
          <NavLink to="/add-activity" className="text-lg">Add Activity</NavLink>
          <NavLink to="/add-image" className="text-lg">Add Image</NavLink>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-activity" element={<AddActivity />} />
            <Route path="/add-image" element={<AddImage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
