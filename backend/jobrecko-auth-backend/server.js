// server.js (Main Express application file)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const { config } = require('dotenv');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const app = express();

 // Load environment variables from .env file

// --- Database Connection ---
const connectDB = async () => {
    try {
        // Replace with your MongoDB connection string
        //const mongoURI = ''; 
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};
connectDB();

// --- Middleware ---
app.use(cors()); // Allows cross-origin requests from your frontend
app.use(express.json({ extended: false })); // Body parser for JSON data

// Define API Routes
app.use('/api/jobs', require('./routes/api/jobs')); 
// Note: This connects /api/jobs/profile and /api/jobs/search


app.use('/api/auth', require('./routes/auth'));


// Simple test route
app.use('/api', (req, res) => res.send('JobRecko API Running'));

// --- Server Startup ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));