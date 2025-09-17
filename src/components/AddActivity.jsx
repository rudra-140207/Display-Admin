import React, { useState } from "react";
import axios from "axios";
import {
  Plus,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  RotateCcw,
  Save
} from "lucide-react";

const AddActivity = () => {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const yearOptions = [
    { value: "1", label: "1st Year", description: "First Year Students", color: "blue" },
    { value: "2", label: "2nd Year", description: "Second Year Students", color: "green" },
    { value: "3", label: "3rd Year", description: "Third Year Students", color: "purple" },
    { value: "4", label: "4th Year", description: "Fourth Year Students", color: "orange" },
  ];

  const validateDates = () => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) <= new Date(endDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDates()) {
      showToastMessage("End date must be after or equal to start date", "error");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowToast(false);

    try {
      await axios.post(`${import.meta.env.VITE_baseUrl}/api/activities`, {
        name,
        year,
        startDate,
        endDate,
        description,
      });

      showToastMessage("Activity added successfully!", "success");

      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (err) {
      showToastMessage("Failed to add activity. Please try again.", "error");
      console.error("Failed to add activity", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setYear("");
    setStartDate("");
    setEndDate("");
    setDescription("");
  };

  const showToastMessage = (message, type) => {
    if (type === "error") {
      setErrorMessage(message);
      setSuccessMessage("");
    } else {
      setSuccessMessage(message);
      setErrorMessage("");
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const getFormProgress = () => {
    const fields = [name, year, startDate, endDate, description];
    const filledFields = fields.filter(field => field.trim() !== "").length;
    return (filledFields / fields.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 lg:p-8">
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
            className="ml-2 hover:bg-white/20 rounded-full p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Plus className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Add Activity</h1>
          </div>
          <p className="text-gray-600 text-lg">Create and schedule new academic activities</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-lg flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Activity Details</span>
                </h2>
                {/* Progress Bar */}
                <div className="flex items-center space-x-2">
                  <span className="text-white/80 text-sm">Progress:</span>
                  <div className="w-20 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getFormProgress()}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm font-medium">{Math.round(getFormProgress())}%</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
              {/* Activity Name */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                  <FileText className="text-blue-600" size={20} />
                  <span>Activity Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter activity name (e.g., Tech Fest 2025)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                  required
                  disabled={loading}
                />
              </div>

              {/* Year Selection */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                  <Users className="text-blue-600" size={20} />
                  <span>Target Year</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {yearOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                        year === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50 shadow-md`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="year"
                        value={option.value}
                        checked={year === option.value}
                        onChange={(e) => setYear(e.target.value)}
                        className="sr-only"
                        disabled={loading}
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${year === option.value ? `text-${option.color}-700` : "text-gray-700"}`}>
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        year === option.value 
                          ? `border-${option.color}-500 bg-${option.color}-500` 
                          : "border-gray-300"
                      }`}>
                        {year === option.value && <CheckCircle2 className="text-white" size={12} />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                    <Calendar className="text-blue-600" size={20} />
                    <span>Start Date</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                    <Clock className="text-blue-600" size={20} />
                    <span>End Date</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                    disabled={loading}
                    min={startDate}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                  <FileText className="text-blue-600" size={20} />
                  <span>Description</span>
                </label>
                <textarea
                  placeholder="Describe the activity, its objectives, and key details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                  required
                  disabled={loading}
                />
                <div className="text-right text-sm text-gray-500">
                  {description.length}/500 characters
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || !validateDates()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>Adding Activity...</span>
                    </>
                  ) : (
                    <>
                      <Save size={24} />
                      <span>Add Activity</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <RotateCcw size={20} />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </div>

          {/* Preview/Info Section */}
          <div className="space-y-6">
            {/* Activity Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FileText className="text-blue-600" size={20} />
                <span>Activity Preview</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <p className="text-gray-800">{name || "Activity name will appear here"}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Year:</span>
                  <p className="text-gray-800">
                    {year ? yearOptions.find(opt => opt.value === year)?.label : "Select a year"}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Duration:</span>
                  <p className="text-gray-800">
                    {startDate && endDate 
                      ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                      : "Select dates"
                    }
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Description:</span>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {description || "Activity description will appear here"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">💡 Tips for Success</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Use descriptive activity names</li>
                <li>• Set realistic date ranges</li>
                <li>• Include clear objectives in description</li>
                <li>• Double-check all details before submitting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddActivity;
