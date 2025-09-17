import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  Calendar,
  Image as ImageIcon,
  Activity,
  Users,
  Filter,
  Search,
  Grid,
  List,
  Eye,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Download,
  Share2,
  MoreVertical
} from "lucide-react";

const Home = () => {
  const [activities, setActivities] = useState({});
  const [selectedYear, setSelectedYear] = useState("");
  const [imageLinks, setImageLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedImage, setSelectedImage] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const yearMapping = {
    1: "1st",
    2: "2nd", 
    3: "3rd",
    4: "4th",
  };

  const showNotification = (message, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(message);
      setErrorMessage("");
    } else {
      setErrorMessage(message);
      setSuccessMessage("");
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
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
        setStatsLoading(false);
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

  const filteredActivities = Object.keys(activities)
    .filter((year) => !selectedYear || year === selectedYear)
    .reduce((acc, year) => {
      const filtered = activities[year].filter((activity) =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) acc[year] = filtered;
      return acc;
    }, {});

  const filteredImages = imageLinks.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalActivities = Object.values(activities).flat().length;
  const totalImages = imageLinks.length;

  const getActivityStats = () => {
    const stats = Object.keys(activities).map((year) => ({
      year: yearMapping[year] || `${year}th`,
      count: activities[year].length,
      color: ["blue", "green", "purple", "orange"][year - 1] || "gray"
    }));
    return stats;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">{selectedImage.name}</h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.name}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <div className="p-4 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <Activity className="text-white" size={40} />
              </div>
              <span>Activity Dashboard</span>
            </h1>
            <p className="text-gray-600 text-lg">Manage and monitor all academic activities</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Activity className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {statsLoading ? <Loader2 className="animate-spin" size={20} /> : totalActivities}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <ImageIcon className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Images</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {statsLoading ? <Loader2 className="animate-spin" size={20} /> : totalImages}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Users className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Years</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {statsLoading ? <Loader2 className="animate-spin" size={20} /> : Object.keys(activities).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search activities or images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 w-full sm:w-80"
                />
              </div>

              {/* Year Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white appearance-none cursor-pointer"
                >
                  <option value="">All Years</option>
                  {Object.keys(activities).map((year) => (
                    <option key={year} value={year}>
                      {yearMapping[year] || `${year}th`} Year
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-lg">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-600 text-lg">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Activities Section */}
            <div className="mb-12">
              {Object.keys(filteredActivities).length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Activity className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Activities Found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                Object.keys(filteredActivities).map((year) => (
                  <div key={year} className="mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`bg-gradient-to-r ${
                        year === "1" ? "from-blue-500 to-blue-600" :
                        year === "2" ? "from-green-500 to-green-600" :
                        year === "3" ? "from-purple-500 to-purple-600" :
                        "from-orange-500 to-orange-600"
                      } p-3 rounded-xl shadow-lg`}>
                        <Users className="text-white" size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {yearMapping[year] || `${year}th`} Year Activities
                        </h2>
                        <p className="text-gray-600">{filteredActivities[year].length} activities found</p>
                      </div>
                    </div>

                    <div className={viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                    }>
                      {filteredActivities[year].map((activity) => (
                        <div
                          key={activity._id}
                          className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group ${
                            viewMode === "list" ? "flex items-center p-6" : "p-6"
                          }`}
                        >
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteActivity(activity._id)}
                            className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                            disabled={deletingId === activity._id}
                          >
                            {deletingId === activity._id ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>

                          <div className={viewMode === "list" ? "flex-1" : ""}>
                            <div className="flex items-start space-x-3 mb-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Calendar className="text-blue-600" size={20} />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 mb-1 pr-8">
                                  {activity.name}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                  <div className="flex items-center space-x-1">
                                    <Clock size={14} />
                                    <span>
                                      {new Date(activity.startDate).toLocaleDateString()} - {" "}
                                      {new Date(activity.endDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Images Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                  <ImageIcon className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Image Gallery</h2>
                  <p className="text-gray-600">{filteredImages.length} images found</p>
                </div>
              </div>

              {filteredImages.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <ImageIcon className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Images Found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredImages.map((img) => (
                    <div
                      key={img._id}
                      className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={img.imageUrl}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                          <button
                            onClick={() => setSelectedImage(img)}
                            className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(img._id)}
                            className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full transition-colors"
                            disabled={deletingId === img._id}
                          >
                            {deletingId === img._id ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-700 text-center truncate">
                          {img.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
