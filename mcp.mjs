import readline from "node:readline";
import { applyCommand, elementTypes, getDataPaths, readScene } from "./lib/scene-store.mjs";
import { startCanvasRelayServer } from "./server.mjs";

const LATEST_PROTOCOL = "2025-11-25";
const SUPPORTED_PROTOCOLS = new Set([LATEST_PROTOCOL, "2025-06-18", "2025-03-26", "2024-11-05"]);
const DEFAULT_CANVAS_ID = process.env.CANVAS_RELAY_CANVAS_ID || "default";
const BROWSER_URL = `http://127.0.0.1:${Number(process.env.PORT || 4173)}`;

async function isCanvasRelayRunning() {
  try {
    const response = await fetch(`${BROWSER_URL}/api/health`, {
      signal: AbortSignal.timeout(1000)
    });
    if (!response.ok) return false;
    const body = await response.json();
    return body.ok === true && body.service === "canvas-relay";
  } catch {
    return false;
  }
}

async function ensureBrowserServer() {
  try {
    return await startCanvasRelayServer({
      logger: (message) => process.stderr.write(`${message}\n`)
    });
  } catch (error) {
    if (error.code === "EADDRINUSE" && await isCanvasRelayRunning()) {
      process.stderr.write(`Canvas Relay 沿用既有瀏覽器伺服器：${BROWSER_URL}\n`);
      return null;
    }
    process.stderr.write(`Canvas Relay 無法啟動瀏覽器伺服器：${error.message}\n`);
    return null;
  }
}

const browserServer = await ensureBrowserServer();

const authorSchema = {
  type: "object",
  description: "AI 助手身分。type 固定會儲存為 ai。",
  properties: {
    name: { type: "string", description: "顯示在畫布上的 AI 名稱，例如 Claude 或 Codex。" }
  }
};

const canvasIdSchema = {
  type: "string",
  description: "目前對話使用的畫布識別碼。不同工作階段應使用不同值，並在同一工作階段的所有工具呼叫中保持一致。",
  pattern: "^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$"
};

const elementSchema = {
  type: "object",
  required: ["type", "x", "y"],
  properties: {
    id: { type: "string", description: "可省略，伺服器會自動產生穩定識別碼。" },
    type: { type: "string", enum: elementTypes },
    x: { type: "number", description: "元素左上角或線段起點的畫布 X 座標。" },
    y: { type: "number", description: "元素左上角或線段起點的畫布 Y 座標。" },
    width: { type: "number" },
    height: { type: "number" },
    x2: { type: "number", description: "line 或 arrow 的終點 X 座標。" },
    y2: { type: "number", description: "line 或 arrow 的終點 Y 座標。" },
    points: {
      type: "array",
      description: "freehand 的絕對畫布座標點。",
      items: { type: "object", required: ["x", "y"], properties: { x: { type: "number" }, y: { type: "number" } } }
    },
    text: { type: "string" },
    stroke: { type: "string", description: "CSS 色彩，AI 預設為 #2459d3。" },
    fill: { type: "string", description: "CSS 色彩或 transparent。" },
    strokeWidth: { type: "number", minimum: 1, maximum: 16 },
    fontSize: { type: "number", minimum: 10, maximum: 120 },
    opacity: { type: "number", minimum: 0.05, maximum: 1 },
    rotation: { type: "number" },
    name: { type: "string", description: "框架或元素的簡短名稱。" }
  }
};

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function elementBounds(element) {
  if (element.type === "line" || element.type === "arrow") {
    return {
      x: Math.min(element.x, element.x2),
      y: Math.min(element.y, element.y2),
      width: Math.abs(element.x2 - element.x),
      height: Math.abs(element.y2 - element.y)
    };
  }
  if (element.type === "freehand") {
    const points = element.points || [];
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    return {
      x: Math.min(...xs, element.x),
      y: Math.min(...ys, element.y),
      width: Math.max(...xs, element.x) - Math.min(...xs, element.x),
      height: Math.max(...ys, element.y) - Math.min(...ys, element.y)
    };
  }
  return { x: element.x, y: element.y, width: element.width || 1, height: element.height || 1 };
}

function wrapText(text, width, fontSize) {
  const size = Math.max(10, fontSize || 18);
  const lineLength = Math.max(4, Math.floor(Math.max(40, width) / (size * 0.62)));
  return String(text || "").split("\n").flatMap((line) => {
    if (!line) return [""];
    const chunks = [];
    for (let offset = 0; offset < line.length; offset += lineLength) chunks.push(line.slice(offset, offset + lineLength));
    return chunks;
  }).slice(0, 30);
}

