import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const Home = () => {
  const [activities, setActivities] = useState({});
  const [selectedYear, setSelectedYear] = useState("");
  const [imageLinks, setImageLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  // const baseUrl = "http://localhost:5000";
  const baseUrl = "https://kiet-display-backend.onrender.com";

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/activities`);
        const categorized = res.data.reduce((acc, activity) => {
          if (!acc[activity.year]) acc[activity.year] = [];
          acc[activity.year].push(activity);
          return acc;
        }, {});
        setActivities(categorized);
      } catch (err) {
        console.error("Failed to fetch activities", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/images`);
        setImageLinks(res.data);
      } catch (err) {
        console.error("Failed to fetch images", err);
      }
    };

    fetchActivities();
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/activities/${id}`);
      setActivities((prevActivities) => {
        const updatedActivities = { ...prevActivities };
        Object.keys(updatedActivities).forEach((year) => {
          updatedActivities[year] = updatedActivities[year].filter(
            (activity) => activity._id !== id
          );
        });
        return updatedActivities;
      });
    } catch (err) {
      console.error("Failed to delete activity", err);
    }
  };

  return (
    <div className="min-h-screen bg-amber-100 p-5">
      <nav className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Activity Flow</h1>
        <div>
          <Link
            to="/add-activity"
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Add Activity
          </Link>
          <Link
            to="/add-image"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Image
          </Link>
        </div>
      </nav>

      <div className="mb-4">
        <label className="font-semibold">Select Year: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          {Object.keys(activities).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        Object.keys(activities)
          .filter((year) => !selectedYear || year === selectedYear)
          .map((year) => (
            <div key={year} className="mb-5">
              <h2 className="text-xl font-semibold">{year}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities[year].map((activity) => (
                  <div
                    key={activity._id}
                    className="bg-white p-4 shadow rounded relative"
                  >
                    <button
                      onClick={() => handleDelete(activity._id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                    <h3 className="text-lg font-semibold">{activity.name}</h3>
                    <p>
                      {new Date(activity.startDate).toLocaleDateString()} -{" "}
                      {new Date(activity.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Uploaded Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageLinks.map((img) => (
            <div
              key={img._id}
              className="cursor-pointer p-2 border rounded shadow bg-white"
              onClick={() => window.open(img.imageUrl, "_blank")}
            >
              <img
                src={img.imageUrl}
                alt={img.name}
                className="w-full h-32 object-cover rounded"
              />
              <p className="text-center mt-2 font-semibold">{img.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
