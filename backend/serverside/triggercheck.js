const ModbusRTU = require("modbus-serial");
const { SerialPort } = require("serialport");
const express = require("express");
const app = express();
const client = new ModbusRTU();
const serialPortPath = 'COM2'; 

let triggerValue = 0;

const connectAndReadtrigger = async () => {
  try {
    await client.connectRTUBuffered(serialPortPath, { baudRate: 9600, parity: 'none', stopBits: 1, dataBits: 8 });
    console.log("Connected to Modbus RTU over USB");

    const triggerdata = await client.readHoldingRegisters(4298, 1); // check 4298
    triggerValue = trigger(triggerdata.data[0]); // Pass the first register value to trigger
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
    console.log(value)
  return value; // Returning the value passed in the trigger function
}

const connectAndRead = async () => {
  const datatrig = trigger; // Use the triggerValue obtained from the previous call
  console.log("Trigger Value:", datatrig);

  if (datatrig === 2) { // Assuming you're checking if the trigger value is 1
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

connectAndReadtrigger();
connectAndRead();