function svgText(element, bounds, options = {}) {
  if (!element.text) return "";
  const fontSize = Math.max(10, element.fontSize || 18);
  const x = options.center ? bounds.x + bounds.width / 2 : bounds.x + (options.padding ?? 12);
  const y = options.center ? bounds.y + bounds.height / 2 : bounds.y + (options.padding ?? 12) + fontSize;
  const anchor = options.center ? ' text-anchor="middle" dominant-baseline="middle"' : "";
  const lines = wrapText(element.text, Math.max(40, bounds.width - 24), fontSize);
  const tspans = lines.map((line, index) => `<tspan x="${x}" dy="${index ? fontSize * 1.28 : 0}">${escapeXml(line)}</tspan>`).join("");
  return `<text x="${x}" y="${y}" font-size="${fontSize}" fill="${escapeXml(options.color || element.stroke || "#20242c")}"${anchor}>${tspans}</text>`;
}

function svgElement(element, includeAuthors) {
  const bounds = elementBounds(element);
  const stroke = escapeXml(element.stroke || "#20242c");
  const fill = escapeXml(element.fill || "transparent");
  const strokeWidth = element.strokeWidth || 2;
  const transform = element.rotation ? ` transform="rotate(${element.rotation} ${bounds.x + bounds.width / 2} ${bounds.y + bounds.height / 2})"` : "";
  let shape = "";
  if (element.type === "rectangle" || element.type === "note") {
    shape = `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="${element.type === "note" ? 8 : 10}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>${svgText(element, bounds)}`;
  } else if (element.type === "ellipse") {
    shape = `<ellipse cx="${bounds.x + bounds.width / 2}" cy="${bounds.y + bounds.height / 2}" rx="${bounds.width / 2}" ry="${bounds.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>${svgText(element, bounds, { center: true })}`;
  } else if (element.type === "line" || element.type === "arrow") {
    shape = `<line x1="${element.x}" y1="${element.y}" x2="${element.x2}" y2="${element.y2}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"${element.type === "arrow" ? ' marker-end="url(#arrow-head)"' : ""}/>`;
  } else if (element.type === "freehand") {
    const points = (element.points || []).map((point) => `${point.x},${point.y}`).join(" ");
    shape = `<polyline points="${points}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (element.type === "frame") {
    shape = `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="10" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="10 7"/>${svgText({ ...element, text: element.text || element.name || "框架" }, bounds)}`;
  } else if (element.type === "text") {
    shape = svgText(element, bounds, { padding: 0 });
  }
  let author = "";
  if (includeAuthors) {
    const isAi = element.createdBy?.type === "ai";
    const label = escapeXml(element.createdBy?.name || (isAi ? "AI" : "人類"));
    const width = Math.max(48, label.length * 12 + 16);
    const y = Math.max(4, bounds.y - 26);
    author = `<g><rect x="${bounds.x}" y="${y}" width="${width}" height="20" rx="5" fill="${isAi ? "#e9efff" : "#edf0f4"}" stroke="${isAi ? "#6d8fe3" : "#aab1bd"}"/><text x="${bounds.x + 8}" y="${y + 14}" font-size="11" font-weight="700" fill="${isAi ? "#163b91" : "#444c58"}">${label}</text></g>`;
  }
  return `<g opacity="${element.opacity ?? 1}"${transform}>${shape}${author}</g>`;
}

function renderSceneSvg(scene, includeAuthors = true) {
  const elements = scene.composite?.elements || [];
  const bounds = elements.map(elementBounds);
  const padding = 80;
  const minX = bounds.length ? Math.max(0, Math.min(...bounds.map((item) => item.x)) - padding) : 0;
  const minY = bounds.length ? Math.max(0, Math.min(...bounds.map((item) => item.y)) - padding) : 0;
  const maxX = bounds.length ? Math.min(scene.canvas.width, Math.max(...bounds.map((item) => item.x + item.width)) + padding) : scene.canvas.width;
  const maxY = bounds.length ? Math.min(scene.canvas.height, Math.max(...bounds.map((item) => item.y + item.height)) + padding) : scene.canvas.height;
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const body = elements.map((element) => svgElement(element, includeAuthors)).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}"><defs><marker id="arrow-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#20242c"/></marker></defs><rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="#fffef9"/><g font-family="Segoe UI, Microsoft JhengHei, sans-serif">${body}</g></svg>`;
  return { svg, viewBox: { x: minX, y: minY, width, height }, elementCount: elements.length };
}

