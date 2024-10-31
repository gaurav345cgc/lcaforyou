const mongoose = require("mongoose");

const modbusDataSchema = new mongoose.Schema(
  {
    tags: { type: Object, required: true },
    timestamp: { type: String, required: true },
  },
  { collection: "modbus_data" } // Collection name in MongoDB
);

module.exports = mongoose.model("ModbusData", modbusDataSchema);
