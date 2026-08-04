import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test("negotiates MCP and changes the persistent scene", async (context) => {
  const dataDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "canvas-relay-protocol-"));
  const child = spawn(process.execPath, [path.join(root, "mcp.mjs")], {
    cwd: root,
    env: { ...process.env, CANVAS_RELAY_DATA_DIR: dataDirectory },
    stdio: ["pipe", "pipe", "pipe"]
  });
  context.after(async () => {
    child.kill();
    await fs.rm(dataDirectory, { recursive: true, force: true });
  });

  let buffer = "";
  const waiting = new Map();
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      const line = buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      if (line.trim()) {
        const message = JSON.parse(line);
        waiting.get(message.id)?.(message);
      }
      newline = buffer.indexOf("\n");
    }
  });

  function request(id, method, params = {}) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`MCP 回應逾時：${method}`)), 2000);
      waiting.set(id, (message) => {
        clearTimeout(timeout);
        waiting.delete(id);
        resolve(message);
      });
      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
    });
  }

  const initialized = await request(1, "initialize", {
    protocolVersion: "2025-11-25",
    capabilities: {},
    clientInfo: { name: "test-client", version: "1.0.0" }
  });
  assert.equal(initialized.result.protocolVersion, "2025-11-25");
  assert.equal(initialized.result.serverInfo.name, "canvas-relay");
  assert.ok(initialized.result.capabilities.tools);

  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`);
  const listed = await request(2, "tools/list");
  assert.ok(listed.result.tools.some((tool) => tool.name === "canvas_add_elements"));
  assert.ok(listed.result.tools.some((tool) => tool.name === "canvas_get_view"));

  const added = await request(3, "tools/call", {
    name: "canvas_add_elements",
    arguments: {
      author: { name: "Claude" },
      elements: [{ type: "rectangle", x: 80, y: 90, width: 320, height: 180, text: "AI 方框" }]
    }
  });
  assert.equal(added.result.isError, false);
  assert.equal(added.result.structuredContent.revision, 1);

  const scene = await request(4, "tools/call", { name: "canvas_get_scene", arguments: {} });
  assert.equal(scene.result.structuredContent.elements.length, 1);
  assert.deepEqual(scene.result.structuredContent.elements[0].createdBy, { type: "ai", name: "Claude" });

  const view = await request(5, "tools/call", { name: "canvas_get_view", arguments: {} });
  assert.equal(view.result.isError, false);
  assert.equal(view.result.structuredContent.mimeType, "image/svg+xml");
  assert.equal(view.result.structuredContent.elementCount, 1);
  const image = view.result.content.find((item) => item.type === "image");
  assert.equal(image.mimeType, "image/svg+xml");
  const svg = Buffer.from(image.data, "base64").toString("utf8");
  assert.match(svg, /^<svg /);
  assert.match(svg, /AI 方框/);

  const resources = await request(6, "resources/list");
  assert.ok(resources.result.resources.some((resource) => resource.uri === "canvas://view/current.svg"));
  const viewResource = await request(7, "resources/read", { uri: "canvas://view/current.svg" });
  assert.match(viewResource.result.contents[0].text, /^<svg /);
});
