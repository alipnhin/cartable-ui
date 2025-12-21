/**
 * Custom Next.js Server for IIS with iisnode
 * This file is the entry point for running Next.js in standalone mode on IIS
 *
 * Important: This file should be placed in the root directory with web.config
 */

const path = require("path");
const fs = require("fs");

// Determine environment
const isProduction = process.env.NODE_ENV === "production";

// IIS provides the port via process.env.PORT
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

console.log("=".repeat(60));
console.log("Starting Cartable UI Server");
console.log("=".repeat(60));
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`Hostname: ${hostname}`);
console.log(`Port: ${port}`);
console.log(`Process ID: ${process.pid}`);
console.log(`Node Version: ${process.version}`);
console.log(`Working Directory: ${process.cwd()}`);
console.log("=".repeat(60));

// Check if standalone build exists
const standaloneServerPath = path.join(
  __dirname,
  ".next",
  "standalone",
  "server.js"
);

if (isProduction && fs.existsSync(standaloneServerPath)) {
  console.log("✓ Using Next.js standalone build");
  console.log(`✓ Server path: ${standaloneServerPath}`);

  // Set required environment variables for standalone mode
  process.env.HOSTNAME = hostname;
  process.env.PORT = String(port);

  // Copy public and static files if needed
  const publicDir = path.join(__dirname, "public");
  const staticDir = path.join(__dirname, ".next", "static");
  const standalonePublic = path.join(
    __dirname,
    ".next",
    "standalone",
    "public"
  );
  const standaloneStatic = path.join(
    __dirname,
    ".next",
    "standalone",
    ".next",
    "static"
  );

  // Ensure public files are available in standalone directory
  if (fs.existsSync(publicDir) && !fs.existsSync(standalonePublic)) {
    console.log("Copying public directory to standalone build...");
    fs.cpSync(publicDir, standalonePublic, { recursive: true });
  }

  // Ensure static files are available
  if (fs.existsSync(staticDir) && !fs.existsSync(standaloneStatic)) {
    console.log("Copying static files to standalone build...");
    const standaloneNextDir = path.join(
      __dirname,
      ".next",
      "standalone",
      ".next"
    );
    if (!fs.existsSync(standaloneNextDir)) {
      fs.mkdirSync(standaloneNextDir, { recursive: true });
    }
    fs.cpSync(staticDir, standaloneStatic, { recursive: true });
  }

  // Load and execute standalone server
  try {
    require(standaloneServerPath);
    console.log("=".repeat(60));
    console.log("✓ Standalone server started successfully");
    console.log(`✓ Listening on http://${hostname}:${port}`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("✗ Error starting standalone server:", error);
    process.exit(1);
  }
} else {
  // Development mode or standalone not available
  if (isProduction && !fs.existsSync(standaloneServerPath)) {
    console.error("✗ Standalone build not found!");
    console.error(`✗ Expected at: ${standaloneServerPath}`);
    console.error("✗ Please run: npm run build");
    process.exit(1);
  }

  console.log("Using Next.js development server");

  const { createServer } = require("http");
  const { parse } = require("url");
  const next = require("next");

  const app = next({
    dev: !isProduction,
    hostname,
    port,
    dir: __dirname,
  });

  const handle = app.getRequestHandler();

  app
    .prepare()
    .then(() => {
      console.log("✓ Next.js application prepared successfully");

      const server = createServer(async (req, res) => {
        try {
          const parsedUrl = parse(req.url, true);
          await handle(req, res, parsedUrl);
        } catch (err) {
          console.error("Error handling request:", err);
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      });

      // Handle port already in use
      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.error(`✗ Port ${port} is already in use`);
          console.error(
            "✗ Please free the port or set a different PORT environment variable"
          );
          process.exit(1);
        } else {
          console.error("✗ Server error:", err);
          process.exit(1);
        }
      });

      server.listen(port, hostname, () => {
        console.log("=".repeat(60));
        console.log("✓ Server ready");
        console.log(`✓ Listening on http://${hostname}:${port}`);
        console.log(
          `✓ Environment: ${isProduction ? "production" : "development"}`
        );
        console.log("=".repeat(60));
      });
    })
    .catch((err) => {
      console.error("✗ Error preparing Next.js application:", err);
      process.exit(1);
    });
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing server");
  process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
