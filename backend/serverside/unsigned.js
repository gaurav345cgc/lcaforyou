const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers.js");
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// MongoDB connection
mongoose
  .connect("mongodb+srv://iamgaurav345:gaurav345@cluster0.guqlmjb.mongodb.net/modbus_database?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const modbusDataSchema = new mongoose.Schema(
    {
      tags: {
        type: Object,
        required: true,
      },
      timestamp: {
        type: String,
        required: true,
      },
    },
    { collection: "modbus_data" } // Specify the exact collection name here
  );
  
const ModbusData = mongoose.model("ModbusData", modbusDataSchema);

router.post("/register", async (req, res) => {
  const { email, password, firstname, lastname, username } = req.body;  // Changed here

  console.log(req.body);
  // Check for required fields
  if (!email || !password || !firstname || !lastname || !username) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if a user with the given email already exists
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res
      .status(403)
      .json({ error: "A user with this email already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // Log the hashed password

    const newUserData = {
      email,
      password: hashedPassword,
      firstname,
      lastname,
      username,
    };

    const newUser = await User.create(newUserData);

    const token = await getToken(email, newUser);

    // Create user object to return (excluding password)
    const userToReturn = { ...newUser.toJSON(), token };
    delete userToReturn.password;

    return res.status(200).json(userToReturn);
  } catch (error) {
    console.error("Error creating user:", error); // Log any error that occurs
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/login", async (req, res) => {
const { email, password } = req.body;

if (!email || !password) {
  return res.status(400).json({ error: "Email and password are required" });
}

const user = await User.findOne({ email: email });
if (!user) {
  return res.status(403).json({ error: "Invalid Credentials" });
}

try {
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(403).json({ error: "Invalid Credentials" });
  }

  const token = await getToken(email, user);
  const userToReturn = { ...user.toJSON(), token };
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
} catch (error) {
  console.error("Error during login:", error); // Log any error
  return res.status(500).json({ error: "Internal server error" });
}
});

app.get("/latest-data", async (req, res) => {
  try {
      const latestData = await ModbusData.findOne().sort({ _id: -1 }); // Fetch the latest document
      console.log("Latest Data:", latestData); // Log the latest data

      if (latestData) {
          res.json(latestData);
      } else {
          res.status(404).json({ message: "No data found" });
      }
  } catch (error) {
      console.error("Error fetching latest data:", error);
      res.status(500).json({ message: "Error fetching data", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});