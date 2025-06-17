import React, { useState } from "react";
import axios from "axios";

const UploadPdf = () => {
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [text, setText] = useState("");

  const handleFileChange = (e) => {
    setPdf(e.target.files[0]);
    setResponseMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdf) return;

    const formData = new FormData();
    formData.append("pdf", pdf);

    setLoading(true);
    try {
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
    } catch (error) {
      console.error(error);
      setResponseMsg("❌ Error uploading or processing the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-300 to-purple-300 min-h-screen p-4">
      <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-blue-200 to-purple-200 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Upload Academic Calendar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Upload & Extract Activities"}
          </button>
        </form>
        {responseMsg && <p className="mt-4 text-center">{responseMsg}</p>}
        {text && <p className="mt-4 text-center">{text}</p>}
      </div>
    </div>
  );
};

export default UploadPdf;
