const express = require("express");   // Import express
const mongoose = require('mongoose'); // Import mongoose

const app = express();  // Define and initialize the express application

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/db_univ_ecom?directConnection=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the Express server AFTER successful MongoDB connection
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define your routes and middleware after defining `app`
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Example Modbus route
app.post('/save-data', async (req, res) => {
  // Handle data saving logic here
  res.send('Data saved');
});