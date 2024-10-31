const ModbusRTU = require("modbus-serial");
const express = require("express");
const app = express();
const client = new ModbusRTU();
const serialPortPath = 'COM2'; // Adjust for your system

// Global flag to check if the client is connected
let isConnected = false;

// Function to connect to Modbus RTU
const connectModbus = async () => {
  try {
    if (!isConnected) {
      await client.connectRTUBuffered(serialPortPath, { baudRate: 9600, parity: 'none', stopBits: 1, dataBits: 8 });
      console.log("Connected to Modbus RTU over USB");
      isConnected = true; // Set flag to indicate connection is established
    }
  } catch (err) {
    console.error("Error connecting to Modbus:", err.message);
  }
};

// Initial connection to Modbus when server starts
connectModbus();

// API endpoint to read data from Modbus registers
app.get("/api/data", async (req, res) => {
  try {
    // Ensure the Modbus connection is open
    if (!isConnected) {
      await connectModbus();
    }

    // Read data from Modbus holding registers
    const data = await client.readHoldingRegisters(4294, 10); // Adjust address and length as needed
    console.log("Data received:", data.data);
    res.send({ data: data.data });
  } catch (err) {
    console.error("Error reading data:", err);
    res.status(500).send({ error: "Error reading data", details: err.message });
  }
});

// Start the API server
app.listen(3000, () => {
  console.log("API server listening on port 3000");
});

// Handle server shutdown gracefully
process.on('SIGINT', async () => {
  if (isConnected && client.isOpen) {
    await client.close();
    console.log("Serial port closed");
  }
  process.exit();
});
