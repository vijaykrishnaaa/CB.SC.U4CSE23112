import express from "express";
import notificationRoutes from "./routes/notificationRoutes";
import { Log } from "./middleware/logger";

console.log("TOKEN LOADED:", process.env.AUTH_TOKEN ? process.env.AUTH_TOKEN.substring(0, 30) + "..." : "EMPTY");

const app = express();
app.use(express.json());
app.use("/api", notificationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await Log("backend", "info", "config", `Notification backend server started on port ${PORT}`);
    console.log(`Server running on http://localhost:${PORT}`);
});