const tools = [
  {
    name: "canvas_get_scene",
    title: "讀取共編畫布",
    description: "讀取目前畫布的來源元素、修改與擦除效果、依建立者分類的合成結果、版本與活動紀錄。新增內容前應先呼叫此工具，避免覆蓋既有討論。",
    inputSchema: { type: "object", properties: { canvasId: canvasIdSchema } },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  },
  {
    name: "canvas_get_view",
    title: "查看共編畫布",
    description: "取得目前合成結果的 SVG 畫面，適合判斷版面、重疊、視覺密度與手繪內容。精確修改前仍應搭配 canvas_get_scene 取得元素識別碼與座標。",
    inputSchema: {
      type: "object",
      properties: {
        canvasId: canvasIdSchema,
        includeAuthors: { type: "boolean", description: "是否在元素旁顯示建立者標籤，預設為 true。" }
      }
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  },
  {
    name: "canvas_add_elements",
    title: "加入畫布元素",
    description: "批次加入文字、便條、方框、圓形、線、箭頭、手繪線或框架。座標使用固定畫布空間，適合一次畫完整示意。",
    inputSchema: {
      type: "object",
      required: ["elements"],
      properties: {
        canvasId: canvasIdSchema,
        author: authorSchema,
        detail: { type: "string", description: "這次修改的簡短目的，會顯示於活動紀錄。" },
        elements: { type: "array", minItems: 1, maxItems: 200, items: elementSchema }
      }
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false }
  },
  {
    name: "canvas_update_elements",
    title: "更新畫布元素",
    description: "由 AI 行為層疊加移動、縮放、改字或重新上色效果。來源元素與建立者保持不變，合成結果的最後編輯者會更新為目前 AI。",
    inputSchema: {
      type: "object",
      required: ["updates"],
      properties: {
        canvasId: canvasIdSchema,
        author: authorSchema,
        detail: { type: "string" },
        updates: {
          type: "array",
          minItems: 1,
          maxItems: 200,
          items: {
            type: "object",
            required: ["id", "changes"],
            properties: {
              id: { type: "string" },
              changes: { type: "object", additionalProperties: true }
            }
          }
        }
      }
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  },
  {
    name: "canvas_delete_elements",
    title: "擦除畫布元素",
    description: "加入可逆的 AI 擦除效果，讓指定元素退出目前合成結果。建立者篩選不會取消擦除；只有 canvas_undo 或後續復原操作會讓元素重新顯示。",
    inputSchema: {
      type: "object",
      required: ["ids"],
      properties: {
        canvasId: canvasIdSchema,
        author: authorSchema,
        detail: { type: "string" },
        ids: { type: "array", minItems: 1, maxItems: 200, items: { type: "string" } }
      }
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false }
  },
  {
    name: "canvas_undo",
    title: "復原畫布操作",
    description: "復原上一筆人類或 AI 的畫布操作。",
    inputSchema: { type: "object", properties: { canvasId: canvasIdSchema, author: authorSchema } },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false }
  },
  {
    name: "canvas_redo",
    title: "重做畫布操作",
    description: "重做上一筆被復原的畫布操作。",
    inputSchema: { type: "object", properties: { canvasId: canvasIdSchema, author: authorSchema } },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false }
  },
  {
    name: "canvas_clear",
    title: "清空畫布",
    description: "由 AI 行為層擦除目前全部可見元素，仍可用 canvas_undo 復原。只有使用者明確要求清空時才呼叫。",
    inputSchema: { type: "object", properties: { canvasId: canvasIdSchema, author: authorSchema, detail: { type: "string" } } },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false }
  }
];

