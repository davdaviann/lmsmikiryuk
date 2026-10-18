/**
 * Tiny zero-dependency static file server for local development.
 *
 *   node server.js            -> http://localhost:3000
 *   PORT=8080 node server.js  -> http://localhost:8080
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleSessionApi } = require("./session-api");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer(async (req, res) => {
  if (await handleSessionApi(req, res)) return;

  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (urlPath.split("/").includes(".data")) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("404 Not Found");
  }

  let filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);

  // Block path traversal outside the project folder.
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("403 Forbidden");
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.readFile(filePath, (readError, content) => {
      if (readError) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("404 Not Found");
      }

      const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";

      res.writeHead(200, {
        "Content-Type": type,
        "Cache-Control": "no-store" // always fresh while developing
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`MikirYuk is running at http://localhost:${PORT}`);
  console.log("Press Ctrl+C to stop.");
});
