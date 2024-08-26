require('dotenv').config();
const express = require("express");
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose'); // Import Mongoose for MongoDB connection

const app = express(); // Initialize the Express application

app.use(cors());
app.use(bodyParser.json({ extended: false }));

// Import routes
const userRoutes = require('./routes/user.js');
const expenseRoutes = require('./routes/expense.js');
const purchaseRoutes = require('./routes/purchase.js');
const premiumFeatureRoutes = require('./routes/premium-feature.js');
const resetPasswordRoutes = require('./routes/reset-password.js');

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Define routes
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

// MongoDB connection setup
const uri = "mongodb+srv://priyanayakexpense:palak27som27@cluster0.ghteuep.mongodb.net/expensetracker?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
    .then((result) => {
        app.listen(3000);
        console.log("MongoDB connected successfully to EXPENSEWITHMONGO")
    })
    .catch(err => console.error("MongoDB connection error:", err));

// Start the server
