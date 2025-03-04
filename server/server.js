//server.js file is the entry point for the server, while app.js is the main file for the express app
import app from './app.js';
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
