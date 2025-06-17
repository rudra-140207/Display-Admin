import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import axios from "axios";
import { useEffect } from "react";

const Login = () => {
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const wakeUpBackend = async ()=>{
    const response = await axios.get(`${import.meta.env.VITE_baseUrl}/wakeup`)
    console.log(response.data)
  }

  useEffect(() => {
    wakeUpBackend()
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userType || !password) {
      setErrorMessage("Please fill in all fields");
      setSuccessMessage("");
      triggerToast();
      return;
    }

    const demoToken =
      import.meta.env.VITE_Demo_Token +
      Math.random().toString(36).substring(2, 15);

    if (
      (userType === "faculty" || userType === "hod") &&
      password === import.meta.env.VITE_Hod_Pass
    ) {
      localStorage.setItem("token", demoToken);
      setSuccessMessage("Login successful!");
      setErrorMessage("");
      triggerToast();
      setTimeout(() => navigate("/"), 1000);
    } else if (
      userType === "developer" &&
      password === import.meta.env.VITE_Dev_Pass
    ) {
      localStorage.setItem("token", demoToken);
      setSuccessMessage("Welcome Developer!");
      setErrorMessage("");
      triggerToast();
      setTimeout(() => navigate("/"), 1000);
    } else {
      setErrorMessage("Invalid credentials");
      setSuccessMessage("");
      triggerToast();
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-purple-300 p-4 relative">
      {/* Toast */}
      {showToast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white transition-opacity duration-300 ${
            successMessage ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {successMessage || errorMessage}
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
        {/* Logo Placeholder */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-16 w-auto mb-4" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-700">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Select User Type
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select user type</option>
              <option value="faculty">Faculty</option>
              <option value="hod">HOD</option>
              <option value="developer">Developer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 pt-2">
          &copy; {new Date().getFullYear()} KIET | All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
