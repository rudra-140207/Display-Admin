import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  ChevronDown, 
  LogIn,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import logo from "../assets/logo.png";
import axios from "axios";

const Login = () => {
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const wakeUpBackend = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_baseUrl}/wakeup`);
      console.log(response.data);
    } catch (error) {
      console.log("Backend wake-up failed:", error);
    }
  };

  useEffect(() => {
    wakeUpBackend();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userType || !password) {
      setErrorMessage("Please fill in all fields");
      setSuccessMessage("");
      triggerToast();
      setIsLoading(false);
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
    setIsLoading(false);
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const userTypeOptions = [
    { 
      value: "faculty", 
      label: "Faculty", 
      description: "Teaching Staff Access",
      icon: "👨‍🏫",
      color: "blue"
    },
    { 
      value: "hod", 
      label: "HOD", 
      description: "Department Head Access",
      icon: "👨‍💼",
      color: "purple"
    },
    { 
      value: "developer", 
      label: "Developer", 
      description: "System Administrator",
      icon: "👨‍💻",
      color: "green"
    },
  ];

  const selectedOption = userTypeOptions.find(option => option.value === userType);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl text-white font-medium transition-all duration-300 z-50 flex items-center space-x-3 ${
            successMessage 
              ? "bg-gradient-to-r from-green-500 to-green-600" 
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}
        >
          {successMessage ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{successMessage || errorMessage}</span>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl shadow-lg">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <User className="inline w-4 h-4 mr-2" />
              User Type
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between ${
                  userType 
                    ? "border-blue-500 focus:ring-blue-200 bg-blue-50" 
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {selectedOption ? (
                    <>
                      <span className="text-lg">{selectedOption.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{selectedOption.label}</div>
                        <div className="text-xs text-gray-500">{selectedOption.description}</div>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500">Select user type</span>
                  )}
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                  {userTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setUserType(option.value);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 ${
                        userType === option.value ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                      {userType === option.value && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              <Lock className="inline w-4 h-4 mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !userType || !password}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} KIET | All rights reserved
          </p>
        </div>

        {/* Quick Access Hint */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            💡 <strong>Quick Tip:</strong> Select your role and enter your credentials to access the dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
