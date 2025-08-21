import React, { useState } from "react";
import axios from "axios";

const Notification = () => {
  const [sender, setSender] = useState("HOD");
  const [receiver, setReceiver] = useState([]);
  const [message, setMessage] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const receiverOptions = [
    "ALL",
    "1-a",
    "1-b",
    "2-a",
    "2-b",
    "3-a",
    "3-b",
    "4-a",
    "4-b",
  ];

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (100MB limit for free Cloudinary)
      if (file.size > 100 * 1024 * 1024) {
        showToastMessage("Video file must be less than 100MB", "error");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("video/")) {
        showToastMessage("Please select a valid video file", "error");
        return;
      }

      setVideoFile(file);
      setVideoUrl(""); // Reset video URL when new file is selected
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile || !videoTitle.trim()) {
      showToastMessage(
        "Please enter a video title and select a video file.",
        "error"
      );
      return;
    }

    setVideoUploading(true);

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("upload_preset", "kietDisplay"); // Same preset as images
    formData.append("folder", "kiet/videos"); // Separate folder for videos
    formData.append("resource_type", "video"); // Important: specify video resource type

    try {
      const res = await axios.post(
        import.meta.env.VITE_CLOUDINARY_VIDEO_URL,
        formData
      );
      const uploadedVideoUrl = res.data.secure_url;
      setVideoUrl(uploadedVideoUrl);
      showToastMessage("Video uploaded successfully!", "success");
    } catch (err) {
      console.error("Video upload error:", err);
      showToastMessage("Failed to upload video. Please try again.", "error");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowToast(false);

    // Validation
    if (receiver.length === 0) {
      showToastMessage("Please select at least one receiver", "error");
      setLoading(false);
      return;
    }

    if (hasVideo && !videoTitle.trim()) {
      showToastMessage("Please enter a video title", "error");
      setLoading(false);
      return;
    }

    if (hasVideo && !videoUrl) {
      showToastMessage("Please upload the video first", "error");
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
      });

      showToastMessage("Notification sent successfully!", "success");

      // Reset form
      setReceiver([]);
      setMessage("");
      setHasVideo(false);
      setVideoTitle("");
      setVideoFile(null);
      setVideoUrl("");
    } catch (err) {
      console.error("Error posting notification:", err);
      showToastMessage(
        "Failed to send notification. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message, type) => {
    if (type === "error") setErrorMessage(message);
    else setSuccessMessage(message);

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 p-5">
      <h1 className="text-3xl font-bold mb-4">Send Notification</h1>

      {showToast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md text-white z-50 ${
            successMessage ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {successMessage || errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gradient-to-br from-blue-200 to-purple-200 shadow-lg p-6 rounded"
      >
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Sender</label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. HOD"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Receiver(s)</label>
          <div className="grid grid-cols-2 gap-2">
            {receiverOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={receiver.includes(option)}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (e.target.checked) {
                      setReceiver([...receiver, value]);
                    } else {
                      setReceiver(receiver.filter((r) => r !== value));
                    }
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Enter your message here..."
            required
          />
        </div>

        {/* Video Upload Section */}
        <div className="mb-4">
          <label className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              checked={hasVideo}
              onChange={(e) => setHasVideo(e.target.checked)}
            />
            <span className="font-semibold">Include Video</span>
          </label>

          {hasVideo && (
            <div className="space-y-3 border p-4 rounded bg-white">
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  Video Title
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter video title"
                  required={hasVideo}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-sm">
                  Select Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="w-full p-2 border rounded mb-2"
                />
                <p className="text-xs text-gray-600 mb-2">
                  Max file size: 100MB. Supported formats: MP4, MOV, AVI, etc.
                </p>

                {videoFile && !videoUrl && (
                  <button
                    type="button"
                    onClick={handleVideoUpload}
                    disabled={videoUploading}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:bg-green-300"
                  >
                    {videoUploading ? "Uploading..." : "Upload Video"}
                  </button>
                )}
              </div>

              {videoFile && (
                <div className="text-sm text-blue-600">
                  Selected: {videoFile.name} (
                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}

              {videoUrl && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  ✅ Video uploaded successfully! Ready to send notification.
                </div>
              )}

              {videoUrl && (
                <div className="mt-3">
                  <label className="block mb-1 font-semibold text-sm">
                    Video Preview
                  </label>
                  <video
                    src={videoUrl}
                    controls
                    className="w-full max-h-40 rounded"
                    style={{ maxHeight: "160px" }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || (hasVideo && !videoUrl)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 w-full"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
};

export default Notification;
