//server.js file is the entry point for the server, while app.js is the main file for the express app
import app from './app.js';
import connectDB from './database.js';

const port = process.env.PORT || 3000;

// Start server independently of the database
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Connect to database independently of the server
connectDB()
    .then(() => console.log('Database connection established'))
    .catch((error) => {
        console.error('Database connection failed:', error);
        // Optional: decide if you want to exit the process or continue running the server
        // process.exit(1);
    });
