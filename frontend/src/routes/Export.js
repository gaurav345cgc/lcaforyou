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
    endDate: "",
    endTime: "23:59",
    format: "csv",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuickSelect = (minutes) => {
    const endDate = new Date();
    const startDate = new Date(endDate - minutes * 60 * 1000);

    setFormData((prevState) => ({
      ...prevState,
      startDate: startDate.toISOString().split("T")[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split("T")[0],
      endTime: endDate.toTimeString().slice(0, 5),
    }));
  };

  const handleLast24Hours = () => {
    const endDate = new Date();
    const startDate = new Date(endDate - 24 * 60 * 60 * 1000);

    setFormData((prevState) => ({
      ...prevState,
      startDate: startDate.toISOString().split("T")[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split("T")[0],
      endTime: endDate.toTimeString().slice(0, 5),
    }));
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await fetch("http://localhost:8000/export-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDateTime: `${formData.startDate}T${formData.startTime}:00`,
          endDateTime: `${formData.endDate}T${formData.endTime}:00`,
          format: formData.format,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        alert("No data available for the selected range.");
        return;
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
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
    <NavbarComponent darkMode={darkMode}/>
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
              {/* Quick Select Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickSelect(15)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Last 15 min
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickSelect(30)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Last 30 min
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickSelect(90)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Last 90 min
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLast24Hours}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Last 24 hours
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border text-black ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-white/50 border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border text-black ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-white/50 border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border text-black ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-white/50 border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border text-black ${
                      darkMode
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-white/50 border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  />
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Export Format
                </label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border text-black ${
                    darkMode
                      ? "bg-gray-700/50 border-gray-600"
                      : "bg-white/50 border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                  <option value="pdf">PDF</option>
                </select>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full relative overflow-hidden group bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-96 group-hover:h-96 opacity-10"></span>
                <div className="flex items-center justify-center space-x-2">
                  {isExporting ? (
                    <>
                      <Icon
                        icon="eos-icons:loading"
                        className="animate-spin w-5 h-5"
                      />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:download" className="w-5 h-5" />
                      <span>Export Data</span>
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default ExportReportsComponent;
