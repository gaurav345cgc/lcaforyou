const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios"); // Use axios for HTTP requests
const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
mongoose
  .connect("mongodb+srv://iamgaurav345:gaurav345@cluster0.guqlmjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema and model for Modbus data
const modbusDataSchema = new mongoose.Schema({
  tags: {
    type: Object,
    required: true,
  },
  timestamp: {
    type: String, // Storing as string, or you can use Date if you prefer
    required: true,
  },
});


const ModbusData = mongoose.model("ModbusData", modbusDataSchema);

// New route to save and log Modbus data
app.post("/save-data", async (req, res) => {
  try {
    const { tags, timestamp } = req.body; // Destructure tags and timestamp from the incoming data

    // Create a new instance of ModbusData
    const newData = new ModbusData({ tags, timestamp });

    // Save to MongoDB
    await newData.save();

    // Log the data to the console
    console.log("Data saved successfully:", newData);

    res.status(201).json({ message: "Data saved successfully", data: newData });
  } catch (err) {
    console.error("Error saving data:", err.message);
    res.status(500).json({ message: "Error saving data", error: err.message });
  }
});

const fetchModbusDataFromAPI = async () => {
  try {
    const response = await axios.get("http://192.168.1.12:8080/modbus-data");

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



// API endpoint to fetch Modbus data directly from the main API
// API endpoint to fetch Modbus data directly from the main API
app.get("/fetch-data", async (req, res) => {
  const modbusData = await fetchModbusDataFromAPI(); // Fetch data from API

  if (modbusData) {
    // Save fetched data to MongoDB
    await axios.post("http://localhost:5000/save-data", modbusData); // Save both tags and timestamp

    console.log("Fetched and saved modbusData:", modbusData); // Log fetched and saved data
    res.json(modbusData); // Return the fetched data
  } else {
    res.status(404).json({ message: "No data read from API or data is empty" });
  }
});


// API endpoint to fetch all saved data
app.get("/fetch-all-data", async (req, res) => {
  try {
    const data = await ModbusData.find({}); // Fetch all saved data

    // Log the data fetched from the database
    console.log("Data fetched from MongoDB:", data);

    const convertedData = data.map((entry) => {
      return {
        tags: entry.tags, // Return tags directly as an object
        timestamp: entry.timestamp, // Include timestamp if you need to display it
      };
    });

    res.json(convertedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});


// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
