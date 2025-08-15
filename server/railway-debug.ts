// Railway-specific debug server - absolute minimum
import express from "express";

console.log("=== RAILWAY DEBUG START ===");
console.log("Node version:", process.version);
console.log("Platform:", process.platform);
console.log("Environment variables:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- PORT:", process.env.PORT);
console.log("- HOST:", process.env.HOST);
console.log("- RAILWAY_ENVIRONMENT:", process.env.RAILWAY_ENVIRONMENT);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log("=== CREATING EXPRESS APP ===");

app.get("/", (req, res) => {
  console.log("Root request received");
  res.send("Railway debug server working!");
});

app.get("/health", (req, res) => {
  console.log("Health check received");
  res.json({ status: "railway-debug-ok", port: PORT });
});

console.log("=== STARTING SERVER ===");
console.log("Attempting to bind to port:", PORT);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("=== SERVER STARTED ===");
  console.log(`✅ Server listening on 0.0.0.0:${PORT}`);
  console.log("Server address:", server.address());
});

server.on("error", (error) => {
  console.error("=== SERVER ERROR ===");
  console.error("Error:", error);
  console.error("Error code:", error.code);
  console.error("Error message:", error.message);
});

console.log("=== SETUP COMPLETE ===");

// Keep process alive
setInterval(() => {
  console.log("Server still running on port", PORT);
}, 30000);