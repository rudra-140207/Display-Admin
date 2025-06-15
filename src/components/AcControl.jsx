import React, { useEffect, useState } from "react";
import { db, ref, set, onValue } from "../common/firebase";

const AcControl = () => {
  const roomGroups = {
    D118: ["D118-1", "D118-2", "D118-3", "D118-4"],
    D117: ["D117-1", "D117-2", "D117-3", "D117-4"],
  };

  const [acStates, setAcStates] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    Object.entries(roomGroups).forEach(([group, rooms]) => {
      const groupRef = ref(db, `${group}`); // ✅ No 'acStates/' prefix here
      onValue(groupRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAcStates((prev) => ({
            ...prev,
            [group]: rooms.reduce((groupState, room) => {
              groupState[room] = data[room]?.status === "ON";
              return groupState;
            }, {}),
          }));
        }
      });
    });
  }, []);

  const toggleAc = async (group, room, newState) => {
    try {
      await set(ref(db, `${group}/${room}`), {
        status: newState ? "ON" : "OFF",
      });

      setSuccessMessage(`${room} turned ${newState ? "ON" : "OFF"}`);
      setErrorMessage("");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating AC:", error);
      setErrorMessage(`Failed to update ${room}`);
      setSuccessMessage("");
      setShowToast(true);
    }

    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleGroup = async (group, newState) => {
    const updates = roomGroups[group].map((room) =>
      toggleAc(group, room, newState)
    );
    await Promise.all(updates);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AC Control Panel</h1>

      {showToast && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md text-white ${
            successMessage ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {successMessage || errorMessage}
        </div>
      )}

      {Object.entries(roomGroups).map(([group, rooms]) => (
        <div key={group} className="mb-6 border p-4 rounded shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">{group}</h2>
            <div>
              <button
                onClick={() => toggleGroup(group, true)}
                className="mr-2 px-4 py-1 bg-green-600 text-white rounded"
              >
                All ON
              </button>
              <button
                onClick={() => toggleGroup(group, false)}
                className="px-4 py-1 bg-red-600 text-white rounded"
              >
                All OFF
              </button>
            </div>
          </div>

          {rooms.map((room) => (
            <div
              key={room}
              className="flex justify-between items-center mb-2 p-2 border rounded"
            >
              <span>{room}</span>
              <button
                onClick={() =>
                  toggleAc(group, room, !acStates?.[group]?.[room])
                }
                className={`px-4 py-1 rounded ${
                  acStates?.[group]?.[room]
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {acStates?.[group]?.[room] ? "ON" : "OFF"}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AcControl;
