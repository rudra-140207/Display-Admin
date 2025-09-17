import React, { useEffect, useState } from "react";
import { db, ref, set, onValue } from "../common/firebase";
import {
  Zap,
  Power,
  Building,
  Settings,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Thermometer,
  Wind,
  Activity,
  Wifi,
  WifiOff
} from "lucide-react";

const AcControl = () => {
  const roomGroups = {
    D118: ["D118-1", "D118-2", "D118-3", "D118-4"],
    D117: ["D117-1", "D117-2", "D117-3", "D117-4"],
  };

  const [acStates, setAcStates] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingStates, setLoadingStates] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("connected");

  useEffect(() => {
    setConnectionStatus("connecting");
    
    Object.entries(roomGroups).forEach(([group, rooms]) => {
      const groupRef = ref(db, `${group}`);
      onValue(
        groupRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setAcStates((prev) => ({
              ...prev,
              [group]: rooms.reduce((groupState, room) => {
                groupState[room] = data[room]?.status === "ON";
                return groupState;
              }, {}),
            }));
            setConnectionStatus("connected");
          }
        },
        (error) => {
          console.error("Firebase connection error:", error);
          setConnectionStatus("disconnected");
          showToastMessage("Connection to AC system failed", "error");
        }
      );
    });
  }, []);

  const toggleAc = async (group, room, newState) => {
    const loadingKey = `${group}-${room}`;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

    try {
      await set(ref(db, `${group}/${room}`), {
        status: newState ? "ON" : "OFF",
      });

      showToastMessage(`${room} turned ${newState ? "ON" : "OFF"}`, "success");
    } catch (error) {
      console.error("Error updating AC:", error);
      showToastMessage(`Failed to update ${room}`, "error");
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const toggleGroup = async (group, newState) => {
    const updates = roomGroups[group].map((room) =>
      toggleAc(group, room, newState)
    );
    await Promise.all(updates);
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
    setTimeout(() => setShowToast(false), 3000);
  };

  const getTotalAcsOn = () => {
    return Object.values(acStates).reduce((total, group) => {
      return total + Object.values(group).filter(Boolean).length;
    }, 0);
  };

  const getTotalAcs = () => {
    return Object.values(roomGroups).reduce((total, rooms) => total + rooms.length, 0);
  };

  const getGroupStatus = (group) => {
    const groupAcs = acStates[group] || {};
    const onCount = Object.values(groupAcs).filter(Boolean).length;
    const totalCount = roomGroups[group].length;
    
    if (onCount === 0) return { status: "off", color: "gray" };
    if (onCount === totalCount) return { status: "on", color: "green" };
    return { status: "partial", color: "yellow" };
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

      <div className="p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <Zap className="text-white" size={32} />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">AC Control Panel</h1>
            </div>
            <p className="text-gray-600 text-lg">Centralized air conditioning management system</p>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Activity className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Units</p>
                  <p className="text-2xl font-bold text-gray-800">{getTotalAcs()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Power className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Units Running</p>
                  <p className="text-2xl font-bold text-gray-800">{getTotalAcsOn()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Building className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Room Groups</p>
                  <p className="text-2xl font-bold text-gray-800">{Object.keys(roomGroups).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${
                  connectionStatus === "connected" ? "bg-green-100" : 
                  connectionStatus === "connecting" ? "bg-yellow-100" : "bg-red-100"
                }`}>
                  {connectionStatus === "connected" ? (
                    <Wifi className="text-green-600" size={24} />
                  ) : connectionStatus === "connecting" ? (
                    <Loader2 className="text-yellow-600 animate-spin" size={24} />
                  ) : (
                    <WifiOff className="text-red-600" size={24} />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Connection</p>
                  <p className={`text-lg font-bold capitalize ${
                    connectionStatus === "connected" ? "text-green-600" : 
                    connectionStatus === "connecting" ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {connectionStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Groups */}
          <div className="grid lg:grid-cols-2 gap-8">
            {Object.entries(roomGroups).map(([group, rooms]) => {
              const groupStatus = getGroupStatus(group);
              
              return (
                <div key={group} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                  {/* Group Header */}
                  <div className={`px-6 py-4 bg-gradient-to-r ${
                    groupStatus.color === "green" ? "from-green-500 to-green-600" :
                    groupStatus.color === "yellow" ? "from-yellow-500 to-yellow-600" :
                    "from-gray-500 to-gray-600"
                  } text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building size={24} />
                        <div>
                          <h2 className="text-xl font-bold">{group}</h2>
                          <p className="text-sm opacity-90">
                            {Object.values(acStates[group] || {}).filter(Boolean).length} of {rooms.length} units running
                          </p>
                        </div>
                      </div>
                      
                      <div className={`w-4 h-4 rounded-full ${
                        groupStatus.color === "green" ? "bg-white animate-pulse" :
                        groupStatus.color === "yellow" ? "bg-white/80" : "bg-white/50"
                      }`}></div>
                    </div>
                  </div>

                  {/* Group Controls */}
                  <div className="p-6">
                    <div className="flex space-x-3 mb-6">
                      <button
                        onClick={() => toggleGroup(group, true)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <Power size={20} />
                        <span>All ON</span>
                      </button>
                      <button
                        onClick={() => toggleGroup(group, false)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <Power size={20} />
                        <span>All OFF</span>
                      </button>
                    </div>

                    {/* Individual Room Controls */}
                    <div className="grid grid-cols-2 gap-3">
                      {rooms.map((room) => {
                        const isOn = acStates?.[group]?.[room];
                        const isLoading = loadingStates[`${group}-${room}`];
                        
                        return (
                          <div
                            key={room}
                            className={`relative p-4 border-2 rounded-xl transition-all duration-200 ${
                              isOn 
                                ? "border-green-200 bg-green-50" 
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${
                                  isOn ? "bg-green-200" : "bg-gray-200"
                                }`}>
                                  <Thermometer 
                                    className={isOn ? "text-green-600" : "text-gray-500"} 
                                    size={18} 
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{room}</p>
                                  <p className={`text-xs ${isOn ? "text-green-600" : "text-gray-500"}`}>
                                    {isOn ? "Running" : "Stopped"}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => toggleAc(group, room, !isOn)}
                                disabled={isLoading}
                                className={`relative w-16 h-8 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                  isOn 
                                    ? "bg-green-600 focus:ring-green-500" 
                                    : "bg-gray-300 focus:ring-gray-400"
                                }`}
                              >
                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 flex items-center justify-center ${
                                  isOn ? "translate-x-8" : "translate-x-0"
                                }`}>
                                  {isLoading ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                  ) : (
                                    <div className={`w-2 h-2 rounded-full ${isOn ? "bg-green-600" : "bg-gray-400"}`}></div>
                                  )}
                                </div>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Info */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">System Information</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Connected to Firebase</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Real-time synchronization</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Remote control enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcControl;
