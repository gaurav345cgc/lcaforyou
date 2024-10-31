const ModbusRTU = require("modbus-serial");
const { SerialPort } = require("serialport");
const express = require("express");
const app = express();
const client = new ModbusRTU();
const serialPortPath = 'COM2'; 

let triggerValue = 0; // Initialize the trigger value

const readModbusData = async () => {
  try {
    // Connect to the Modbus RTU port
    await client.connectRTUBuffered(serialPortPath, { baudRate: 9600, parity: 'none', stopBits: 1, dataBits: 8 });
    console.log("Connected to Modbus RTU over USB");

    // Read from register 4298 (1 register) to check the trigger value
    const triggerdata = await client.readHoldingRegisters(4298, 1);
    triggerValue = trigger(triggerdata.data[0]); // Assign the value of the first register to triggerValue
    console.log("Trigger Value Set:", triggerValue);

    // Proceed to read other registers only if the trigger value is 2
    if (triggerValue === 2) {
      const data = await client.readHoldingRegisters(4308, 25); // Read 10 registers starting from 4294
      console.log("Data received from register 4294:", data.data);
    } else {
      console.log("Trigger value is not 2, skipping data fetch.");
    }
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
};

const trigger = (value) => {
  console.log("Trigger Function Called with Value:", value);
  return value; 
}


readModbusData();
