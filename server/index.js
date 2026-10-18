/**
 * Triply Express.js Backend
 *
 * Acts as the main API gateway:
 *   - POST /api/travel/plan  →  proxies SSE stream from FastAPI
 *   - GET  /api/health       →  combined health check
 *
 * The Express server does NOT run any AI logic itself.
 * It forwards requests to the Python FastAPI AI service and relays
 * the Server-Sent Events stream back to the React client.
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const travelRoutes = require("./routes/travel");

// Support root .env or server/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const app = express();
const PORT = process.env.EXPRESS_PORT || 3001;

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// ── Middleware ───────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

// Make AI_SERVICE_URL available to routes
app.locals.AI_SERVICE_URL = AI_SERVICE_URL;

// ── Routes ──────────────────────────────────────────────────────────────────

app.use("/api/travel", travelRoutes);

// Health check
app.get("/api/health", async (_req, res) => {
  let aiStatus = "unreachable";
  try {
    const resp = await fetch(`${AI_SERVICE_URL}/ai/health`);
    if (resp.ok) {
      const data = await resp.json();
      aiStatus = data.status;
    }
  } catch {
    // AI service is down — report it but don't crash
  }

  res.json({
    status: "ok",
    service: "triply-express-server",
    ai_service: aiStatus,
    timestamp: new Date().toISOString(),
  });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🌐 Express server running on http://localhost:${PORT}`);
  console.log(`🤖 AI service expected at ${AI_SERVICE_URL}`);
  console.log(`📡 Travel API: http://localhost:${PORT}/api/travel/plan\n`);
});
