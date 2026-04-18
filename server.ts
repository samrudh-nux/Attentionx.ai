import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing and size limits for video info (though we'll use client-side Gemini)
  app.use(express.json({ limit: "50mb" }));

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "operational", 
      version: "1.5.0-flash",
      cluster: "A100-REGION-ALPHA",
      uptime: process.uptime()
    });
  });

  // Simulated AI Task Registry for Full-Stack consistency
  app.post("/api/tasks/register", (req, res) => {
    const taskId = `tx_${Math.random().toString(36).substr(2, 9)}`;
    res.json({ taskId, status: "queued", heartbeat: 1500 });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 AttentionX Server running at http://localhost:${PORT}`);
  });
}

startServer();
