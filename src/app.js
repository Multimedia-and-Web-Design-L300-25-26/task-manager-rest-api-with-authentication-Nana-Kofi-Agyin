import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// When running tests, load test env (do not connect here so tests exit cleanly)
if (process.env.NODE_ENV === "test") {
	dotenv.config({ path: ".env.test" });
}

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;