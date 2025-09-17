import React, { useState } from "react";
import axios from "axios";
import {
  Upload,
  Image as ImageIcon,
  FileImage,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Eye,
  RotateCcw,
  Download,
  Trash2
} from "lucide-react";

const AddImage = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (file) => {
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    handleImageChange(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleImageChange(file);
      } else {
        showToastMessage("Please select a valid image file", "error");
      }
    }
  };

  const handleUpload = async () => {
    if (!image || !name.trim()) {
      showToastMessage("Please enter a name and select an image.", "error");
      return;
    }

    // Validate image size (10MB limit)
    if (image.size > 10 * 1024 * 1024) {
      showToastMessage("Image size must be less than 10MB", "error");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowToast(false);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "kietDisplay");
    formData.append("folder", "kiet");
    formData.append("resource_type", "image");

    try {
      const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);
      const uploadedImageUrl = res.data.secure_url;
      setImageUrl(uploadedImageUrl);

      await uploadImageToDatabase(name, uploadedImageUrl);
    } catch (err) {
      showToastMessage("Failed to upload image. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToDatabase = async (name, url) => {
    try {
      await axios.post(`${import.meta.env.VITE_baseUrl}/api/images`, { 
        name, 
        imageUrl: url 
      });
      showToastMessage("Image uploaded successfully!", "success");
      
      // Reset form after successful upload
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (error) {
      showToastMessage("Failed to save image in the database.", "error");
    }
  };

  const resetForm = () => {
    setName("");
    setImage(null);
    setImagePreview("");
    setImageUrl("");
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <ImageIcon className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Add Image</h1>
          </div>
          <p className="text-gray-600 text-lg">Upload and manage your image gallery</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-white font-semibold text-lg flex items-center space-x-2">
                <Upload size={20} />
                <span>Upload Image</span>
              </h2>
            </div>

            <div className="p-6 lg:p-8 space-y-6">
              {/* Image Name Input */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700">
                  Image Name
                </label>
                <input
                  type="text"
                  placeholder="Enter a descriptive name for your image"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                  disabled={loading}
                />
              </div>

              {/* File Upload Area */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700">
                  Select Image File
                </label>
                <div
                  className={`relative border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-blue-100 p-4 rounded-full">
                        <FileImage className="text-blue-600" size={32} />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your image here, or <span className="text-blue-600">browse</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supports: JPG, PNG, GIF, WebP (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Info */}
              {image && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <FileImage className="text-blue-600" size={20} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{image.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(image.size)}</p>
                    </div>
                    <button
                      onClick={() => {
                        setImage(null);
                        setImagePreview("");
                      }}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={loading || !image || !name.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    <span>Upload Image</span>
                  </>
                )}
              </button>

              {/* Reset Button */}
              {(image || name || imageUrl) && !loading && (
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <RotateCcw size={20} />
                  <span>Reset Form</span>
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h2 className="text-white font-semibold text-lg flex items-center space-x-2">
                <Eye size={20} />
                <span>Preview</span>
              </h2>
            </div>

            <div className="p-6 lg:p-8">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full rounded-2xl shadow-lg border border-gray-200"
                      style={{ maxHeight: "400px", objectFit: "contain" }}
                    />
                    <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                      Preview
                    </div>
                  </div>
                  
                  {name && (
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                    </div>
                  )}
                </div>
              ) : imageUrl ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      className="w-full rounded-2xl shadow-lg border border-gray-200"
                      style={{ maxHeight: "400px", objectFit: "contain" }}
                    />
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1">
                      <CheckCircle2 size={14} />
                      <span>Uploaded</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <CheckCircle2 className="mx-auto text-green-600 mb-2" size={24} />
                    <p className="text-green-700 font-medium">Successfully Uploaded!</p>
                    <p className="text-sm text-green-600 mt-1">Image has been saved to your gallery</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-100 p-6 rounded-2xl inline-block mb-4">
                    <ImageIcon className="text-gray-400" size={48} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Preview Available</h3>
                  <p className="text-gray-500">Select an image to see the preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddImage;
