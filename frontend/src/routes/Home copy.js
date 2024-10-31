import { Icon } from "@iconify/react/dist/iconify.js";
import react from "react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomeComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [email, setEmail] = useState("");
  const [timeInterval, setTimeInterval] = useState("15min");
  const [downloadFormat, setDownloadFormat] = useState("csv");
  const [transformerStats, setTransformerStats] = useState({
    totalTransformers: 0,
    activeTransformers: 0,
    inactiveTransformers: 0,
    maintenanceRequired: 0,
  });
  const [modbusData, setModbusData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Fetch modbus data
    const fetchModbusData = async () => {
      try {
        const response = await fetch("http://localhost:8000/latest-data");
        const data = await response.json();

        // Transform the data into array format for table display
        const transformedData = [];
        if (data && data.registers) {
          // Change this line
          const timestamp = data.timestamp;
          Object.entries(data.registers).forEach(([tag, value]) => {
            // Change this line
            transformedData.push({
              tag: tag,
              value: value,
              timestamp: timestamp,
            });
          });
          setModbusData(transformedData);

          // Update chart data with clearer formatting
          const uniqueTags = [
            ...new Set(transformedData.map((item) => item.tag)),
          ];
          const datasets = uniqueTags.map((tag, index) => ({
            label: tag,
            data: transformedData
              .filter((item) => item.tag === tag)
              .map((item) => item.value),
            borderColor: `hsl(${(index * 360) / uniqueTags.length}, 70%, 50%)`,
            backgroundColor: `hsla(${
              (index * 360) / uniqueTags.length
            }, 70%, 50%, 0.1)`,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: `hsl(${
              (index * 360) / uniqueTags.length
            }, 70%, 50%)`,
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            tension: 0.3,
            fill: true,
          }));

          setChartData({
            labels: transformedData.map((item) => {
              // Format timestamp for better readability
              const date = new Date(item.timestamp);
              return date.toLocaleTimeString();
            }),
            datasets: datasets,
          });
        } else {
          setModbusData([]);
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching modbus data:", error);
        setModbusData([]);
      }
    };

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      // Simulated transformer data - replace with actual API call
      setTransformerStats({
        totalTransformers: 1234,
        activeTransformers: 987,
        inactiveTransformers: 247,
        maintenanceRequired: 45,
      });
    }, 1000);

    fetchModbusData();
    // Set up polling every 5 seconds
    const interval = setInterval(fetchModbusData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    // Handle export logic here
    console.log("Exporting data:", {
      dateRange,
      email,
      timeInterval,
      downloadFormat,
    });
  };

  const setQuickDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    setDateRange({
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: "easeInOutQuart",
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          padding: 10,
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: "Values",
          color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: "Time",
          color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: darkMode
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: darkMode ? "#fff" : "#000",
        bodyColor: darkMode ? "#fff" : "#000",
        borderColor: darkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        intersect: false,
        mode: "index",
      },
    },
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900"
          : "bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50"
      }`}
    >
      {/* Top Navigation Bar */}
      <nav
        className={`backdrop-blur-xl bg-opacity-90 ${
          darkMode
            ? "bg-gray-800/40 border-gray-700/50"
            : "bg-white/40 border-gray-200/50"
        } border-b sticky top-0 z-50 shadow-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="LCA Logo" className="h-10 w-10" />
              <h1
                className={`text-3xl font-extrabold bg-gradient-to-r ${
                  darkMode
                    ? "from-blue-400 via-purple-400 to-pink-400"
                    : "from-blue-600 via-purple-600 to-pink-600"
                } bg-clip-text text-transparent hover:scale-105 transition-transform duration-300`}
              >
                LCA Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl backdrop-blur-xl ${
                  darkMode
                    ? "bg-gray-700/30 text-white hover:bg-gray-600/30"
                    : "bg-gray-200/30 text-gray-900 hover:bg-gray-300/30"
                } transition-all duration-300 hover:scale-110 hover:rotate-12`}
              >
                <Icon
                  icon={darkMode ? "mdi:weather-sunny" : "mdi:weather-night"}
                  className="w-6 h-6"
                />
              </button>
              <div className="relative">
                <input
                  type="text"
                  className={`${
                    darkMode
                      ? "bg-gray-700/30 text-white"
                      : "bg-gray-200/30 text-gray-900"
                  } px-6 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 backdrop-blur-xl w-64 placeholder-opacity-70`}
                  placeholder="Search..."
                />
              </div>
              <button
                className={`p-3 rounded-xl backdrop-blur-xl ${
                  darkMode
                    ? "bg-gray-700/30 text-white hover:bg-gray-600/30"
                    : "bg-gray-200/30 text-gray-900 hover:bg-gray-300/30"
                } transition-all duration-300 hover:scale-110`}
              >
                <Icon icon="mdi:bell" className="w-6 h-6" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`w-12 h-12 rounded-xl ${
                    darkMode
                      ? "bg-gray-600/30 hover:bg-gray-500/30"
                      : "bg-gray-200/30 hover:bg-gray-300/30"
                  } flex items-center justify-center transition-all duration-300 backdrop-blur-xl hover:scale-110`}
                >
                  <Icon
                    icon="mdi:user"
                    className={`w-6 h-6 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  />
                </button>

                {showUserMenu && (
                  <div
                    className={`absolute right-0 mt-4 w-64 ${
                      darkMode
                        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900"
                        : "bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50"
                    } backdrop-blur-lg rounded-2xl shadow-2xl py-1 border ${
                      darkMode ? "border-gray-700/50" : "border-gray-200/50"
                    } transition-all duration-300`}
                  >
                    <div
                      className={`px-6 py-4 border-b ${
                        darkMode ? "border-gray-700/50" : "border-gray-200/50"
                      }`}
                    >
                      <p
                        className={`text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        LCA Industrail Solutions
                      </p>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Enterprise Solutions
                      </p>
                    </div>
                    <a
                      href="#"
                      className={`block px-6 py-3 text-sm ${
                        darkMode
                          ? "text-white hover:bg-gray-800/50"
                          : "text-gray-900 hover:bg-gray-200/50"
                      } transition-colors duration-200`}
                    >
                      Company Profile
                    </a>
                    <a
                      href="#"
                      className={`block px-6 py-3 text-sm ${
                        darkMode
                          ? "text-white hover:bg-gray-800/50"
                          : "text-gray-900 hover:bg-gray-200/50"
                      } transition-colors duration-200`}
                    >
                      Settings
                    </a>
                    <div
                      className={`border-t ${
                        darkMode ? "border-gray-700/50" : "border-gray-200/50"
                      }`}
                    >
                      <button
                        className={`w-full text-left px-6 py-3 text-sm ${
                          darkMode
                            ? "text-red-400 hover:bg-gray-800/50"
                            : "text-red-600 hover:bg-gray-200/50"
                        } transition-all duration-200`}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className={`flex space-x-6 border-b ${
            darkMode ? "border-gray-700/50" : "border-gray-200/50"
          }`}
        >
          {["overview", "assets", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 relative ${
                activeTab === tab
                  ? `${darkMode ? "text-blue-400" : "text-blue-600"}`
                  : `${
                      darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {[
                    {
                      title: "Total Transformers",
                      value: transformerStats.totalTransformers,
                      icon: "mdi:transformer",
                      color: "from-blue-500 via-blue-400 to-blue-600",
                    },
                    {
                      title: "Active Transformers",
                      value: transformerStats.activeTransformers,
                      icon: "mdi:power",
                      color: "from-green-500 via-green-400 to-emerald-600",
                    },
                    {
                      title: "Inactive Transformers",
                      value: transformerStats.inactiveTransformers,
                      icon: "mdi:power-off",
                      color: "from-yellow-500 via-yellow-400 to-orange-600",
                    },
                    {
                      title: "Maintenance Required",
                      value: transformerStats.maintenanceRequired,
                      icon: "mdi:tools",
                      color: "from-red-500 via-red-400 to-rose-600",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`${
                        darkMode
                          ? "bg-gray-800/30 border-gray-700/30"
                          : "bg-white/30 border-gray-200/30"
                      } rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 border backdrop-blur-xl hover:shadow-2xl group`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-6">
                          <p
                            className={`${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            } text-sm font-medium`}
                          >
                            {stat.title}
                          </p>
                          <p
                            className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent text-3xl font-bold mt-3`}
                          >
                            {stat.value.toLocaleString()}
                          </p>
                        </div>
                        <div
                          className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl group-hover:rotate-12 transition-transform duration-300`}
                        >
                          <Icon
                            icon={stat.icon}
                            className="w-8 h-8 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
                  <div
                    className={`${
                      darkMode
                        ? "bg-gray-800/30 border-gray-700/30"
                        : "bg-white/30 border-gray-200/30"
                    } rounded-2xl p-8 border backdrop-blur-xl hover:shadow-2xl transition-all duration-300 group`}
                  >
                    <h2
                      className={`${
                        darkMode ? "text-white" : "text-gray-900"
                      } text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}
                    >
                      Modbus Data
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700/30">
                        <thead>
                          <tr>
                            <th
                              className={`px-4 py-3 text-left text-sm font-medium ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              } uppercase tracking-wider`}
                            >
                              Tag
                            </th>
                            <th
                              className={`px-4 py-3 text-left text-sm font-medium ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              } uppercase tracking-wider`}
                            >
                              Value
                            </th>
                            <th
                              className={`px-4 py-3 text-left text-sm font-medium ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              } uppercase tracking-wider`}
                            >
                              Timestamp
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${
                            darkMode
                              ? "divide-gray-700/30"
                              : "divide-gray-200/30"
                          }`}
                        >
                          {modbusData.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={`${
                                darkMode
                                  ? "hover:bg-gray-700/30"
                                  : "hover:bg-gray-50/30"
                              } transition-colors duration-300`}
                            >
                              <td
                                className={`px-4 py-3 whitespace-nowrap text-sm ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {row.tag}
                              </td>
                              <td
                                className={`px-4 py-3 whitespace-nowrap text-sm ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {row.value}
                              </td>
                              <td
                                className={`px-4 py-3 whitespace-nowrap text-sm ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {row.timestamp}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className={`${
                      darkMode
                        ? "bg-gray-800/30 border-gray-700/30"
                        : "bg-white/30 border-gray-200/30"
                    } rounded-2xl p-8 border backdrop-blur-xl hover:shadow-2xl transition-all duration-300 group`}
                  >
                    <h2
                      className={`${
                        darkMode ? "text-white" : "text-gray-900"
                      } text-2xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}
                    >
                      Usage Metrics
                    </h2>
                    <div className="h-72">
                      {chartData.datasets.length > 0 && (
                        <Line data={chartData} options={chartOptions} />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "assets" && (
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800/30 border-gray-700/30"
                    : "bg-white/30 border-gray-200/30"
                } rounded-2xl p-8 border backdrop-blur-xl hover:shadow-2xl transition-all duration-300`}
              >
                <h2
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } text-2xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}
                >
                  Active Transformers
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700/30">
                    <thead>
                      <tr>
                        <th
                          className={`px-8 py-4 text-left text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } uppercase tracking-wider`}
                        >
                          Transformer ID
                        </th>
                        <th
                          className={`px-8 py-4 text-left text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } uppercase tracking-wider`}
                        >
                          Name
                        </th>
                        <th
                          className={`px-8 py-4 text-left text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } uppercase tracking-wider`}
                        >
                          Status
                        </th>
                        <th
                          className={`px-8 py-4 text-left text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } uppercase tracking-wider`}
                        >
                          Last Updated
                        </th>
                        <th
                          className={`px-8 py-4 text-left text-sm font-medium ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          } uppercase tracking-wider`}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-gray-700/30" : "divide-gray-200/30"
                      }`}
                    >
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <tr
                          key={index}
                          className={`${
                            darkMode
                              ? "hover:bg-gray-700/30"
                              : "hover:bg-gray-50/30"
                          } transition-colors duration-300`}
                        >
                          <td
                            className={`px-8 py-6 whitespace-nowrap text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            TRF-{1000 + index}
                          </td>
                          <td
                            className={`px-8 py-6 whitespace-nowrap text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Transformer {index + 1}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className="px-4 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                              Active
                            </span>
                          </td>
                          <td
                            className={`px-8 py-6 whitespace-nowrap text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            2 hours ago
                          </td>
                          <td className={`px-8 py-6 whitespace-nowrap text-sm`}>
                            <button className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:from-blue-400 hover:to-purple-400 transition-all duration-300 font-medium">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800/30 border-gray-700/30"
                    : "bg-white/30 border-gray-200/30"
                } rounded-2xl p-8 border backdrop-blur-xl hover:shadow-2xl transition-all duration-300`}
              >
                <h2
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } text-2xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}
                >
                  Export Reports
                </h2>
                <div className="space-y-6">
                  {/* Quick Date Range Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Last 24 Hours", days: 1 },
                      { label: "Last 7 Days", days: 7 },
                      { label: "Last 15 Days", days: 15 },
                      { label: "Last 30 Days", days: 30 },
                    ].map((range) => (
                      <button
                        key={range.days}
                        onClick={() => setQuickDateRange(range.days)}
                        className={`px-4 py-2 rounded-xl ${
                          darkMode
                            ? "bg-gray-700/30 hover:bg-gray-600/30 text-white"
                            : "bg-gray-200/30 hover:bg-gray-300/30 text-gray-900"
                        } transition-all duration-300`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-3`}
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        className={`${
                          darkMode
                            ? "bg-gray-700/30 text-black"
                            : "bg-gray-100/30 text-gray-900"
                        } px-6 py-3 rounded-xl w-full backdrop-blur-xl focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 border ${
                          darkMode ? "border-gray-700/30" : "border-gray-200/30"
                        }`}
                        value={dateRange.startDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        } mb-3`}
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        className={`${
                          darkMode
                            ? "bg-gray-700/30 text-black"
                            : "bg-gray-100/30 text-gray-900"
                        } px-6 py-3 rounded-xl w-full backdrop-blur-xl focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 border ${
                          darkMode ? "border-gray-700/30" : "border-gray-200/30"
                        }`}
                        value={dateRange.endDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 font-medium text-lg shadow-lg"
                  >
                    Export Report
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomeComponent;
