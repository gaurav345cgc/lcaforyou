const ModbusRTU = require("modbus-serial");
const express = require("express");
const app = express();
const client = new ModbusRTU();
const serialPortPath = 'COM2'; 
let trigger = 0; 

const connectAndRead = async () => {
  if (trigger === 1) { 
    try {
      await client.connectRTUBuffered(serialPortPath, { baudRate: 9600, parity: 'none', stopBits: 1, dataBits: 8 });
      console.log("Connected to Modbus RTU over USB");

      const data = await client.readHoldingRegisters(4294, 10); 
      console.log("Data received:", data.data);

    } catch (err) {
      console.error("Error during Modbus operation:", err.message);
    } finally {
      try {
        if (client.isOpen) {
          await client.close();
          console.log("Serial port closed");
        }
      } catch (closeErr) {
        console.error("Error closing port:", closeErr.message);
      }
    }
  } else {
    console.log("Trigger is 0, not fetching data.");
  }
};

app.get("/set-trigger/:state", (req, res) => {
  const state = parseInt(req.params.state, 10); 
  if (state === 0 || state === 1) {
    trigger = state; 
    res.send(`Trigger is now set to ${trigger}`);
  } else {
    res.status(400).send("Invalid trigger value. Use 0 or 1.");
  }
});

app.get("/fetch-data", async (req, res) => {
  await connectAndRead();
  res.send("Data fetch attempted based on trigger state.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});