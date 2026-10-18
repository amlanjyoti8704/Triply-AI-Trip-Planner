/**
 * Travel planning routes.
 *
 * POST /api/travel/plan
 *   - Accepts { query, threadId }
 *   - Forwards to FastAPI /ai/plan
 *   - Streams back SSE events from the AI pipeline
 */

const express = require("express");
const router = express.Router();

router.post("/plan", async (req, res) => {
  const { query, threadId = "default_user" } = req.body;
  const AI_SERVICE_URL = req.app.locals.AI_SERVICE_URL;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Query is required" });
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
  res.flushHeaders();

  try {
    // Forward request to FastAPI AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/ai/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query.trim(),
        thread_id: threadId,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      res.write(
        `event: pipeline_error\ndata: ${JSON.stringify({
          error: `AI service returned ${aiResponse.status}: ${errorText}`,
        })}\n\n`
      );
      res.end();
      return;
    }

    // Stream SSE events from FastAPI → client
    const reader = aiResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);

      // Flush immediately for real-time streaming
      if (res.flush) res.flush();
    }

    res.end();
  } catch (error) {
    console.error("Error proxying to AI service:", error.message);

    // If headers already sent (SSE mode), send error event
    if (res.headersSent) {
      res.write(
        `event: pipeline_error\ndata: ${JSON.stringify({
          error: `Failed to connect to AI service: ${error.message}`,
        })}\n\n`
      );
      res.end();
    } else {
      res.status(502).json({
        error: "AI service unavailable",
        details: error.message,
      });
    }
  }
});

module.exports = router;
