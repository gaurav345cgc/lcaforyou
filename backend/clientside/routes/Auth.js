const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { getToken } = require("../utils/helpers.js");
const router = express.Router();
const authenticateJWT = require("../utils/authMiddleware.js");

// Register Route


// In auth.js
router.get("/protected-route", authenticateJWT, (req, res) => {
    res.json({ message: "This is a protected route!", user: req.user });
  });
  
router.post("/register", async (req, res) => {
  const { email, password, firstname, lastname, username } = req.body;

  if (!email || !password || !firstname || !lastname || !username) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(403)
      .json({ error: "A user with this email already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      username,
    });
    const token = await getToken(email, newUser);
    const userToReturn = { ...newUser.toJSON(), token };
    delete userToReturn.password;
    res.status(200).json(userToReturn);
    x`x`;
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request:", req.body);
  
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found with this email.");
      return res.status(403).json({ error: "Invalid Credentials" });
    }
  
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("Password invalid for user:", email);
        return res.status(403).json({ error: "Invalid Credentials" });
      }
  
      const token = await getToken(email, user);
      const userToReturn = { ...user.toJSON(), token };
      delete userToReturn.password;
      return res.status(200).json(userToReturn);
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  


module.exports = router;
