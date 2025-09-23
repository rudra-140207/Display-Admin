import React, { useState } from "react";
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
  AlertCircle,
  X,
  Play,
  Eye,
  Loader2,
  FileText,
  Trash2,
  ChevronDown,
  Plus,
  Minus
} from "lucide-react";
import Toast from "./Toast"; // Import the Toast component
import useToast from "../hooks/useToast"; // Import the custom hook

const Notification = () => {
  const [sender, setSender] = useState("HOD");
  const [receiver, setReceiver] = useState([]);
  const [message, setMessage] = useState("");

  // Video states
  const [hasVideo, setHasVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoUploading, setVideoUploading] = useState(false);

  // Image states
  const [hasImage, setHasImage] = useState(false);
  const [imageTitle, setImageTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  // General states
  const [loading, setLoading] = useState(false);
  
  // Dropdown states
  const [recipientDropdownOpen, setRecipientDropdownOpen] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  // Toast management
  const { toast, showToast, hideToast } = useToast();

  const receiverOptions = [
    {value : "d-046", label : "D-046"},
    {value : "d-047", label : "D-047"},
    {value : "d-048", label : "D-048"},
    {value : "d-116", label : "D-116"},
    {value : "d-117", label : "D-117"},
    {value : "d-118", label : "D-118"},
    {value : "c-219", label : "C-219"},
  ];

  // All handler functions remain exactly the same
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
      const uploadedVideoUrl = res.data.secure_url;
      setVideoUrl(uploadedVideoUrl);
      showToast("Video uploaded successfully!", "success");
    } catch (err) {
      console.error("Video upload error:", err);
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
      const uploadedImageUrl = res.data.secure_url;
      setImageUrl(uploadedImageUrl);
      showToast("Image uploaded successfully!", "success");
    } catch (err) {
      console.error("Image upload error:", err);
      showToast("Failed to upload image. Please try again.", "error");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
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

      // Reset form
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
      }, 1500);
    } catch (err) {
      console.error("Error posting notification:", err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Enhanced Toast Component */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
        position="top-center"
      />

      <div className="max-w-4xl mx-auto">
        {/* Header - Mobile Optimized */}
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
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-white font-semibold text-base sm:text-lg flex items-center space-x-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Notification Details</span>
            </h2>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Two Column Layout for Sender and Recipients - Mobile Stacked */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Sender Input Field */}
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

              {/* Recipients Dropdown */}
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
                      {/* Select All Button */}
                      <div className="p-2 border-b border-gray-100">
                        <button
                          type="button"
                          onClick={selectAllReceivers}
                          className="w-full px-3 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {receiver.length === receiverOptions.length ? "Deselect All" : "Select All"}
                        </button>
                      </div>
                      
                      {/* Recipients List */}
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

            {/* Selected Recipients Display */}
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

            {/* Message Input */}
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

            {/* Attachments Section */}
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
                  {/* Attachment Type Selector */}
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

                  {/* Image Upload Section */}
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
                              <img src={imageUrl} alt="Preview" className="w-full max-h-24 sm:max-h-32 object-contain bg-white" />
                              <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                                ✓ Ready
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Video Upload Section */}
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
                              <video src={videoUrl} controls className="w-full max-h-24 sm:max-h-32 bg-black" />
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

            {/* Submit Button */}
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
