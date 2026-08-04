import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATA_DIR = path.resolve(process.env.CANVAS_RELAY_DATA_DIR || path.join(ROOT, "data"));
const DEFAULT_CANVAS_ID = "default";
const MAX_HISTORY = 100;
const MAX_ACTIVITY = 80;

const DEFAULT_CANVAS = {
  name: "共編畫布",
  width: 3200,
  height: 2000,
  background: "#f7f8fa"
};

const ELEMENT_TYPES = new Set([
  "rectangle",
  "ellipse",
  "text",
  "note",
  "line",
  "arrow",
  "freehand",
  "frame"
]);

const CHANGEABLE_FIELDS = new Set([
  "x",
  "y",
  "width",
  "height",
  "x2",
  "y2",
  "points",
  "text",
  "stroke",
  "fill",
  "strokeWidth",
  "fontSize",
  "opacity",
  "rotation",
  "name"
]);

function now() {
  return new Date().toISOString();
}

function clone(value) {
  return structuredClone(value);
}

export function normalizeCanvasId(value = DEFAULT_CANVAS_ID) {
  const canvasId = String(value || DEFAULT_CANVAS_ID).trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(canvasId)) {
    const error = new Error("畫布識別碼只能使用英文字母、數字、句點、底線與連字號，長度上限為 80 個字元。");
    error.code = "INVALID_CANVAS_ID";
    throw error;
  }
  return canvasId;
}

function canvasPaths(canvasId = DEFAULT_CANVAS_ID) {
  const normalized = normalizeCanvasId(canvasId);
  const dataDir = normalized === DEFAULT_CANVAS_ID
    ? DATA_DIR
    : path.join(DATA_DIR, "canvases", normalized);
  return {
    canvasId: normalized,
    dataDir,
    scenePath: path.join(dataDir, "scene.json"),
    historyPath: path.join(dataDir, "history.json"),
    lockPath: path.join(dataDir, ".scene.lock")
  };
}

function defaultScene(canvasId = DEFAULT_CANVAS_ID) {
  const timestamp = now();
  return {
    schemaVersion: 2,
    canvasId: normalizeCanvasId(canvasId),
    revision: 0,
    updatedAt: timestamp,
    canvas: clone(DEFAULT_CANVAS),
    elements: [],
    effects: [],
    activity: []
  };
}

function defaultHistory() {
  return { past: [], future: [] };
}

function normalizeAuthor(author, fallbackType = "ai") {
  const type = ["human", "ai"].includes(author?.type) ? author.type : fallbackType;
  return {
    type,
    name: String(author?.name || (type === "human" ? "使用者" : "AI 助手")).slice(0, 80)
  };
}

function finite(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizePoints(points) {
  if (!Array.isArray(points)) return [];
  return points.slice(0, 4000).map((point) => ({
    x: finite(point?.x, 0),
    y: finite(point?.y, 0)
  }));
}

function normalizeElement(input, author, existing = null) {
  if (!ELEMENT_TYPES.has(input?.type)) {
    throw new Error(`不支援的元素類型：${String(input?.type || "空白")}`);
  }

  const createdBy = existing?.createdBy || normalizeAuthor(author);
  const timestamp = now();
  const element = {
    id: existing?.id || String(input.id || randomUUID()),
    type: input.type,
    x: finite(input.x, 0),
    y: finite(input.y, 0),
    width: Math.max(1, finite(input.width, input.type === "text" ? 240 : 160)),
    height: Math.max(1, finite(input.height, input.type === "text" ? 48 : 100)),
    text: String(input.text || "").slice(0, 10000),
    stroke: String(input.stroke || (createdBy.type === "ai" ? "#2459d3" : "#20242c")),
    fill: String(input.fill ?? "transparent"),
    strokeWidth: Math.min(16, Math.max(1, finite(input.strokeWidth, 2))),
    fontSize: Math.min(120, Math.max(10, finite(input.fontSize, input.type === "note" ? 18 : 20))),
    opacity: Math.min(1, Math.max(0.05, finite(input.opacity, 1))),
    rotation: finite(input.rotation, 0),
    createdBy,
    createdAt: existing?.createdAt || timestamp,
    lastEditedBy: normalizeAuthor(author, createdBy.type),
    updatedAt: timestamp
  };

  if (["line", "arrow"].includes(input.type)) {
    element.x2 = finite(input.x2, element.x + element.width);
    element.y2 = finite(input.y2, element.y + element.height);
  }

  if (input.type === "freehand") {
    element.points = normalizePoints(input.points);
  }

  if (input.name) element.name = String(input.name).slice(0, 160);
  return element;
}

function sanitizeChanges(changes) {
  const safe = {};
  for (const [key, value] of Object.entries(changes || {})) {
    if (!CHANGEABLE_FIELDS.has(key)) continue;
    if (key === "points") {
      safe.points = normalizePoints(value);
    } else if (["x", "y", "x2", "y2", "rotation"].includes(key)) {
      safe[key] = finite(value, 0);
    } else if (["width", "height"].includes(key)) {
      safe[key] = Math.max(1, finite(value, 1));
    } else if (key === "strokeWidth") {
      safe[key] = Math.min(16, Math.max(1, finite(value, 2)));
    } else if (key === "fontSize") {
      safe[key] = Math.min(120, Math.max(10, finite(value, 20)));
    } else if (key === "opacity") {
      safe[key] = Math.min(1, Math.max(0.05, finite(value, 1)));
    } else {
      safe[key] = String(value ?? "").slice(0, key === "text" ? 10000 : 160);
    }
  }
  return safe;
}

function composeScene(scene, activeLayers = ["human", "ai"]) {
  const active = new Set(activeLayers);
  const byId = new Map();
  for (const source of scene.elements || []) {
    byId.set(source.id, clone(source));
  }

  const erasedBy = new Map();
  for (const effect of scene.effects || []) {
    if (effect.type === "update") {
      const element = byId.get(effect.targetId);
      if (!element) continue;
      Object.assign(element, clone(effect.changes || {}), {
        lastEditedBy: clone(effect.author),
        updatedAt: effect.at
      });
    } else if (effect.type === "erase") {
      for (const id of effect.targetIds || []) {
        if (!byId.has(id)) continue;
        const authors = erasedBy.get(id) || [];
        authors.push(clone(effect.author));
        erasedBy.set(id, authors);
      }
    }
  }

  return {
    elements: [...byId.values()].filter((element) =>
      !erasedBy.has(element.id) && active.has(element.createdBy?.type || "human")
    ),
    erased: [...erasedBy.entries()].map(([elementId, authors]) => ({ elementId, authors }))
  };
}

function enrichScene(scene) {
  const composite = composeScene(scene);
  return {
    ...scene,
    layers: {
      semantics: "current-result-by-creator",
      human: {
        name: "人類繪製",
        elementIds: composite.elements.filter((element) => (element.createdBy?.type || "human") === "human").map((element) => element.id)
      },
      ai: {
        name: "AI 繪製",
        elementIds: composite.elements.filter((element) => element.createdBy?.type === "ai").map((element) => element.id)
      }
    },
    composite
  };
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return clone(fallback);
    throw error;
  }
}

