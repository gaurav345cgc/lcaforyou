const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Use axios for HTTP requests
const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Function to fetch Modbus data from Raspberry Pi server
const fetchModbusDataFromAPI = async () => {
  try {
    const response = await axios.get("http://192.168.1.15:8080/modbus-data");

    // Log the entire API response for debugging
    console.log("Full API response:", JSON.stringify(response.data, null, 2));

    // Check if registers exist
    if (response.data && response.data.registers) {
      const modbusData = {
        tags: response.data.registers, // Use registers directly as tags
        timestamp: response.data.timestamp, // Add the timestamp from the API response
      };

      return modbusData;
    } else {
      console.warn("Registers data not found in API response");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    return null;
  }
};

// API endpoint to fetch the latest Modbus data from Raspberry Pi
app.get("/fetch-data", async (req, res) => {
  const modbusData = await fetchModbusDataFromAPI(); // Fetch data from Raspberry Pi Modbus API

  if (modbusData) {
    console.log("Fetched modbusData:", modbusData); // Log fetched data
    res.json(modbusData); // Return the fetched data
  } else {
    res.status(404).json({ message: "No data read from API or data is empty" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
