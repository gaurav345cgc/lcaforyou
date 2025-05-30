const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const bcrypt = require("bcrypt");
const authRoutes = require("./routes/Auth");
const { getToken } = require("./utils/helpers.js");
const ModbusData = require("./models/ModbusData"); // Add this line to import ModbusData model
const { Parser } = require("json2csv"); // For CSV export
const XLSX = require("xlsx"); // For Excel export
const pdf = require("pdfkit"); // For PDF export
const fs = require("fs"); // File system to save files temporarily

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://iamgaurav345:gaurav345@cluster0.guqlmjb.mongodb.net/modbus_database?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

// JWT Strategy for Passport
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("./models/User");
const { timeStamp } = require("console");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "gaurav345", // Your JWT secret
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.sub);
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// Routes
app.use("/auth", authRoutes); // Auth routes
app.get("/", (req, res) => res.send("Hello World"));

// Route to fetch latest Modbus data
app.get("/latest-data", async (req, res) => {
  try {
    const latestData = await ModbusData.findOne().sort({ _id: -1 });
    latestData
      ? res.json(latestData)
      : res.status(404).json({ message: "No data found" });
    console.log(latestData);
  } catch (error) {
    console.error("Error fetching latest data:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// Export Data Route
app.post("/export-data", async (req, res) => {
  const { startDateTime, endDateTime, format } = req.body;
  try {
    const data = await ModbusData.find({
      timestamp: {
        $gte: "2024-11-01 20:49:22",
        $lte: "2024-11-01 20:59:22",
      },
    });
    console.log(data)
    
    if (!data.length) {
      return res.status(404).json({ message: "No data available for this range" });
    }

    if (format === "csv") {
      const json2csvParser = new Parser();
      const csvData = json2csvParser.parse(data);
      res.header("Content-Type", "text/csv");
      res.attachment(`export-${startDateTime}-${endDateTime}.csv`);
      res.send(csvData);

    } else if (format === "xlsx") {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data.map(item => item.toObject()));
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      res.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.attachment(`export-${startDateTime}-${endDateTime}.xlsx`);
      res.send(buffer);

    } else if (format === "pdf") {
      const doc = new pdf();
      res.header("Content-Type", "application/pdf");
      res.attachment(`export-${startDateTime}-${endDateTime}.pdf`);

      data.forEach((item) => {
        doc.text(`Timestamp: ${item.timestamp}`);
        doc.text(`Registers: ${JSON.stringify(item.registers)}`);
        doc.moveDown();
      });

      doc.end();
      doc.pipe(res);
    } else {
      res.status(400).json({ message: "Invalid format specified" });
    }

  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ message: "Export failed", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});