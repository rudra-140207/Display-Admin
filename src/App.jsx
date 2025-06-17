import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AddActivity from "./components/AddActivity";
import AddImage from "./components/AddImage";
import Notification from "./components/Notification";
import AcControl from "./components/AcControl";
import UploadPdf from "./components/UploadPdf";
import Login from "./components/Login";
import MainLayout from "./common/MainLayout";
import PrivateRoute from "./common/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Private routes inside PrivateRoute */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-activity"
          element={
            <PrivateRoute>
              <MainLayout>
                <AddActivity />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/upload-pdf"
          element={
            <PrivateRoute>
              <MainLayout>
                <UploadPdf />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-image"
          element={
            <PrivateRoute>
              <MainLayout>
                <AddImage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <PrivateRoute>
              <MainLayout>
                <Notification />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ac-control"
          element={
            <PrivateRoute>
              <MainLayout>
                <AcControl />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
