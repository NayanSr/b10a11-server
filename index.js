const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//! Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.get('/', async (req, res) => {
    res.send('Running this server');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
