import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { motion } from "framer-motion";
import NavbarComponent from "../components/shared/Navbar";

const ExportReportsComponent = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "00:00", 
    startSeconds: "00",
    endDate: "",
    endTime: "23:59",
    endSeconds: "59",
    format: "csv",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Helper to format date and time fields
  const formatDateTime = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5);
    const formattedSeconds = date.toTimeString().split(" ")[0].slice(6, 8);
    return { formattedDate, formattedTime, formattedSeconds };
  };

  // Set predefined time ranges
  const setTimeRange = (hours, minutes) => {
    const endDateTime = new Date();
    const startDateTime = new Date(endDateTime.getTime() - (hours * 60 + minutes) * 60000);

    const { formattedDate: startDate, formattedTime: startTime, formattedSeconds: startSeconds } = formatDateTime(startDateTime);
    const { formattedDate: endDate, formattedTime: endTime, formattedSeconds: endSeconds } = formatDateTime(endDateTime);

    setFormData({
      ...formData,
      startDate,
      startTime,
      startSeconds,
      endDate,
      endTime,
      endSeconds,
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
  
      const startDateTime = `${formData.startDate} ${formData.startTime}:${formData.startSeconds}`;
      const endDateTime = `${formData.endDate} ${formData.endTime}:${formData.endSeconds}`;
      console.log(startDateTime);  
      console.log(endDateTime);    
  
      const response = await fetch("http://localhost:5050/export-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDateTime,
          endDateTime,
          format: formData.format,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Export failed");
      }
  
      const blob = await response.blob();
      if (blob.size === 0) {
        alert("No data available for the selected range.");
        return;
      }
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export-${formData.startDate}-to-${formData.endDate}.${formData.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <NavbarComponent darkMode={darkMode} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900"
            : "bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${
              darkMode
                ? "bg-gray-800/30 border-gray-700/30"
                : "bg-white/30 border-gray-200/30"
            } rounded-2xl p-8 border backdrop-blur-xl shadow-2xl transition-all duration-300`}
          >
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="flex items-center mb-8"
            >
              <Icon
                icon="mdi:file-export"
                className={`w-8 h-8 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                } mr-4`}
              />
              <h1
                className={`text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Export Reports
              </h1>
            </motion.div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(1, 0)} 
                  className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} 
                    text-white py-2 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2`}
                >
                  <Icon icon="mdi:clock-time-one" className="w-5 h-5" />
                  Last Hour
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(24, 0)} 
                  className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
                    text-white py-2 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2`}
                >
                  <Icon icon="mdi:calendar-today" className="w-5 h-5" />
                  Last Day
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(48, 0)} 
                  className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
                    text-white py-2 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2`}
                >
                  <Icon icon="mdi:calendar-week" className="w-5 h-5" />
                  Last 2 Days
                </motion.button>
              </div>

              {/* Date and Time Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Icon icon="mdi:calendar-start" className="w-5 h-5 inline mr-2" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 focus:border-blue-500"
                        : "bg-white/50 border-gray-300 focus:border-blue-400"
                    }`}
                  />
                </motion.div>

                {/* Start Time */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Icon icon="mdi:clock-start" className="w-5 h-5 inline mr-2" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 focus:border-blue-500"
                        : "bg-white/50 border-gray-300 focus:border-blue-400"
                    }`}
                  />
                </motion.div>

                {/* End Date */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Icon icon="mdi:calendar-end" className="w-5 h-5 inline mr-2" />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 focus:border-blue-500"
                        : "bg-white/50 border-gray-300 focus:border-blue-400"
                    }`}
                  />
                </motion.div>

                {/* End Time */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <Icon icon="mdi:clock-end" className="w-5 h-5 inline mr-2" />
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600 focus:border-blue-500"
                        : "bg-white/50 border-gray-300 focus:border-blue-400"
                    }`}
                  />
                </motion.div>
              </div>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} 
                  text-white py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg font-semibold`}
              >
                <Icon icon={isExporting ? "mdi:loading" : "mdi:download"} className={`w-6 h-6 ${isExporting ? 'animate-spin' : ''}`} />
                {isExporting ? "Exporting..." : "Export Data"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default ExportReportsComponent;
