/**
 * Travel planning API client.
 * Connects to the Express backend which proxies to FastAPI.
 * Uses Server-Sent Events for real-time agent streaming.
 */

const API_BASE = "http://localhost:3001";

/**
 * Start a travel planning pipeline and stream agent updates.
 *
 * @param {string} query       — The user's travel request
 * @param {string} threadId    — Session thread ID for memory persistence
 * @param {object} callbacks   — Event handlers:
 *   onPipelineStart(data)     — Pipeline begins, receives list of agents
 *   onAgentUpdate(data)       — An agent completed, receives agent name + data
 *   onPipelineComplete(data)  — All agents done, receives full collected results
 *   onError(error)            — Error occurred
 * @returns {function}         — Abort function to cancel the stream
 */
export function streamTravelPlan(query, threadId, callbacks) {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(`${API_BASE}/api/travel/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, threadId }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        callbacks.onError?.(new Error(`Server error ${response.status}: ${errorText}`));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from the buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete last line

        let currentEvent = null;

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ") && currentEvent) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (currentEvent) {
                case "pipeline_start":
                  callbacks.onPipelineStart?.(data);
                  break;
                case "agent_update":
                  callbacks.onAgentUpdate?.(data);
                  break;
                case "pipeline_complete":
                  callbacks.onPipelineComplete?.(data);
                  break;
                case "pipeline_error":
                  callbacks.onError?.(new Error(data.error));
                  break;
              }
            } catch (parseErr) {
              // Non-JSON data line — skip
            }
            currentEvent = null;
          } else if (line.trim() === "") {
            currentEvent = null;
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        callbacks.onError?.(err);
      }
    }
  })();

  return () => controller.abort();
}

/**
 * Check the health of Express + AI services.
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE}/api/health`);
  return response.json();
}
