import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./db";
import routes from "./routes";
import { errorHandler } from "./middleware/errorMiddleware"; // <-- import here

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api", routes);

// Health Check
app.get("/", (req, res) => {
  res.send("HumVerse API is running...");
});

// Use centralized error middleware
app.use(errorHandler); // <-- replace inline handler with this

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
