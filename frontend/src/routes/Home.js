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
import NavbarComponent from "../components/shared/Navbar";

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
      downloadFormat
    });
  };

  const setQuickDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setDateRange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
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
      
      <NavbarComponent/>
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
          </>
        )}
      </div>
    </div>
  );
};

export default HomeComponent;