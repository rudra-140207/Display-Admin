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
  WifiOff,
  Menu,
  ChevronDown
} from "lucide-react";
import Toast from "./Toast"; // Import the new Toast
import useToast from "../hooks/useToast"; // Import the hook

const AcControl = () => {
  const roomGroups = {
    D118: ["D118-1", "D118-2", "D118-3", "D118-4"],
    D117: ["D117-1", "D117-2", "D117-3", "D117-4"],
  };

  const [acStates, setAcStates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [showSystemInfo, setShowSystemInfo] = useState(false);

  // Toast management
  const { toast, showSuccess, showError, hideToast } = useToast();

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
          showError("Connection to AC system failed");
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

      showSuccess(`${room} turned ${newState ? "ON" : "OFF"}`);
    } catch (error) {
      console.error("Error updating AC:", error);
      showError(`Failed to update ${room}`);
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

  const toggleGroupExpansion = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
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
      {/* Enhanced Toast */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
        position="top-center"
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header - Mobile Optimized */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col items-center space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <Zap className="text-white w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">AC Control Panel</h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">Centralized air conditioning management</p>
              </div>
            </div>
          </div>

          {/* Status Overview - Mobile First Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-lg sm:rounded-xl mb-2 sm:mb-0 self-start">
                  <Activity className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Total Units</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{getTotalAcs()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-green-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <div className="bg-green-100 p-2 sm:p-3 rounded-lg sm:rounded-xl mb-2 sm:mb-0 self-start">
                  <Power className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Units Running</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{getTotalAcsOn()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-purple-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <div className="bg-purple-100 p-2 sm:p-3 rounded-lg sm:rounded-xl mb-2 sm:mb-0 self-start">
                  <Building className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Room Groups</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{Object.keys(roomGroups).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-orange-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl mb-2 sm:mb-0 self-start ${
                  connectionStatus === "connected" ? "bg-green-100" : 
                  connectionStatus === "connecting" ? "bg-yellow-100" : "bg-red-100"
                }`}>
                  {connectionStatus === "connected" ? (
                    <Wifi className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  ) : connectionStatus === "connecting" ? (
                    <Loader2 className="text-yellow-600 animate-spin w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  ) : (
                    <WifiOff className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Connection</p>
                  <p className={`text-sm sm:text-base lg:text-lg font-bold capitalize ${
                    connectionStatus === "connected" ? "text-green-600" : 
                    connectionStatus === "connecting" ? "text-yellow-600" : "text-red-600"
                  }`}>
                    {connectionStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Groups - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {Object.entries(roomGroups).map(([group, rooms]) => {
              const groupStatus = getGroupStatus(group);
              const isExpanded = expandedGroups[group] !== false; // Default to expanded
              
              return (
                <div key={group} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
                  {/* Group Header - Mobile Optimized */}
                  <div className={`px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r ${
                    groupStatus.color === "green" ? "from-green-500 to-green-600" :
                    groupStatus.color === "yellow" ? "from-yellow-500 to-yellow-600" :
                    "from-gray-500 to-gray-600"
                  } text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <Building className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg sm:text-xl font-bold truncate">{group}</h2>
                          <p className="text-xs sm:text-sm opacity-90 truncate">
                            {Object.values(acStates[group] || {}).filter(Boolean).length} of {rooms.length} units running
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 ${
                          groupStatus.color === "green" ? "bg-white animate-pulse" :
                          groupStatus.color === "yellow" ? "bg-white/80" : "bg-white/50"
                        }`}></div>
                        
                        {/* Mobile toggle button */}
                        <button
                          onClick={() => toggleGroupExpansion(group)}
                          className="lg:hidden p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <ChevronDown 
                            className={`w-4 h-4 transform transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Group Controls - Collapsible on Mobile */}
                  <div className={`transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  } lg:max-h-none lg:opacity-100`}>
                    <div className="p-4 sm:p-6">
                      {/* Group Action Buttons */}
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
                        <button
                          onClick={() => toggleGroup(group, true)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                          <Power className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">All ON</span>
                        </button>
                        <button
                          onClick={() => toggleGroup(group, false)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                          <Power className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">All OFF</span>
                        </button>
                      </div>

                      {/* Individual Room Controls - Responsive Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {rooms.map((room) => {
                          const isOn = acStates?.[group]?.[room];
                          const isLoading = loadingStates[`${group}-${room}`];
                          
                          return (
                            <div
                              key={room}
                              className={`relative p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl transition-all duration-200 ${
                                isOn 
                                  ? "border-green-200 bg-green-50" 
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                  <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg flex-shrink-0 ${
                                    isOn ? "bg-green-200" : "bg-gray-200"
                                  }`}>
                                    <Thermometer 
                                      className={`${isOn ? "text-green-600" : "text-gray-500"} w-3.5 h-3.5 sm:w-4 sm:h-4`}
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{room}</p>
                                    <p className={`text-xs ${isOn ? "text-green-600" : "text-gray-500"}`}>
                                      {isOn ? "Running" : "Stopped"}
                                    </p>
                                  </div>
                                </div>

                                {/* Toggle Switch - Mobile Optimized */}
                                <button
                                  onClick={() => toggleAc(group, room, !isOn)}
                                  disabled={isLoading}
                                  className={`relative w-12 h-6 sm:w-14 sm:h-7 lg:w-16 lg:h-8 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex-shrink-0 ${
                                    isOn 
                                      ? "bg-green-600 focus:ring-green-500" 
                                      : "bg-gray-300 focus:ring-gray-400"
                                  }`}
                                >
                                  <div className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white rounded-full shadow transform transition-transform duration-200 flex items-center justify-center ${
                                    isOn ? "translate-x-6 sm:translate-x-6 lg:translate-x-8" : "translate-x-0"
                                  }`}>
                                    {isLoading ? (
                                      <Loader2 className="w-2 h-2 sm:w-3 sm:h-3 animate-spin text-gray-400" />
                                    ) : (
                                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isOn ? "bg-green-600" : "bg-gray-400"}`}></div>
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
                </div>
              );
            })}
          </div>

          {/* System Info - Mobile Optimized with Collapsible */}
          <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setShowSystemInfo(!showSystemInfo)}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Settings className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">System Information</h3>
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                  showSystemInfo ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <div className={`transition-all duration-300 overflow-hidden ${
              showSystemInfo ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-4 sm:px-6 pb-4">
                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-600 truncate">Connected to Firebase</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-600 truncate">Real-time synchronization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-600 truncate">Remote control enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcControl;
