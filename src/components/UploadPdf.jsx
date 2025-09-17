import React, { useState } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Download,
  Eye,
  Trash2,
  Activity,
  Clock,
  FileCheck
} from "lucide-react";

const UploadPdf = () => {
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [text, setText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [extractedData, setExtractedData] = useState(null);
  const [processingStep, setProcessingStep] = useState("");

  const handleFileChange = (file) => {
    if (file && file.type === "application/pdf") {
      setPdf(file);
      setResponseMsg("");
      setText("");
      setExtractedData(null);
    } else {
      showToastMessage("Please select a valid PDF file", "error");
    }
  };

  const handleFileInput = (e) => {
    handleFileChange(e.target.files[0]);
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
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdf) {
      showToastMessage("Please select a PDF file first", "error");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdf);

    setLoading(true);
    setProcessingStep("Uploading PDF...");
    
    try {
      setProcessingStep("Extracting text from PDF...");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      setProcessingStep("Analyzing calendar data...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStep("Adding activities to database...");
      const res = await axios.post(
        `${import.meta.env.VITE_baseUrl}/api/upload-calendar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponseMsg(`✅ ${res.data.count} activities added successfully!`);
      setText(res.data.text);
      setExtractedData({
        count: res.data.count,
        timestamp: new Date().toLocaleString(),
        filename: pdf.name
      });
      showToastMessage("Calendar processed successfully!", "success");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Error uploading or processing the PDF.";
      setResponseMsg(`❌ ${errorMsg}`);
      showToastMessage(errorMsg, "error");
    } finally {
      setLoading(false);
      setProcessingStep("");
    }
  };

  const showToastMessage = (message, type) => {
    setToastType(type);
    setResponseMsg(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const resetForm = () => {
    setPdf(null);
    setResponseMsg("");
    setText("");
    setExtractedData(null);
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
            toastType === "success" 
              ? "bg-gradient-to-r from-green-500 to-green-600" 
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}
        >
          {toastType === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{responseMsg}</span>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-2 hover:bg-white/20 rounded-full p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Calendar className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Upload Academic Calendar</h1>
          </div>
          <p className="text-gray-600 text-lg">Extract and import activities from PDF calendar</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-white font-semibold text-lg flex items-center space-x-2">
                <Upload size={20} />
                <span>Upload PDF Calendar</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
              {/* File Upload Area */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-gray-700">
                  Select PDF File
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
                    accept="application/pdf"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-blue-100 p-4 rounded-full">
                        <FileText className="text-blue-600" size={32} />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your PDF here, or <span className="text-blue-600">browse</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Academic calendar in PDF format (Max 50MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Info */}
              {pdf && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-blue-600" size={20} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{pdf.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(pdf.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Processing Status */}
              {loading && processingStep && (
                <div className="bg-yellow-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="text-yellow-600 animate-spin" size={20} />
                    <div>
                      <p className="font-medium text-yellow-800">Processing...</p>
                      <p className="text-sm text-yellow-600">{processingStep}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !pdf}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Processing PDF...</span>
                  </>
                ) : (
                  <>
                    <Calendar size={24} />
                    <span>Upload & Extract Activities</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h2 className="text-white font-semibold text-lg flex items-center space-x-2">
                <Activity size={20} />
                <span>Processing Results</span>
              </h2>
            </div>

            <div className="p-6 lg:p-8">
              {extractedData ? (
                <div className="space-y-6">
                  {/* Success Summary */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle2 className="text-green-600" size={24} />
                      <h3 className="text-lg font-semibold text-green-800">Processing Complete!</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{extractedData.count}</p>
                        <p className="text-sm text-green-700">Activities Added</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">✅</p>
                        <p className="text-sm text-green-700">Successfully Processed</p>
                      </div>
                    </div>
                  </div>

                  {/* File Details */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <FileCheck size={18} />
                      <span>File Details</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Filename:</span>
                        <span className="text-gray-800 font-medium">{extractedData.filename}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processed:</span>
                        <span className="text-gray-800 font-medium">{extractedData.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Text Preview */}
                  {text && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                        <Eye size={18} />
                        <span>Extracted Content Preview</span>
                      </h4>
                      <div className="bg-white rounded-lg p-4 max-h-48 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{text.substring(0, 500)}...</pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-100 p-6 rounded-2xl inline-block mb-4">
                    <Calendar className="text-gray-400" size={48} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Results Yet</h3>
                  <p className="text-gray-500">Upload a PDF calendar to see extracted activities</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <FileText className="text-blue-600" size={20} />
            <span>How it works</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-3">
                <Upload className="text-blue-600" size={24} />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">1. Upload PDF</h4>
              <p className="text-sm text-gray-600">Select your academic calendar PDF file</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full inline-block mb-3">
                <Activity className="text-purple-600" size={24} />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">2. AI Processing</h4>
              <p className="text-sm text-gray-600">Our system extracts and analyzes activities</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-3">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">3. Import Complete</h4>
              <p className="text-sm text-gray-600">Activities are added to your dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPdf;
