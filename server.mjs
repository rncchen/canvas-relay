import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyCommand, normalizeCanvasId, readScene } from "./lib/scene-store.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(ROOT, "public");
const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 4173);
const MAX_BODY_BYTES = 4 * 1024 * 1024;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("請求內容超過 4 MB 上限。");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function validOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  return origin === `http://${HOST}:${PORT}` || origin === `http://localhost:${PORT}`;
}

function canvasIdFromUrl(url) {
  return normalizeCanvasId(url.searchParams.get("canvas") || "default");
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${HOST}:${PORT}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const relativePath = path.normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.resolve(PUBLIC_DIR, `.${path.sep}${relativePath.replace(/^[/\\]/, "")}`);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'"
    });
    response.end(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("找不到頁面");
      return;
    }
    throw error;
  }
}

export function createCanvasRelayServer() {
  return http.createServer(async (request, response) => {
    try {
      if (!validOrigin(request)) {
        sendJson(response, 403, { error: "不允許的來源。" });
        return;
      }

      const url = new URL(request.url, `http://${HOST}:${PORT}`);
      if (request.method === "GET" && url.pathname === "/api/health") {
        sendJson(response, 200, { ok: true, service: "canvas-relay" });
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/scene") {
        sendJson(response, 200, await readScene(canvasIdFromUrl(url)));
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/commands") {
        const command = await readBody(request);
        command.author = { type: "human", name: command.author?.name || "你" };
        const result = await applyCommand(command, {
          authorType: "human",
          canvasId: canvasIdFromUrl(url)
        });
        sendJson(response, 200, result);
        return;
      }

      if (!["GET", "HEAD"].includes(request.method)) {
        response.writeHead(405, { Allow: "GET, HEAD, POST" });
        response.end();
        return;
      }

      await serveStatic(request, response);
    } catch (error) {
      const status = error.code === "REVISION_CONFLICT" ? 409 : 400;
      sendJson(response, status, { error: error.message || "發生未預期錯誤。" });
    }
  });
}

export function startCanvasRelayServer(options = {}) {
  const logger = options.logger || console.log;
  const server = createCanvasRelayServer();
  return new Promise((resolve, reject) => {
    const handleError = (error) => reject(error);
    server.once("error", handleError);
    server.listen(PORT, HOST, () => {
      server.off("error", handleError);
      logger(`Canvas Relay 已啟動：http://${HOST}:${PORT}`);
      resolve(server);
    });
  });
}

const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMainModule) {
  const server = await startCanvasRelayServer();
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => server.close(() => process.exit(0)));
  }
}
