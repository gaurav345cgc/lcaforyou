import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";

const SettingsComponent = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dataRefreshRate, setDataRefreshRate] = useState(30);
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");

  useEffect(() => {
    // Apply dark mode class to document root when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
  };

  const handleRefreshRateChange = (e) => {
    setDataRefreshRate(parseInt(e.target.value));
  };

  const handleTemperatureUnitChange = (e) => {
    setTemperatureUnit(e.target.value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
        <div className="flex items-center space-x-4">
          <Icon icon="mdi:cog" className="w-6 h-6 dark:text-white" />
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Display Settings</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="dark:text-white">Dark Mode</span>
            <button
              onClick={handleDarkModeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                darkMode ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Notification Settings</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="dark:text-white">Enable Notifications</span>
            <button
              onClick={handleNotificationsToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notifications ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notifications ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Data Settings</h2>
          <div className="mb-4">
            <label className="block mb-2 dark:text-white">Data Refresh Rate (seconds)</label>
            <input
              type="number"
              value={dataRefreshRate}
              onChange={handleRefreshRateChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="5"
              max="300"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 dark:text-white">Temperature Unit</label>
            <select
              value={temperatureUnit}
              onChange={handleTemperatureUnitChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="celsius">Celsius</option>
              <option value="fahrenheit">Fahrenheit</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