async function writeJsonAtomic(filePath, value) {
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    for (let attempt = 0; ; attempt += 1) {
      try {
        await fs.rename(temporaryPath, filePath);
        break;
      } catch (error) {
        const transient = ["EPERM", "EBUSY", "EACCES"].includes(error.code);
        if (!transient || attempt >= 6) throw error;
        // Windows 同步資料夾可能短暫鎖住目標檔，保留原子替換並等待鎖定解除。
        await new Promise((resolve) => setTimeout(resolve, Math.min(400, 25 * 2 ** attempt)));
      }
    }
  } finally {
    await fs.unlink(temporaryPath).catch(() => {});
  }
}

async function acquireLock(paths) {
  await fs.mkdir(paths.dataDir, { recursive: true });
  const startedAt = Date.now();

  while (true) {
    try {
      const handle = await fs.open(paths.lockPath, "wx");
      await handle.writeFile(`${process.pid}\n${now()}\n`, "utf8");
      return async () => {
        await handle.close();
        await fs.unlink(paths.lockPath).catch(() => {});
      };
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      if (Date.now() - startedAt > 3000) {
        const stat = await fs.stat(paths.lockPath).catch(() => null);
        if (stat && Date.now() - stat.mtimeMs > 10000) {
          await fs.unlink(paths.lockPath).catch(() => {});
          continue;
        }
        throw new Error("畫布目前正忙碌，請稍後再試。");
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }
}

function describeAction(action, count = 0) {
  const labels = {
    add: `新增 ${count} 個元素`,
    update: `更新 ${count} 個元素`,
    delete: `擦除 ${count} 個元素`,
    clear: "以目前行為層擦除全部可見內容",
    replace: "取代畫布內容",
    rename: "重新命名畫布",
    undo: "復原上一步",
    redo: "重做上一步"
  };
  return labels[action] || action;
}

function addActivity(scene, action, author, count, detail) {
  scene.activity = [
    ...(scene.activity || []),
    {
      id: randomUUID(),
      revision: scene.revision,
      action,
      summary: detail || describeAction(action, count),
      author: normalizeAuthor(author),
      at: scene.updatedAt
    }
  ].slice(-MAX_ACTIVITY);
}

async function loadSceneUnsafe(paths) {
  const fallback = defaultScene(paths.canvasId);
  const scene = await readJson(paths.scenePath, fallback);
  return {
    ...fallback,
    ...scene,
    schemaVersion: 2,
    canvasId: paths.canvasId,
    canvas: { ...DEFAULT_CANVAS, ...(scene.canvas || {}) },
    elements: Array.isArray(scene.elements) ? scene.elements : [],
    effects: Array.isArray(scene.effects) ? scene.effects : [],
    activity: Array.isArray(scene.activity) ? scene.activity : []
  };
}

export async function readScene(canvasId = DEFAULT_CANVAS_ID) {
  const paths = canvasPaths(canvasId);
  await fs.mkdir(paths.dataDir, { recursive: true });
  return enrichScene(await loadSceneUnsafe(paths));
}

export async function applyCommand(command, options = {}) {
  const paths = canvasPaths(options.canvasId ?? command.canvasId ?? DEFAULT_CANVAS_ID);
  const release = await acquireLock(paths);
  try {
    let scene = await loadSceneUnsafe(paths);
    const history = await readJson(paths.historyPath, defaultHistory());
    const author = normalizeAuthor(command.author, options.authorType || "ai");
    const action = command.action;
    let count = 0;

    if (action === "undo") {
      const previous = history.past.pop();
      if (!previous) return { scene: enrichScene(scene), changed: false, message: "沒有可復原的操作。" };
      history.future.push(clone(scene));
      const currentRevision = scene.revision;
      scene = previous;
      scene.revision = currentRevision + 1;
      scene.updatedAt = now();
      addActivity(scene, action, author, 0, command.detail);
    } else if (action === "redo") {
      const next = history.future.pop();
      if (!next) return { scene: enrichScene(scene), changed: false, message: "沒有可重做的操作。" };
      history.past.push(clone(scene));
      const currentRevision = scene.revision;
      scene = next;
      scene.revision = currentRevision + 1;
      scene.updatedAt = now();
      addActivity(scene, action, author, 0, command.detail);
    } else {
      const before = clone(scene);

      if (action === "add") {
        const additions = Array.isArray(command.elements) ? command.elements : [];
        const usedIds = new Set(scene.elements.map((element) => element.id));
        const normalized = additions.map((element) => normalizeElement(element, author));
        for (const element of normalized) {
          if (usedIds.has(element.id)) element.id = randomUUID();
          usedIds.add(element.id);
        }
        scene.elements.push(...normalized);
        count = normalized.length;
      } else if (action === "update") {
        const updates = Array.isArray(command.updates) ? command.updates : [];
        const existingIds = new Set(scene.elements.map((element) => element.id));
        for (const update of updates) {
          const targetId = String(update.id);
          if (!existingIds.has(targetId)) continue;
          const changes = sanitizeChanges(update.changes);
          if (!Object.keys(changes).length) continue;
          scene.effects.push({
            id: randomUUID(),
            type: "update",
            targetId,
            changes,
            author: clone(author),
            at: now()
          });
          count += 1;
        }
      } else if (action === "delete") {
        const existingIds = new Set(scene.elements.map((element) => element.id));
        const targetIds = [...new Set((command.ids || []).map(String))].filter((id) => existingIds.has(id));
        count = targetIds.length;
        if (count) {
          scene.effects.push({
            id: randomUUID(),
            type: "erase",
            targetIds,
            author: clone(author),
            at: now()
          });
        }
      } else if (action === "clear") {
        const targetIds = composeScene(scene).elements.map((element) => element.id);
        count = targetIds.length;
        if (count) {
          scene.effects.push({
            id: randomUUID(),
            type: "erase",
            targetIds,
            author: clone(author),
            at: now()
          });
        }
      } else if (action === "replace") {
        if (command.expectedRevision !== undefined && Number(command.expectedRevision) !== scene.revision) {
          const error = new Error(`版本衝突：目前是 ${scene.revision}，收到 ${command.expectedRevision}。`);
          error.code = "REVISION_CONFLICT";
          throw error;
        }
        scene.elements = (command.elements || []).map((element) => normalizeElement(element, element.createdBy || author));
        scene.effects = [];
        count = scene.elements.length;
      } else if (action === "rename") {
        scene.canvas.name = String(command.name || "未命名畫布").slice(0, 160);
      } else {
        throw new Error(`未知的畫布操作：${String(action)}`);
      }

      if (count === 0 && !["clear", "replace", "rename"].includes(action)) {
        return { scene: enrichScene(scene), changed: false, message: "沒有元素受到影響。" };
      }

      history.past.push(before);
      history.past = history.past.slice(-MAX_HISTORY);
      history.future = [];
      scene.revision += 1;
      scene.updatedAt = now();
      addActivity(scene, action, author, count, command.detail);
    }

    history.future = history.future.slice(-MAX_HISTORY);
    await writeJsonAtomic(paths.historyPath, history);
    await writeJsonAtomic(paths.scenePath, scene);
    return { scene: enrichScene(scene), changed: true, count, message: describeAction(action, count) };
  } finally {
    await release();
  }
}

export function getDataPaths(canvasId = DEFAULT_CANVAS_ID) {
  const paths = canvasPaths(canvasId);
  return {
    canvasId: paths.canvasId,
    dataDir: paths.dataDir,
    scenePath: paths.scenePath,
    historyPath: paths.historyPath
  };
}

export const elementTypes = [...ELEMENT_TYPES];
export { composeScene as composeLayers };
