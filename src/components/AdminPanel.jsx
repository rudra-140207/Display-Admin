import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";

const AdminPanel = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = "https://kiet-display-backend.onrender.com";

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/activities`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensure CORS issues are handled properly
        });
        setActivities(res.data);
      } catch (err) {
        setError("Failed to fetch activities");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${baseUrl}/api/activities`,
        { name, startDate, endDate, description },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setActivities([...activities, res.data]);
      setName("");
      setStartDate("");
      setEndDate("");
      setDescription("");
    } catch (err) {
      setError("Failed to add activity");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${baseUrl}/api/activities/${id}`, {
        withCredentials: true,
      });
      setActivities(activities.filter((activity) => activity._id !== id));
    } catch (err) {
      setError("Failed to delete activity");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-100">
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-4">
          <div className="mb-2">
            <label className="block text-gray-700">Activity Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
            {loading ? "Adding..." : "Add Activity"}
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-4">All Activities</h2>
        {loading ? <p>Loading...</p> : null}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="w-3/4 bg-zinc-300 p-4 rounded shadow relative"
            >
              <button
                onClick={() => handleDelete(activity._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                disabled={loading}
              >
                <FaTrashAlt />
              </button>
              <h3 className="text-xl font-semibold">{activity.name}</h3>
              <p>
                {new Date(activity.startDate).toLocaleDateString()} - {" "}
                {new Date(activity.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-2">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;