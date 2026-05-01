const express = require('express');
const cors = require('cors');
const path = require('path'); // Added for file paths
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/answers', require('./routes/answers'));

// 4. Serve Static Assets in Production
// This logic connects your 'client/dist' folder to your server
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Any route that is NOT an API route, load the index.html from client/dist
    app.get('/:path*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    // Basic root route for development testing
    app.get('/', (req, res) => {
        res.send('🚀 StackIt API is running in development mode...');
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // Changed to a generic message since localhost doesn't apply in the cloud
    console.log(`🚀 Server running on port ${PORT}`);
});