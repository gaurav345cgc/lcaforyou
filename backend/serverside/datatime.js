const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection with error handling
mongoose
  .connect(
    "mongodb+srv://iamgaurav345:gaurav345@cluster0.guqlmjb.mongodb.net/modbus_database?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the application if there is a connection error
  });

// Log connection state changes for debugging
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

const reportSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    registers: Object,
  });
  
const Report = mongoose.model("Report", reportSchema);

app.post('/export-data', async (req, res) => {
    console.log("Request received at /export-data");
    console.log("Request body:", req.body);  // Log incoming data
    
    const { startDateTime, endDateTime } = req.body;

    if (!startDateTime || !endDateTime) {
        console.error("Missing date parameters");
        return res.status(400).json({ error: "Missing required date parameters" });
    }

    try {
        const reports = await Report.find({
            timestamp: {
                $gte: new Date(startDateTime),
                $lte: new Date(endDateTime)
            }
        });
    
        console.log("Retrieved reports:", reports); // Log the reports
    
        if (reports.length === 0) {
            console.log("No data found in specified range.");
            return res.status(404).json({ error: "No data found for specified date range" });
        }
    
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error in fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
});


  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
