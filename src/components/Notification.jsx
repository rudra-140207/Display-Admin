import React, { useState } from "react";
import axios from "axios";

const Notification = () => {
  const [sender, setSender] = useState("HOD");
  const [receiver, setReceiver] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowToast(false);

    try {
      await axios.post(`${import.meta.env.VITE_baseUrl}/api/notification`, {
        sender,
        receivers: receiver,
        message,
      });

      setSuccessMessage("Notification sent successfully!");
      setShowToast(true);
      setReceiver("");
      setMessage("");

      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } catch (err) {
      setErrorMessage("Failed to send notification. Please try again.");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 4000);

      console.error("Error posting notification:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 p-5">
      <h1 className="text-3xl font-bold mb-4">Send Notification</h1>

      {showToast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md text-white ${
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

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
};

export default Notification;
