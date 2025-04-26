import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

const Home = () => {
  const [activities, setActivities] = useState({});
  const [selectedYear, setSelectedYear] = useState("3");
  const [imageLinks, setImageLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const yearMapping = {
    1: "1st",
    2: "2nd",
    3: "3rd",
    4: "4th",
  };

  const showNotification = (message, isSuccess = true) => {
    if (isSuccess) setSuccessMessage(message);
    else setErrorMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activitiesRes, imagesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_baseUrl}/api/activities`),
          axios.get(`${import.meta.env.VITE_baseUrl}/api/images`),
        ]);

        const categorizedActivities = activitiesRes.data.reduce((acc, activity) => {
          if (!acc[activity.year]) acc[activity.year] = [];
          acc[activity.year].push(activity);
          return acc;
        }, {});

        setActivities(categorizedActivities);
        setImageLinks(imagesRes.data);
      } catch (error) {
        showNotification("Failed to fetch data", false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteActivity = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${import.meta.env.VITE_baseUrl}/api/activities/${id}`);
      setActivities((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((year) => {
          updated[year] = updated[year].filter((activity) => activity._id !== id);
        });
        return updated;
      });
      showNotification("Activity deleted successfully!");
    } catch (error) {
      showNotification("Failed to delete activity", false);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteImage = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${import.meta.env.VITE_baseUrl}/api/images/${id}`);
      setImageLinks((prev) => prev.filter((img) => img._id !== id));
      showNotification("Image deleted successfully!");
    } catch (error) {
      showNotification("Failed to delete image", false);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-white p-6">
      {/* Toast */}
      {showToast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white font-medium transition-all duration-300 ${
            successMessage ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {successMessage || errorMessage}
        </div>
      )}

      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Activity Dashboard</h1>
      </nav>

      {/* Year Filter */}
      <div className="mb-8">
        <label className="block mb-2 font-semibold text-gray-700">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-amber-300"
        >
          <option value="">All Years</option>
          {Object.keys(activities).map((year) => (
            <option key={year} value={year}>
              {yearMapping[year] || `${year}th`} Year
            </option>
          ))}
        </select>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <FaSpinner className="animate-spin text-4xl text-amber-500" />
        </div>
      ) : (
        <>
          {/* Activities Section */}
          {Object.keys(activities)
            .filter((year) => !selectedYear || year === selectedYear)
            .map((year) => (
              <div key={year} className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                  {yearMapping[year] || `${year}th`} Year Activities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities[year].map((activity) => (
                    <div
                      key={activity._id}
                      className="relative bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition"
                    >
                      <button
                        onClick={() => handleDeleteActivity(activity._id)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        disabled={deletingId === activity._id}
                      >
                        {deletingId === activity._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{activity.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(activity.startDate).toLocaleDateString()} -{" "}
                        {new Date(activity.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* Images Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Uploaded Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {imageLinks.map((img) => (
                <div
                  key={img._id}
                  className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.name}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(img._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1"
                    disabled={deletingId === img._id}
                  >
                    {deletingId === img._id ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrashAlt />
                    )}
                  </button>
                  <p className="p-2 text-center font-medium text-gray-700">{img.name}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
