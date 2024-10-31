const ModbusRTU = require("modbus-serial");

// Create a Modbus client instance
const client = new ModbusRTU();

// Define the serial port path (adjust for your system)
const serialPortPath = '/dev/ttyUSB0'; // For Linux
// const serialPortPath = 'COM3'; // For Windows

const connectAndReadModbusASCII = async () => {
  try {
    // Connect to Modbus using ASCII mode via the serial port
    await client.connectAsciiSerial(serialPortPath, { 
      baudRate: 9600,    // Adjust as needed
      parity: 'none',    // Parity: 'none', 'even', or 'odd'
      stopBits: 1,       // Stop bits, typically 1 or 2
      dataBits: 7       // Data bits, typically 8
    });
    console.log("Connected to Modbus ASCII over USB");

    // Read data from Modbus registers (example: read 10 holding registers starting from address 0)
    const data = await client.readHoldingRegisters(0, 10); 
    console.log("Data received:", data.data);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    // Ensure the serial port is closed when done
    if (client.isOpen) {
      try {
        await client.close();
        console.log("Serial port closed");
      } catch (closeErr) {
        console.error("Error closing port:", closeErr.message);
      }
    }
  }
};

connectAndReadModbusASCII();
