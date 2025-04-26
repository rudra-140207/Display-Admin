import React, { useState } from "react";
import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      setSuccessMessage("Activity added successfully!");
      setShowToast(true);

   
      setName("");
      setYear("");
      setStartDate("");
      setEndDate("");
      setDescription("");

      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } catch (err) {
      setErrorMessage("Failed to add activity. Please try again.");
      setShowToast(true);

    
      setTimeout(() => {
        setShowToast(false);
      }, 4000);

      console.error("Failed to add activity", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-100 p-5">
      <h1 className="text-3xl font-bold mb-4">Add Activity</h1>

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md text-white ${
            successMessage ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {successMessage || errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Activity Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        {/* Dropdown for Year */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        >
          <option value="">Select Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Adding..." : "Add Activity"}
        </button>
      </form>
    </div>
  );
};

export default AddActivity;
