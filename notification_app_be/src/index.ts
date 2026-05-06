import express from "express";
import dotenv from "dotenv";
import { initLogger, Log } from "../../logging_middleware/src";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize logger with your Bearer token at startup
initLogger(process.env.AUTH_TOKEN || "");

// Log app startup
Log("backend", "info", "config", "Notification backend app started successfully");

app.get("/health", async (req, res) => {
    await Log("backend", "info", "route", "Health check endpoint hit");
    res.json({ status: "ok" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});