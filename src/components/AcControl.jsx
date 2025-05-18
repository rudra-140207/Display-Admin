import React, { useState } from 'react';

const AcControl = () => {
  const classrooms = ['Room 117'];
  const [acStates, setAcStates] = useState(
    classrooms.reduce((acc, room) => ({ ...acc, [room]: false }), {})
  );

  const toggleAc = async (room) => {
    const newState = !acStates[room];


    setAcStates((prev) => ({ ...prev, [room]: newState }));

   
    try {
      await fetch('http://localhost:5000/send-to-arduino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: newState ? 'ON' : 'OFF',
        }),
      });
    } catch (error) {
      console.error('Error sending to Arduino:', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">AC Control Panel</h1>
      {classrooms.map((room) => (
        <div key={room} className="flex justify-between items-center mb-2 p-2 border rounded">
          <span>{room}</span>
          <button
            onClick={() => toggleAc(room)}
            className={`px-4 py-1 rounded ${
              acStates[room] ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}
          >
            {acStates[room] ? 'ON' : 'OFF'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AcControl;
