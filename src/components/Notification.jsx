import { useState } from "react";
import axios from "axios";
import {
  Send,
  Upload,
  Image as ImageIcon,
  Video,
  User,
  Users,
  MessageSquare,
  CheckCircle2,
  X,
  Loader2,
  FileText,
  Trash2,
  ChevronDown,
  Plus,
  Minus,
  Clock,
  History,
  Cloud,
} from "lucide-react";
import Toast from "./Toast";
import useToast from "../hooks/useToast";

const Notification = () => {
  const [sender, setSender] = useState("HOD");
  const [receiver, setReceiver] = useState([]);
  const [message, setMessage] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoUploading, setVideoUploading] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [imageTitle, setImageTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);
  const [showRecentMessages, setShowRecentMessages] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [cloudAssets, setCloudAssets] = useState([]);
  const [showCloudAssets, setShowCloudAssets] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [deletingAssetId, setDeletingAssetId] = useState(null);
  const [recipientDropdownOpen, setRecipientDropdownOpen] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  const receiverOptions = [
    {value: "d-046", label: "D-046"},
    {value: "d-047", label: "D-047"},
    {value: "d-048", label: "D-048"},
    {value: "d-116", label: "D-116"},
    {value: "d-117", label: "D-117"},
    {value: "d-118", label: "D-118"},
    {value: "c-219", label: "C-219"},
    {value: "c-112", label: "Dean Office"},
  ];

  // Function to build Cloudinary URL from public_id
  const buildCloudinaryUrl = (publicId, resourceType = 'image') => {
    if (!publicId) return null;
    return publicId;
  };

  const fetchRecentMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_baseUrl}/api/notification/recent/${sender}`);
      setRecentMessages(response.data.messages);
    } catch (error) {
      showToast('Failed to fetch recent messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchCloudAssets = async () => {
    setLoadingAssets(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_baseUrl}/api/notification/assets/${sender}`);
      console.log(response.data);
      setCloudAssets(response.data.assets);
    } catch (error) {
      showToast('Failed to fetch cloud assets', 'error');
    } finally {
      setLoadingAssets(false);
    }
  };

  const deleteCloudAsset = async (asset) => {
    if (!confirm(`Are you sure you want to delete this ${asset.type} from cloud storage?`)) {
      return;
    }

    setDeletingAssetId(asset.id);
    try {
      await axios.delete(`${import.meta.env.VITE_baseUrl}/api/notification/asset`, {
        data: {
          publicId: asset.publicId,
          resourceType: asset.type
        }
      });
      
      setCloudAssets(cloudAssets.filter(a => a.id !== asset.id));
      showToast(`${asset.type} deleted successfully`, 'success');
    } catch (error) {
      showToast(`Failed to delete ${asset.type}`, 'error');
    } finally {
      setDeletingAssetId(null);
    }
  };

  // Keep all your existing handlers (handleVideoFileChange, handleImageFileChange, etc.)
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        showToast("Video file must be less than 100MB", "error");
        return;
      }

      if (!file.type.startsWith("video/")) {
        showToast("Please select a valid video file", "error");
        return;
      }

      setVideoFile(file);
      setVideoUrl("");
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast("Image file must be less than 10MB", "error");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showToast("Please select a valid image file", "error");
        return;
      }

      setImageFile(file);
      setImageUrl("");
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile || !videoTitle.trim()) {
      showToast("Please enter a video title and select a video file.", "error");
      return;
    }

    setVideoUploading(true);

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("upload_preset", "kietDisplay");
    formData.append("folder", "kiet/videos");
    formData.append("resource_type", "video");

    try {
      const res = await axios.post(import.meta.env.VITE_CLOUDINARY_VIDEO_URL, formData);
      setVideoUrl(res.data.url);
      showToast("Video uploaded successfully!", "success");
    } catch (err) {
      showToast("Failed to upload video. Please try again.", "error");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !imageTitle.trim()) {
      showToast("Please enter an image title and select an image file.", "error");
      return;
    }

    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "kietDisplay");
    formData.append("folder", "kiet/images");
    formData.append("resource_type", "image");

    try {
      const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);
      console.log(res.data);
      setImageUrl(res.data.url);
      showToast("Image uploaded successfully!", "success");
    } catch (err) {
      showToast("Failed to upload image. Please try again.", "error");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (receiver.length === 0) {
      showToast("Please select at least one receiver", "error");
      setLoading(false);
      return;
    }

    if (hasVideo && (!videoTitle.trim() || !videoUrl)) {
      showToast("Please complete video upload", "error");
      setLoading(false);
      return;
    }

    if (hasImage && (!imageTitle.trim() || !imageUrl)) {
      showToast("Please complete image upload", "error");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_baseUrl}/api/notification`, {
        sender,
        receivers: receiver,
        message,
        hasVideo,
        videoTitle: hasVideo ? videoTitle : null,
        videoUrl: hasVideo ? videoUrl : null,
        hasImage,
        imageTitle: hasImage ? imageTitle : null,
        imageUrl: hasImage ? imageUrl : null,
      });

      showToast("🎉 Notification sent successfully!", "success");

      setTimeout(() => {
        setReceiver([]);
        setMessage("");
        setHasVideo(false);
        setVideoTitle("");
        setVideoFile(null);
        setVideoUrl("");
        setHasImage(false);
        setImageTitle("");
        setImageFile(null);
        setImageUrl("");
        setShowAttachments(false);
        
        if (showRecentMessages) {
          fetchRecentMessages();
        }
        if (showCloudAssets) {
          fetchCloudAssets();
        }
      }, 1500);
    } catch (err) {
      showToast("Failed to send notification. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReceiverToggle = (value) => {
    if (receiver.includes(value)) {
      setReceiver(receiver.filter((r) => r !== value));
    } else {
      setReceiver([...receiver, value]);
    }
  };

  const selectAllReceivers = () => {
    if (receiver.length === receiverOptions.length) {
      setReceiver([]);
    } else {
      setReceiver(receiverOptions.map(option => option.value));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 py-6 sm:px-6 lg:px-8">
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
        position="top-center"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col items-center space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Send className="text-white w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Send Notification</h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">Create and send notifications to students</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setShowRecentMessages(!showRecentMessages);
                if (!showRecentMessages && recentMessages.length === 0) {
                  fetchRecentMessages();
                }
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <History className="w-4 h-4" />
              <span>{showRecentMessages ? 'Hide' : 'Show'} Recent Messages</span>
            </button>

            <button
              onClick={() => {
                setShowCloudAssets(!showCloudAssets);
                if (!showCloudAssets && cloudAssets.length === 0) {
                  fetchCloudAssets();
                }
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Cloud className="w-4 h-4" />
              <span>{showCloudAssets ? 'Hide' : 'Show'} Cloud Assets</span>
            </button>
          </div>
        </div>

        {/* Recent Messages Section (No Delete) */}
        {showRecentMessages && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <h3 className="text-white font-semibold text-lg flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>Recent Messages</span>
              </h3>
            </div>
            
            <div className="p-6">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
                </div>
              ) : recentMessages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent messages found</p>
              ) : (
                <div className="space-y-4">
                  {recentMessages.map((msg) => (
                    <div key={msg._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="mb-2">
                        <p className="font-medium text-gray-800 mb-1">{msg.message}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(msg.createdAt)}</span>
                          </p>
                          <p>Recipients: {msg.recipients?.join(', ') || 'N/A'} ({msg.count} total)</p>
                        </div>
                      </div>
                      
                      {(msg.hasImage || msg.hasVideo) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.hasImage && (
                            <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                              <ImageIcon className="w-3 h-3" />
                              <span>{msg.imageTitle}</span>
                            </span>
                          )}
                          {msg.hasVideo && (
                            <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                              <Video className="w-3 h-3" />
                              <span>{msg.videoTitle}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cloud Assets Section */}
        {showCloudAssets && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
              <h3 className="text-white font-semibold text-lg flex items-center space-x-2">
                <Cloud className="w-5 h-5" />
                <span>Cloud Assets</span>
              </h3>
            </div>
            
            <div className="p-6">
              {loadingAssets ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin w-6 h-6 text-green-600" />
                </div>
              ) : cloudAssets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No cloud assets found</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cloudAssets.map((asset) => (
                    <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                        {asset.type === 'image' ? (
                          <img 
                            src={buildCloudinaryUrl(asset.publicId, 'image')} 
                            alt={asset.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                            }}
                          />
                        ) : (
                          <video 
                            src={buildCloudinaryUrl(asset.publicId, 'video')} 
                            className="w-full h-full object-cover"
                            controls
                            poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmIj5WaWRlbzwvdGV4dD48L3N2Zz4="
                          />
                        )}
                        
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => deleteCloudAsset(asset)}
                            disabled={deletingAssetId === asset.id}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors disabled:opacity-50"
                          >
                            {deletingAssetId === asset.id ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        
                        <div className="absolute bottom-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            asset.type === 'image' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {asset.type === 'image' ? <ImageIcon className="w-3 h-3 inline mr-1" /> : <Video className="w-3 h-3 inline mr-1" />}
                            {asset.type}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1 truncate">{asset.title}</h4>
                        <p className="text-sm text-gray-500 mb-2 truncate">{asset.message}</p>
                        <p className="text-xs text-gray-400">{formatDate(asset.createdAt)}</p>
                        <p className="text-xs text-gray-400 truncate mt-1">ID: {asset.publicId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Your existing form remains the same */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
          {/* Keep all your existing form JSX here - sender, recipients, message, attachments, submit button */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-white font-semibold text-base sm:text-lg flex items-center space-x-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Notification Details</span>
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-gray-700">
                  <User className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Sender</span>
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-base sm:text-lg"
                  placeholder="e.g. HOD, Principal, Dean"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-gray-700">
                  <Users className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Recipients</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRecipientDropdownOpen(!recipientDropdownOpen)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between bg-white hover:bg-gray-50 ${
                      receiver.length > 0
                        ? 'border-blue-500 focus:ring-blue-200 bg-blue-50'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Users className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${receiver.length > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`font-medium text-sm sm:text-base truncate ${receiver.length > 0 ? 'text-blue-700' : 'text-gray-500'}`}>
                        {receiver.length === 0 
                          ? 'Select recipients' 
                          : `${receiver.length} recipient${receiver.length > 1 ? 's' : ''} selected`
                        }
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                        recipientDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {recipientDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-xl z-20 overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <button
                          type="button"
                          onClick={selectAllReceivers}
                          className="w-full px-3 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {receiver.length === receiverOptions.length ? "Deselect All" : "Select All"}
                        </button>
                      </div>
                      
                      <div className="max-h-48 sm:max-h-64 overflow-y-auto">
                        {receiverOptions.map((option) => {
                          const isSelected = receiver.includes(option.value);
                          return (
                            <label
                              key={option.value}
                              className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                isSelected ? 'bg-blue-50' : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleReceiverToggle(option.value)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
                              />
                              <span className="text-base sm:text-lg flex-shrink-0">Room No : {option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {receiver.length > 0 && (
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                <p className="text-blue-700 font-medium mb-2 flex items-center space-x-2 text-sm sm:text-base">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Selected Recipients ({receiver.length})</span>
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {receiver.map((r) => (
                    <span 
                      key={r} 
                      className="inline-flex items-center space-x-1 bg-blue-200 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-300 transition-colors"
                    >
                      <span className="truncate max-w-[80px] sm:max-w-none">{r}</span>
                      <button
                        type="button"
                        onClick={() => handleReceiverToggle(r)}
                        className="hover:bg-blue-400 rounded-full p-0.5 transition-colors flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-gray-700">
                <MessageSquare className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                <span>Message</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none text-base sm:text-lg"
                rows={3}
                placeholder="Enter your notification message here..."
                required
              />
              <div className="text-right text-xs sm:text-sm text-gray-500">
                {message.length}/500 characters
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 flex items-center space-x-2">
                  <Upload className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Attachments</span>
                  {(hasImage || hasVideo) && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {[hasImage && 'Image', hasVideo && 'Video'].filter(Boolean).join(' & ')}
                    </span>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAttachments(!showAttachments)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 self-start sm:self-auto"
                >
                  {showAttachments ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{showAttachments ? 'Hide' : 'Add'} Attachments</span>
                </button>
              </div>

              {showAttachments && (
                <div className="space-y-3 sm:space-y-4 bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={() => setHasImage(!hasImage)}
                      className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        hasImage 
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Image</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setHasVideo(!hasVideo)}
                      className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        hasVideo 
                          ? 'bg-purple-600 text-white shadow-lg transform scale-105' 
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Video</span>
                    </button>
                  </div>

                  {hasImage && (
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-blue-800 flex items-center space-x-2 text-sm sm:text-base">
                          <ImageIcon className="w-4 h-4" />
                          <span>Image Upload</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setHasImage(false);
                            setImageTitle("");
                            setImageFile(null);
                            setImageUrl("");
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full p-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={imageTitle}
                          onChange={(e) => setImageTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
                          placeholder="Enter image title"
                          required={hasImage}
                        />
                        
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all"
                        />
                        
                        {imageFile && !imageUrl && (
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={imageUploading}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:scale-100"
                          >
                            {imageUploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                            <span className="text-sm">{imageUploading ? 'Uploading...' : 'Upload Image'}</span>
                          </button>
                        )}
                        
                        {imageUrl && (
                          <div className="space-y-2">
                            <div className="bg-green-100 text-green-700 p-2 sm:p-3 rounded-lg text-xs sm:text-sm flex items-center space-x-2 border border-green-200">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span>Image uploaded successfully!</span>
                            </div>
                            <div className="relative rounded-lg overflow-hidden border border-blue-200">
                              <img 
                                src={buildCloudinaryUrl(imageUrl, 'image')} 
                                alt="Preview" 
                                className="w-full max-h-24 sm:max-h-32 object-contain bg-white" 
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="hidden items-center justify-center h-24 sm:h-32 bg-gray-100 text-gray-500 text-sm">
                                Public ID: {imageUrl}
                              </div>
                              <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                                ✓ Ready
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {hasVideo && (
                    <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-purple-800 flex items-center space-x-2 text-sm sm:text-base">
                          <Video className="w-4 h-4" />
                          <span>Video Upload</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setHasVideo(false);
                            setVideoTitle("");
                            setVideoFile(null);
                            setVideoUrl("");
                          }}
                          className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-full p-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm sm:text-base"
                          placeholder="Enter video title"
                          required={hasVideo}
                        />
                        
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileChange}
                          className="w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition-all"
                        />
                        
                        {videoFile && !videoUrl && (
                          <button
                            type="button"
                            onClick={handleVideoUpload}
                            disabled={videoUploading}
                            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:scale-100"
                          >
                            {videoUploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                            <span className="text-sm">{videoUploading ? 'Uploading...' : 'Upload Video'}</span>
                          </button>
                        )}
                        
                        {videoUrl && (
                          <div className="space-y-2">
                            <div className="bg-green-100 text-green-700 p-2 sm:p-3 rounded-lg text-xs sm:text-sm flex items-center space-x-2 border border-green-200">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span>Video uploaded successfully!</span>
                            </div>
                            <div className="relative rounded-lg overflow-hidden border border-purple-200">
                              <video 
                                src={buildCloudinaryUrl(videoUrl, 'video')} 
                                controls 
                                className="w-full max-h-24 sm:max-h-32 bg-black"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="hidden items-center justify-center h-24 sm:h-32 bg-gray-100 text-gray-500 text-sm">
                                Public ID: {videoUrl}
                              </div>
                              <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                                ✓ Ready
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || receiver.length === 0 || (hasVideo && !videoUrl) || (hasImage && !imageUrl)}
                className={`w-full font-semibold py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-3 text-sm sm:text-base ${
                  loading || receiver.length === 0 || (hasVideo && !videoUrl) || (hasImage && !imageUrl)
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:scale-[1.02] hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Sending Notification...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Send Notification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Notification;
