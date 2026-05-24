require('dotenv').config(); // Must be at the very top!
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/api', (req, res) => {
    res.json({ message: "Trojan Horse backend is running!" });
});

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});