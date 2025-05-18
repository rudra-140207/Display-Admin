import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import Home from "./components/Home";
import AddActivity from "./components/AddActivity";
import AddImage from "./components/AddImage";
import Notification from "./components/Notification";
import AcControl from "./components/AcControl";
import UploadPdf from "./components/UploadPdf";
import NavBar from "./common/NavBar";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-activity" element={<AddActivity />} />
            <Route path="/upload-pdf" element={<UploadPdf />} />
            <Route path="/add-image" element={<AddImage />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/ac-control" element={<AcControl />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