function send(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function success(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function failure(id, code, message, data) {
  send({ jsonrpc: "2.0", id, error: { code, message, ...(data ? { data } : {}) } });
}

function toolResult(result) {
  return {
    content: [{ type: "text", text: `${result.message} 畫布版本為 ${result.scene.revision}。` }],
    structuredContent: {
      changed: result.changed,
      count: result.count || 0,
      canvasId: result.scene.canvasId,
      revision: result.scene.revision,
      updatedAt: result.scene.updatedAt
    },
    isError: false
  };
}

async function callTool(name, args = {}) {
  const author = { type: "ai", name: args.author?.name || "AI 助手" };
  const canvasId = args.canvasId || DEFAULT_CANVAS_ID;
  if (name === "canvas_get_scene") {
    const scene = await readScene(canvasId);
    return {
      content: [{ type: "text", text: JSON.stringify(scene, null, 2) }],
      structuredContent: scene,
      isError: false
    };
  }
  if (name === "canvas_get_view") {
    const scene = await readScene(canvasId);
    const view = renderSceneSvg(scene, args.includeAuthors !== false);
    return {
      content: [
        { type: "text", text: `畫布「${scene.canvas.name}」目前有 ${view.elementCount} 個可見元素，版本為 ${scene.revision}。` },
        { type: "image", data: Buffer.from(view.svg).toString("base64"), mimeType: "image/svg+xml" },
        { type: "resource", resource: { uri: "canvas://view/current.svg", mimeType: "image/svg+xml", text: view.svg } }
      ],
      structuredContent: {
        canvasId: scene.canvasId,
        revision: scene.revision,
        elementCount: view.elementCount,
        viewBox: view.viewBox,
        mimeType: "image/svg+xml"
      },
      isError: false
    };
  }
  if (name === "canvas_add_elements") return toolResult(await applyCommand({ action: "add", elements: args.elements, author, detail: args.detail }, { canvasId }));
  if (name === "canvas_update_elements") return toolResult(await applyCommand({ action: "update", updates: args.updates, author, detail: args.detail }, { canvasId }));
  if (name === "canvas_delete_elements") return toolResult(await applyCommand({ action: "delete", ids: args.ids, author, detail: args.detail }, { canvasId }));
  if (name === "canvas_undo") return toolResult(await applyCommand({ action: "undo", author }, { canvasId }));
  if (name === "canvas_redo") return toolResult(await applyCommand({ action: "redo", author }, { canvasId }));
  if (name === "canvas_clear") return toolResult(await applyCommand({ action: "clear", author, detail: args.detail }, { canvasId }));
  const error = new Error(`找不到工具：${name}`);
  error.code = -32602;
  throw error;
}

async function handle(message) {
  if (!message || message.jsonrpc !== "2.0") return;
  const { id, method, params = {} } = message;
  if (id === undefined) return;

  try {
    if (method === "initialize") {
      const requested = params.protocolVersion;
      const protocolVersion = SUPPORTED_PROTOCOLS.has(requested) ? requested : LATEST_PROTOCOL;
      success(id, {
        protocolVersion,
        capabilities: { tools: {}, resources: {} },
        serverInfo: {
          name: "canvas-relay",
          title: "Canvas Relay",
          version: "0.1.0",
          description: "讓人類與 AI 在持久化白板上延續討論。"
        },
        instructions: "每個對話先選定一個穩定且唯一的 canvasId，並在該對話的所有畫布工具呼叫中使用同一值，避免不同工作階段共用畫面。修改前先呼叫 canvas_get_scene；需要理解版面或手繪內容時呼叫 canvas_get_view。交付成品時以 includeAuthors=false 隱藏作者標籤；若有瀏覽器控制技能，再開啟對應的 http://127.0.0.1:4173/?canvas=<canvasId> 做實際檢視。除非使用者明確要求，請勿擦除或清空。"
      });
      return;
    }
    if (method === "ping") {
      success(id, {});
      return;
    }
    if (method === "tools/list") {
      success(id, { tools });
      return;
    }
    if (method === "tools/call") {
      success(id, await callTool(params.name, params.arguments || {}));
      return;
    }
    if (method === "resources/list") {
      success(id, {
        resources: [
          {
            uri: "canvas://scene/current",
            name: "目前畫布場景",
            description: "包含所有元素、作者與版本的 JSON 場景。",
            mimeType: "application/json"
          },
          {
            uri: "canvas://view/current.svg",
            name: "目前畫布畫面",
            description: "依目前合成結果產生的 SVG 畫面。",
            mimeType: "image/svg+xml"
          }
        ]
      });
      return;
    }
    if (method === "resources/read" && params.uri === "canvas://scene/current") {
      const scene = await readScene(DEFAULT_CANVAS_ID);
      success(id, { contents: [{ uri: params.uri, mimeType: "application/json", text: JSON.stringify(scene, null, 2) }] });
      return;
    }
    if (method === "resources/read" && params.uri === "canvas://view/current.svg") {
      const scene = await readScene(DEFAULT_CANVAS_ID);
      const view = renderSceneSvg(scene);
      success(id, { contents: [{ uri: params.uri, mimeType: "image/svg+xml", text: view.svg }] });
      return;
    }
    failure(id, -32601, `不支援的方法：${method}`);
  } catch (error) {
    if (method === "tools/call") {
      success(id, {
        content: [{ type: "text", text: error.message || "工具執行失敗。" }],
        isError: true
      });
      return;
    }
    failure(id, error.code || -32603, error.message || "內部錯誤");
  }
}

const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on("line", async (line) => {
  if (!line.trim()) return;
  try {
    await handle(JSON.parse(line));
  } catch (error) {
    process.stderr.write(`Canvas Relay 無法解析訊息：${error.message}\n`);
    failure(null, -32700, "無法解析 JSON-RPC 訊息");
  }
});

input.on("close", () => {
  if (browserServer) browserServer.close();
});

process.stderr.write(`Canvas Relay 預設畫布：${getDataPaths(DEFAULT_CANVAS_ID).scenePath}\n`);
