import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./database.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api", userRoutes);

// Start server independently of the database
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Connect to database independently of the server
connectDB()
  .then(() => console.log("Database connection established"))
  .catch((error) => {
    console.error("Database connection failed:", error);
    // Optional: decide if you want to exit the process or continue running the server
    // process.exit(1);
  });
