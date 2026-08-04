const SVG_NS = "http://www.w3.org/2000/svg";
const LANGUAGE_STORAGE_KEY = "canvas-relay-language";
const LOCALES = { "zh-Hant": "zh-TW", en: "en-US", ja: "ja-JP" };
const TRANSLATIONS = {
  "zh-Hant": {
    "meta.title": "Canvas Relay",
    "meta.description": "讓人類與 AI 在同一張持久化白板上持續討論。",
    "brand.name": "Canvas Relay",
    "canvas.loading": "載入中",
    "canvas.renameTitle": "重新命名畫布",
    "canvas.session": "工作階段：{id}",
    "legend.aria": "作者辨識圖例",
    "legend.human": "人類行為層",
    "legend.ai": "AI 行為層",
    "language.aria": "介面語言",
    "sync.connecting": "正在連線",
    "sync.saving": "儲存中",
    "sync.synced": "已同步",
    "sync.failed": "同步失敗",
    "sync.disconnected": "同步中斷",
    "sync.connectionFailed": "連線失敗",
    "actions.undo": "復原",
    "actions.undoTitle": "復原 Ctrl+Z",
    "actions.redo": "重做",
    "actions.redoTitle": "重做 Ctrl+Y",
    "actions.exportJson": "匯出 JSON",
    "actions.exportSvg": "匯出 SVG",
    "tools.aria": "白板工具",
    "tools.select": "選取",
    "tools.pan": "手掌",
    "tools.pencil": "畫筆",
    "tools.eraser": "橡皮擦",
    "tools.rectangle": "方框",
    "tools.ellipse": "圓形",
    "tools.arrow": "箭頭",
    "tools.line": "直線",
    "tools.text": "文字",
    "tools.note": "便條",
    "tools.frame": "框架",
    "stage.aria": "共編畫布工作區",
    "property.aria": "繪圖屬性",
    "property.stroke": "線條",
    "property.black": "墨黑",
    "property.blue": "鈷藍",
    "property.red": "磚紅",
    "property.green": "森林綠",
    "property.width": "粗細",
    "property.fontSize": "字級",
    "property.thin": "細",
    "property.medium": "中",
    "property.thick": "粗",
    "property.small": "小",
    "property.large": "大",
    "property.xlarge": "特大",
    "property.fill": "填色",
    "property.duplicate": "複製",
    "loading.scene": "正在讀取持續化場景",
    "canvas.aria": "可縮放的共編白板",
    "editor.aria": "輸入畫布文字",
    "zoom.aria": "縮放控制",
    "zoom.out": "縮小",
    "zoom.outText": "減",
    "zoom.reset": "重設並置中",
    "zoom.in": "放大",
    "zoom.inText": "加",
    "zoom.fit": "適合內容",
    "inspector.aria": "畫布資訊與屬性",
    "layers.title": "行為層合成",
    "layers.revision": "版本 {revision}",
    "layers.total": "全部元素",
    "layers.aiCreated": "AI 建立",
    "layers.erased": "擦除行為",
    "layers.visibility": "顯示結果",
    "layers.human": "人類繪製",
    "layers.ai": "AI 繪製",
    "layers.authors": "作者標籤",
    "layers.help": "僅篩選目前結果的建立者，修改與擦除仍維持合成。",
    "selection.title": "選取項目",
    "selection.empty": "選取元素後，可在這裡檢查作者與調整內容。",
    "selection.width": "寬",
    "selection.height": "高",
    "selection.text": "文字",
    "selection.apply": "套用修改",
    "activity.title": "活動紀錄",
    "activity.empty": "還沒有操作紀錄。",
    "activity.add": "新增元素",
    "activity.addNote": "新增便條",
    "activity.addText": "新增文字",
    "activity.draw": "在白板上繪圖",
    "activity.duplicate": "複製元素",
    "activity.update": "更新元素",
    "activity.move": "移動畫布元素",
    "activity.resize": "調整元素尺寸",
    "activity.panelUpdate": "從屬性面板更新元素",
    "activity.delete": "擦除元素",
    "activity.clear": "清除畫布",
    "activity.replace": "取代畫布內容",
    "activity.rename": "重新命名畫布",
    "activity.undo": "復原上一步",
    "activity.redo": "重做上一步",
    "shortcuts.title": "鍵盤操作",
    "shortcuts.undoRedo": "復原 / 重做",
    "shortcuts.pan": "移動畫布",
    "shortcuts.panKeys": "Space+拖曳",
    "shortcuts.duplicate": "複製選取",
    "shortcuts.delete": "刪除選取",
    "author.human": "人類",
    "author.humanShort": "人",
    "author.ai": "AI",
    "author.aiAssistant": "AI 助手",
    "author.you": "你",
    "author.unknown": "未知",
    "author.detail": "{type}建立：{creator}。最後編輯：{editor}",
    "frame.default": "框架",
    "time.unknown": "時間未知",
    "toast.textUpdated": "文字已更新",
    "toast.textAdded": "文字已加入畫布",
    "toast.erased": "已疊加人類擦除效果",
    "toast.duplicated": "已建立副本",
    "toast.added": "已加入畫布",
    "toast.jsonExported": "場景 JSON 已匯出",
    "toast.svgExported": "SVG 已匯出",
    "toast.undone": "已復原",
    "toast.redone": "已重做",
    "toast.renamed": "畫布已重新命名",
    "toast.updated": "修改已套用",
    "prompt.canvasName": "畫布名稱",
    "errors.requestFailed": "請求失敗：{status}",
    "errors.loadTitle": "無法讀取畫布",
    "errors.loadDetail": "請確認白板伺服器是否仍在執行。",
    "browser.addDetail": "從瀏覽器介面新增元素",
    "browser.updateDetail": "從瀏覽器介面更新元素"
  },
  en: {
    "meta.title": "Canvas Relay",
    "meta.description": "A persistent whiteboard where people and AI can continue the same discussion.",
    "brand.name": "Canvas Relay",
    "canvas.loading": "Loading",
    "canvas.renameTitle": "Rename canvas",
    "canvas.session": "Session: {id}",
    "legend.aria": "Author legend",
    "legend.human": "Human layer",
    "legend.ai": "AI layer",
    "language.aria": "Interface language",
    "sync.connecting": "Connecting",
    "sync.saving": "Saving",
    "sync.synced": "Synced",
    "sync.failed": "Sync failed",
    "sync.disconnected": "Sync interrupted",
    "sync.connectionFailed": "Connection failed",
    "actions.undo": "Undo",
    "actions.undoTitle": "Undo Ctrl+Z",
    "actions.redo": "Redo",
    "actions.redoTitle": "Redo Ctrl+Y",
    "actions.exportJson": "Export JSON",
    "actions.exportSvg": "Export SVG",
    "tools.aria": "Whiteboard tools",
    "tools.select": "Select",
    "tools.pan": "Pan",
    "tools.pencil": "Pencil",
    "tools.eraser": "Eraser",
    "tools.rectangle": "Rectangle",
    "tools.ellipse": "Ellipse",
    "tools.arrow": "Arrow",
    "tools.line": "Line",
    "tools.text": "Text",
    "tools.note": "Note",
    "tools.frame": "Frame",
    "stage.aria": "Shared canvas workspace",
    "property.aria": "Drawing properties",
    "property.stroke": "Stroke",
    "property.black": "Ink black",
    "property.blue": "Cobalt blue",
    "property.red": "Brick red",
    "property.green": "Forest green",
    "property.width": "Width",
    "property.fontSize": "Text size",
    "property.thin": "Thin",
    "property.medium": "Medium",
    "property.thick": "Thick",
    "property.small": "Small",
    "property.large": "Large",
    "property.xlarge": "Extra large",
    "property.fill": "Fill",
    "property.duplicate": "Duplicate",
    "loading.scene": "Loading the persistent scene",
    "canvas.aria": "Zoomable shared whiteboard",
    "editor.aria": "Enter canvas text",
    "zoom.aria": "Zoom controls",
    "zoom.out": "Zoom out",
    "zoom.outText": "−",
    "zoom.reset": "Reset and center",
    "zoom.in": "Zoom in",
    "zoom.inText": "+",
    "zoom.fit": "Fit content",
    "inspector.aria": "Canvas information and properties",
    "layers.title": "Layer composition",
    "layers.revision": "Revision {revision}",
    "layers.total": "All elements",
    "layers.aiCreated": "Created by AI",
    "layers.erased": "Erase actions",
    "layers.visibility": "Show results",
    "layers.human": "Drawn by people",
    "layers.ai": "Drawn by AI",
    "layers.authors": "Author labels",
    "layers.help": "Filters current results by creator. Edits and erasures remain applied.",
    "selection.title": "Selection",
    "selection.empty": "Select an element to inspect its author and edit its content.",
    "selection.width": "Width",
    "selection.height": "Height",
    "selection.text": "Text",
    "selection.apply": "Apply changes",
    "activity.title": "Activity",
    "activity.empty": "No activity yet.",
    "activity.add": "Add element",
    "activity.addNote": "Add note",
    "activity.addText": "Add text",
    "activity.draw": "Draw on canvas",
    "activity.duplicate": "Duplicate element",
    "activity.update": "Update element",
    "activity.move": "Move element",
    "activity.resize": "Resize element",
    "activity.panelUpdate": "Update from properties",
    "activity.delete": "Erase element",
    "activity.clear": "Clear canvas",
    "activity.replace": "Replace canvas content",
    "activity.rename": "Rename canvas",
    "activity.undo": "Undo previous action",
    "activity.redo": "Redo previous action",
    "shortcuts.title": "Keyboard shortcuts",
    "shortcuts.undoRedo": "Undo / Redo",
    "shortcuts.pan": "Pan canvas",
    "shortcuts.panKeys": "Space+drag",
    "shortcuts.duplicate": "Duplicate selection",
    "shortcuts.delete": "Delete selection",
    "author.human": "Human",
    "author.humanShort": "H",
    "author.ai": "AI",
    "author.aiAssistant": "AI assistant",
    "author.you": "You",
    "author.unknown": "Unknown",
    "author.detail": "Created by {type}: {creator}. Last edited by {editor}.",
    "frame.default": "Frame",
    "time.unknown": "Unknown time",
    "toast.textUpdated": "Text updated",
    "toast.textAdded": "Text added to canvas",
    "toast.erased": "Human erasure added",
    "toast.duplicated": "Duplicate created",
    "toast.added": "Added to canvas",
    "toast.jsonExported": "Scene JSON exported",
    "toast.svgExported": "SVG exported",
    "toast.undone": "Undone",
    "toast.redone": "Redone",
    "toast.renamed": "Canvas renamed",
    "toast.updated": "Changes applied",
    "prompt.canvasName": "Canvas name",
    "errors.requestFailed": "Request failed: {status}",
    "errors.loadTitle": "Could not load canvas",
    "errors.loadDetail": "Check that the whiteboard server is still running.",
    "browser.addDetail": "Add elements from browser",
    "browser.updateDetail": "Update elements from browser"
  },
  ja: {
    "meta.title": "Canvas Relay",
    "meta.description": "人と AI が同じ議論を続けられる永続化ホワイトボードです。",
    "brand.name": "Canvas Relay",
    "canvas.loading": "読み込み中",
    "canvas.renameTitle": "キャンバス名を変更",
    "canvas.session": "セッション：{id}",
    "legend.aria": "作成者の凡例",
    "legend.human": "人の操作レイヤー",
    "legend.ai": "AI 操作レイヤー",
    "language.aria": "表示言語",
    "sync.connecting": "接続中",
    "sync.saving": "保存中",
    "sync.synced": "同期済み",
    "sync.failed": "同期に失敗",
    "sync.disconnected": "同期が中断しました",
    "sync.connectionFailed": "接続に失敗",
    "actions.undo": "元に戻す",
    "actions.undoTitle": "元に戻す Ctrl+Z",
    "actions.redo": "やり直す",
    "actions.redoTitle": "やり直す Ctrl+Y",
    "actions.exportJson": "JSON を書き出す",
    "actions.exportSvg": "SVG を書き出す",
    "tools.aria": "ホワイトボードツール",
    "tools.select": "選択",
    "tools.pan": "手のひら",
    "tools.pencil": "ペン",
    "tools.eraser": "消しゴム",
    "tools.rectangle": "四角形",
    "tools.ellipse": "楕円",
    "tools.arrow": "矢印",
    "tools.line": "直線",
    "tools.text": "テキスト",
    "tools.note": "付箋",
    "tools.frame": "フレーム",
    "stage.aria": "共有キャンバス作業領域",
    "property.aria": "描画プロパティ",
    "property.stroke": "線",
    "property.black": "墨色",
    "property.blue": "コバルトブルー",
    "property.red": "れんが色",
    "property.green": "フォレストグリーン",
    "property.width": "太さ",
    "property.fontSize": "文字サイズ",
    "property.thin": "細",
    "property.medium": "中",
    "property.thick": "太",
    "property.small": "小",
    "property.large": "大",
    "property.xlarge": "特大",
    "property.fill": "塗り",
    "property.duplicate": "複製",
    "loading.scene": "保存されたシーンを読み込んでいます",
    "canvas.aria": "拡大縮小できる Canvas Relay キャンバス",
    "editor.aria": "キャンバスのテキストを入力",
    "zoom.aria": "拡大縮小",
    "zoom.out": "縮小",
    "zoom.outText": "−",
    "zoom.reset": "中央に戻す",
    "zoom.in": "拡大",
    "zoom.inText": "+",
    "zoom.fit": "内容に合わせる",
    "inspector.aria": "キャンバス情報とプロパティ",
    "layers.title": "レイヤー合成",
    "layers.revision": "リビジョン {revision}",
    "layers.total": "全要素",
    "layers.aiCreated": "AI が作成",
    "layers.erased": "消去操作",
    "layers.visibility": "結果を表示",
    "layers.human": "人が作成",
    "layers.ai": "AI が作成",
    "layers.authors": "作成者ラベル",
    "layers.help": "現在の結果を作成者で絞り込みます。編集と消去はそのまま適用されます。",
    "selection.title": "選択項目",
    "selection.empty": "要素を選択すると、作成者の確認と内容の編集ができます。",
    "selection.width": "幅",
    "selection.height": "高さ",
    "selection.text": "テキスト",
    "selection.apply": "変更を適用",
    "activity.title": "操作履歴",
    "activity.empty": "操作履歴はまだありません。",
    "activity.add": "要素を追加",
    "activity.addNote": "付箋を追加",
    "activity.addText": "テキストを追加",
    "activity.draw": "キャンバスに描画",
    "activity.duplicate": "要素を複製",
    "activity.update": "要素を更新",
    "activity.move": "要素を移動",
    "activity.resize": "要素のサイズを変更",
    "activity.panelUpdate": "プロパティから要素を更新",
    "activity.delete": "要素を消去",
    "activity.clear": "キャンバスを消去",
    "activity.replace": "キャンバス内容を置換",
    "activity.rename": "キャンバス名を変更",
    "activity.undo": "前の操作を元に戻す",
    "activity.redo": "前の操作をやり直す",
    "shortcuts.title": "キーボード操作",
    "shortcuts.undoRedo": "元に戻す / やり直す",
    "shortcuts.pan": "キャンバスを移動",
    "shortcuts.panKeys": "Space+ドラッグ",
    "shortcuts.duplicate": "選択項目を複製",
    "shortcuts.delete": "選択項目を削除",
    "author.human": "人",
    "author.humanShort": "人",
    "author.ai": "AI",
    "author.aiAssistant": "AI アシスタント",
    "author.you": "あなた",
    "author.unknown": "不明",
    "author.detail": "{type}の作成：{creator}。最終編集：{editor}",
    "frame.default": "フレーム",
    "time.unknown": "時刻不明",
    "toast.textUpdated": "テキストを更新しました",
    "toast.textAdded": "テキストをキャンバスに追加しました",
    "toast.erased": "人の消去操作を追加しました",
    "toast.duplicated": "複製を作成しました",
    "toast.added": "キャンバスに追加しました",
    "toast.jsonExported": "シーン JSON を書き出しました",
    "toast.svgExported": "SVG を書き出しました",
    "toast.undone": "元に戻しました",
    "toast.redone": "やり直しました",
    "toast.renamed": "キャンバス名を変更しました",
    "toast.updated": "変更を適用しました",
    "prompt.canvasName": "キャンバス名",
    "errors.requestFailed": "リクエストに失敗しました：{status}",
    "errors.loadTitle": "キャンバスを読み込めません",
    "errors.loadDetail": "ホワイトボードサーバーが起動しているか確認してください。",
    "browser.addDetail": "ブラウザーから要素を追加",
    "browser.updateDetail": "ブラウザーから要素を更新"
  }
};

const CANVAS_ID = new URLSearchParams(window.location.search).get("canvas") || "default";

function detectLanguage() {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (Object.hasOwn(TRANSLATIONS, saved)) return saved;
  return "zh-Hant";
}

const dom = {
  canvas: document.querySelector("#canvas"),
  camera: document.querySelector("#camera"),
  background: document.querySelector("#canvas-background"),
  elements: document.querySelector("#elements-layer"),
  draft: document.querySelector("#draft-layer"),
  selection: document.querySelector("#selection-layer"),
  stage: document.querySelector("#stage-shell"),
  editor: document.querySelector("#text-editor"),
  loading: document.querySelector("#loading-state"),
  sync: document.querySelector("#sync-state"),
  toast: document.querySelector("#toast"),
  canvasName: document.querySelector("#canvas-name"),
  canvasSession: document.querySelector("#canvas-session"),
  revision: document.querySelector("#revision-label"),
  activity: document.querySelector("#activity-list"),
  selectionEmpty: document.querySelector("#selection-empty"),
  selectionForm: document.querySelector("#selection-form"),
  selectedAuthor: document.querySelector("#selected-author"),
  duplicate: document.querySelector("#duplicate-button"),
  zoomLabel: document.querySelector("#zoom-label"),
  language: document.querySelector("#language-select")
};

const state = {
  scene: null,
  renderedElements: [],
  tool: "select",
  selectedId: null,
  interaction: null,
  draft: null,
  view: { x: 0, y: 0, scale: 1 },
  style: { stroke: "#20242c", strokeWidth: 2, fontSize: 24, fill: false },
  filters: { human: true, ai: true },
  showAuthorLabels: false,
  spacePressed: false,
  hasFitted: false,
  editorContext: null,
  toastTimer: null,
  language: detectLanguage()
};

function t(key, replacements = {}) {
  const template = TRANSLATIONS[state.language]?.[key] ?? TRANSLATIONS["zh-Hant"][key] ?? key;
  return Object.entries(replacements).reduce(
    (value, [name, replacement]) => value.replaceAll("{" + name + "}", String(replacement)),
    template
  );
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]').content = t("meta.description");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });
  dom.language.value = state.language;
  dom.canvasSession.textContent = t("canvas.session", { id: CANVAS_ID });
  if (state.scene) render();
}

function svgNode(tag, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== null) node.setAttribute(name, String(value));
  }
  return node;
}

function escapeText(value) {
  return String(value ?? "");
}

function setSync(status, labelKey) {
  dom.sync.className = `sync-state ${status}`;
  dom.sync.lastElementChild.dataset.i18n = labelKey;
  dom.sync.lastElementChild.textContent = t(labelKey);
}

function showToast(message, type = "info") {
  clearTimeout(state.toastTimer);
  dom.toast.textContent = TRANSLATIONS[state.language]?.[message] ? t(message) : message;
  dom.toast.className = `toast ${type === "error" ? "error" : ""}`;
  dom.toast.hidden = false;
  state.toastTimer = setTimeout(() => {
    dom.toast.hidden = true;
  }, 2800);
}

async function api(path, options = {}) {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("canvas", CANVAS_ID);
  const response = await fetch(`${url.pathname}${url.search}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(t("errors.requestFailed", { status: response.status }));
  return body;
}

async function runCommand(command, successMessage) {
  setSync("syncing", "sync.saving");
  try {
    const result = await api("/api/commands", {
      method: "POST",
      body: JSON.stringify({ ...command, author: { name: "你" } })
    });
    state.scene = result.scene;
    if (state.selectedId && !state.scene.composite.elements.some((element) => element.id === state.selectedId)) {
      state.selectedId = null;
    }
    render();
    setSync("synced", "sync.synced");
    if (successMessage) showToast(successMessage);
    return result;
  } catch (error) {
    setSync("error", "sync.failed");
    showToast("sync.failed", "error");
    await refreshScene(true).catch(() => {});
    throw error;
  }
}

async function refreshScene(force = false) {
  const scene = await api("/api/scene");
  if (force || !state.scene || scene.revision !== state.scene.revision) {
    state.scene = scene;
    if (state.selectedId && !scene.composite.elements.some((element) => element.id === state.selectedId)) {
      state.selectedId = null;
    }
    render();
  }
  setSync("synced", "sync.synced");
  dom.loading.hidden = true;
  if (!state.hasFitted) {
    state.hasFitted = true;
    requestAnimationFrame(fitView);
  }
  return scene;
}

function updateView() {
  dom.camera.setAttribute("transform", `translate(${state.view.x} ${state.view.y}) scale(${state.view.scale})`);
  dom.zoomLabel.textContent = `${Math.round(state.view.scale * 100)}%`;
}

function resizeViewport() {
  const rect = dom.canvas.getBoundingClientRect();
  dom.canvas.setAttribute("viewBox", `0 0 ${Math.max(1, rect.width)} ${Math.max(1, rect.height)}`);
  updateView();
}

function toWorld(event) {
  const matrix = dom.camera.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  return { x: Math.round(point.x * 10) / 10, y: Math.round(point.y * 10) / 10 };
}

function getElementBounds(element) {
  if (["line", "arrow"].includes(element.type)) {
    const x2 = Number(element.x2 ?? element.x + element.width);
    const y2 = Number(element.y2 ?? element.y + element.height);
    return {
      x: Math.min(element.x, x2),
      y: Math.min(element.y, y2),
      width: Math.max(1, Math.abs(x2 - element.x)),
      height: Math.max(1, Math.abs(y2 - element.y))
    };
  }
  if (element.type === "freehand" && element.points?.length) {
    const xs = element.points.map((point) => point.x);
    const ys = element.points.map((point) => point.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    return { x: minX, y: minY, width: Math.max(1, Math.max(...xs) - minX), height: Math.max(1, Math.max(...ys) - minY) };
  }
  return { x: element.x, y: element.y, width: element.width || 1, height: element.height || 1 };
}

function getSceneBounds() {
  const elements = state.renderedElements;
  if (!elements.length) return { x: 0, y: 0, width: 1200, height: 700 };
  const bounds = elements.map(getElementBounds);
  const left = Math.min(...bounds.map((bound) => bound.x));
  const top = Math.min(...bounds.map((bound) => bound.y));
  const right = Math.max(...bounds.map((bound) => bound.x + bound.width));
  const bottom = Math.max(...bounds.map((bound) => bound.y + bound.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

function fitView() {
  const viewport = dom.canvas.getBoundingClientRect();
  const bounds = getSceneBounds();
  const padding = Math.min(140, viewport.width * 0.12);
  const scale = Math.max(0.18, Math.min(1.4,
    (viewport.width - padding * 2) / Math.max(1, bounds.width),
    (viewport.height - padding * 2) / Math.max(1, bounds.height)
  ));
  state.view.scale = scale;
  state.view.x = viewport.width / 2 - (bounds.x + bounds.width / 2) * scale;
  state.view.y = viewport.height / 2 - (bounds.y + bounds.height / 2) * scale;
  updateView();
}

function wrapText(text, width, fontSize) {
  const maxChars = Math.max(1, Math.floor(width / Math.max(7, fontSize * 0.58)));
  const lines = [];
  for (const paragraph of escapeText(text).split("\n")) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    let remaining = Array.from(paragraph);
    while (remaining.length) {
      lines.push(remaining.splice(0, maxChars).join(""));
    }
  }
  return lines.slice(0, 40);
}

function appendText(group, element, box, color = "#20242c") {
  if (!element.text) return;
  const padding = element.type === "text" ? 0 : 16;
  const text = svgNode("text", {
    x: box.x + padding,
    y: box.y + padding,
    class: "element-text",
    "font-size": element.fontSize || 20
  });
  text.style.fill = color;
  const lines = wrapText(element.text, Math.max(20, box.width - padding * 2), element.fontSize || 20);
  lines.forEach((line, index) => {
    const span = svgNode("tspan", {
      x: box.x + padding,
      dy: index === 0 ? 0 : (element.fontSize || 20) * 1.28
    });
    span.textContent = line || " ";
    text.append(span);
  });
  group.append(text);
}

function appendAuthorChip(group, element, bounds) {
  const author = element.createdBy || { type: "ai", name: t("author.aiAssistant") };
  const label = `${author.type === "ai" ? t("author.ai") : t("author.humanShort")}：${displayAuthorName(author.name)}`;
  const width = Math.max(54, Math.min(168, 20 + Array.from(label).length * 11));
  const y = Math.max(8, bounds.y - 26);
  const chip = svgNode("g", { class: "author-chip", "pointer-events": "none" });
  chip.append(svgNode("rect", { x: bounds.x, y, width, height: 20, rx: 5 }));
  const text = svgNode("text", { x: bounds.x + 8, y: y + 14 });
  text.textContent = label;
  chip.append(text);
  group.append(chip);
}

function composeActiveElements() {
  if (!state.scene) return [];
  return (state.scene.composite?.elements || [])
    .filter((element) => state.filters[element.createdBy?.type || "human"])
    .map((element) => structuredClone(element));
}

function renderElement(element, options = {}) {
  const group = svgNode("g", {
    class: options.draft ? "draft-element" : "element",
    "data-id": element.id || "draft",
    "data-author-type": element.createdBy?.type || "human",
    opacity: element.opacity ?? 1
  });
  const bounds = getElementBounds(element);
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;
  if (element.rotation) group.setAttribute("transform", `rotate(${element.rotation} ${centerX} ${centerY})`);

  const common = {
    class: "element-shape",
    stroke: element.stroke || "#20242c",
    "stroke-width": element.strokeWidth || 2,
    fill: element.fill || "transparent",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };

  if (element.type === "rectangle" || element.type === "note") {
    group.append(svgNode("rect", { ...common, x: element.x, y: element.y, width: element.width, height: element.height, rx: element.type === "note" ? 8 : 10 }));
    appendText(group, element, bounds);
  } else if (element.type === "ellipse") {
    group.append(svgNode("ellipse", { ...common, cx: centerX, cy: centerY, rx: bounds.width / 2, ry: bounds.height / 2 }));
    appendText(group, element, { x: bounds.x + bounds.width * 0.12, y: bounds.y + bounds.height * 0.2, width: bounds.width * 0.76, height: bounds.height * 0.6 });
  } else if (element.type === "line" || element.type === "arrow") {
    group.append(svgNode("line", {
      ...common,
      x1: element.x,
      y1: element.y,
      x2: element.x2,
      y2: element.y2,
      fill: "none",
      "marker-end": element.type === "arrow" ? "url(#arrow-head)" : null
    }));
  } else if (element.type === "freehand") {
    const points = (element.points || []).map((point) => `${point.x},${point.y}`).join(" ");
    group.append(svgNode("polyline", { ...common, points, fill: "none" }));
  } else if (element.type === "frame") {
    group.append(svgNode("rect", { ...common, x: element.x, y: element.y, width: element.width, height: element.height, rx: 10, fill: "transparent", "stroke-dasharray": "10 7" }));
    const label = svgNode("text", { x: element.x + 12, y: element.y + 24, class: "frame-label" });
    label.textContent = element.text || element.name || t("frame.default");
    group.append(label);
  } else if (element.type === "text") {
    appendText(group, element, bounds, element.stroke || "#20242c");
  }

  if (!options.draft && state.showAuthorLabels) appendAuthorChip(group, element, bounds);
  return group;
}

function renderElements() {
  dom.elements.replaceChildren();
  for (const element of state.renderedElements) dom.elements.append(renderElement(element));
}

function renderDraft() {
  dom.draft.replaceChildren();
  if (state.draft) dom.draft.append(renderElement(state.draft, { draft: true }));
}

function renderSelection() {
  dom.selection.replaceChildren();
  const element = state.renderedElements.find((item) => item.id === state.selectedId);
  if (!element) return;
  const bounds = getElementBounds(element);
  const padding = 7 / state.view.scale;
  dom.selection.append(svgNode("rect", {
    class: "selection-box",
    x: bounds.x - padding,
    y: bounds.y - padding,
    width: bounds.width + padding * 2,
    height: bounds.height + padding * 2,
    rx: 5 / state.view.scale
  }));
  dom.selection.append(svgNode("circle", {
    class: "resize-handle",
    "data-handle": "resize",
    "data-id": element.id,
    cx: bounds.x + bounds.width + padding,
    cy: bounds.y + bounds.height + padding,
    r: 6 / state.view.scale
  }));
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t("time.unknown");
  return new Intl.DateTimeFormat(LOCALES[state.language], { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function displayAuthorName(name) {
  if (!name) return t("author.unknown");
  if (["你", "You", "あなた", "you"].includes(name)) return t("author.you");
  return name;
}

function activityTitle(event) {
  if (event.summary?.startsWith("i18n:")) return t(event.summary.slice(5));
  const key = `activity.${event.action}`;
  return TRANSLATIONS[state.language]?.[key] ? t(key) : event.summary;
}

function renderInspector() {
  if (!state.scene) return;
  dom.canvasName.textContent = state.scene.canvas.name;
  dom.revision.textContent = t("layers.revision", { revision: state.scene.revision });
  dom.duplicate.disabled = !state.selectedId;

  const selected = state.renderedElements.find((element) => element.id === state.selectedId);
  dom.selectionEmpty.hidden = Boolean(selected);
  dom.selectionForm.hidden = !selected;
  if (selected) {
    const author = selected.createdBy || { type: "human", name: "" };
    dom.selectedAuthor.className = `author-card ${author.type === "ai" ? "ai" : ""}`;
    dom.selectedAuthor.textContent = t("author.detail", {
      type: author.type === "ai" ? t("author.ai") : t("author.human"),
      creator: displayAuthorName(author.name),
      editor: displayAuthorName(selected.lastEditedBy?.name || author.name)
    });
    for (const name of ["x", "y", "width", "height", "text"]) {
      dom.selectionForm.elements[name].value = selected[name] ?? "";
    }
    const dimensional = !["line", "arrow", "freehand"].includes(selected.type);
    dom.selectionForm.elements.width.disabled = !dimensional;
    dom.selectionForm.elements.height.disabled = !dimensional;
  }

  const events = [...(state.scene.activity || [])].reverse().slice(0, 8);
  dom.activity.replaceChildren();
  if (!events.length) {
    const empty = document.createElement("div");
    empty.className = "selection-empty";
    empty.textContent = t("activity.empty");
    dom.activity.append(empty);
  }
  for (const event of events) {
    const item = document.createElement("div");
    item.className = `activity-item ${event.author?.type === "ai" ? "ai" : ""}`;
    const bar = document.createElement("div");
    bar.className = "activity-bar";
    const copy = document.createElement("div");
    copy.className = "activity-copy";
    const title = document.createElement("strong");
    title.textContent = activityTitle(event);
    const meta = document.createElement("span");
    meta.textContent = `${displayAuthorName(event.author?.name)}，${formatTime(event.at)}`;
    copy.append(title, meta);
    item.append(bar, copy);
    dom.activity.append(item);
  }
}

function render() {
  if (!state.scene) return;
  state.renderedElements = composeActiveElements();
  if (state.selectedId && !state.renderedElements.some((element) => element.id === state.selectedId)) state.selectedId = null;
  dom.background.setAttribute("width", state.scene.canvas.width);
  dom.background.setAttribute("height", state.scene.canvas.height);
  renderElements();
  renderDraft();
  renderSelection();
  renderInspector();
  updateView();
}

function selectTool(tool) {
  state.tool = tool;
  dom.canvas.dataset.tool = tool;
  for (const button of document.querySelectorAll("[data-tool]")) {
    const active = button.dataset.tool === tool;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }
}

function elementFromTarget(target) {
  const group = target.closest?.(".element");
  if (!group) return null;
  return state.renderedElements.find((element) => element.id === group.dataset.id) || null;
}

function defaultElement(tool, point) {
  const base = {
    id: `draft-${Date.now()}`,
    type: tool,
    x: point.x,
    y: point.y,
    width: 1,
    height: 1,
    stroke: state.style.stroke,
    strokeWidth: state.style.strokeWidth,
    fontSize: state.style.fontSize,
    fill: state.style.fill ? `${state.style.stroke}20` : "transparent",
    text: "",
    opacity: 1,
    rotation: 0,
    createdBy: { type: "human", name: "你" }
  };
  if (tool === "note") base.fill = "#fff3b8";
  if (tool === "frame") base.stroke = "#8c95a3";
  if (["line", "arrow"].includes(tool)) {
    base.x2 = point.x;
    base.y2 = point.y;
  }
  if (tool === "pencil") {
    base.type = "freehand";
    base.points = [point];
  }
  return base;
}

function moveElementPreview(element, original, dx, dy) {
  if (["line", "arrow"].includes(element.type)) {
    element.x = original.x + dx;
    element.y = original.y + dy;
    element.x2 = original.x2 + dx;
    element.y2 = original.y2 + dy;
  } else if (element.type === "freehand") {
    element.points = original.points.map((point) => ({ x: point.x + dx, y: point.y + dy }));
    element.x = original.x + dx;
    element.y = original.y + dy;
  } else {
    element.x = original.x + dx;
    element.y = original.y + dy;
  }
}

function startTextEditor(point, type, existing = null, clientPoint = null) {
  const rect = dom.stage.getBoundingClientRect();
  const screenX = clientPoint?.x ?? (point.x * state.view.scale + state.view.x + rect.left);
  const screenY = clientPoint?.y ?? (point.y * state.view.scale + state.view.y + rect.top);
  state.editorContext = { point, type, existing };
  dom.editor.value = existing?.text || "";
  dom.editor.style.left = `${Math.max(8, Math.min(rect.width - 300, screenX - rect.left))}px`;
  dom.editor.style.top = `${Math.max(60, Math.min(rect.height - 120, screenY - rect.top))}px`;
  dom.editor.style.fontSize = `${Math.max(14, state.style.fontSize * Math.min(1, state.view.scale))}px`;
  dom.editor.hidden = false;
  requestAnimationFrame(() => dom.editor.focus());
}

async function commitTextEditor() {
  if (!state.editorContext || dom.editor.hidden) return;
  const context = state.editorContext;
  const text = dom.editor.value.trim();
  dom.editor.hidden = true;
  state.editorContext = null;
  if (!text) return;

  if (context.existing) {
    await runCommand({ action: "update", updates: [{ id: context.existing.id, changes: { text } }], detail: "i18n:activity.update" }, "toast.textUpdated");
  } else {
    const element = defaultElement(context.type, context.point);
    element.text = text;
    element.width = context.type === "text" ? Math.max(220, Math.min(720, Array.from(text).length * state.style.fontSize * 0.62)) : 280;
    element.height = context.type === "text" ? Math.max(50, Math.ceil(Array.from(text).length / 18) * state.style.fontSize * 1.35) : 170;
    await runCommand({ action: "add", elements: [element], detail: context.type === "note" ? "i18n:activity.addNote" : "i18n:activity.addText" }, "toast.textAdded");
  }
}

function cancelTextEditor() {
  dom.editor.hidden = true;
  dom.editor.value = "";
  state.editorContext = null;
}

async function deleteElements(ids) {
  if (!ids.length) return;
  state.selectedId = null;
  await runCommand({ action: "delete", ids, detail: "i18n:activity.delete" }, "toast.erased");
}

async function duplicateSelected() {
  const selected = state.renderedElements.find((element) => element.id === state.selectedId);
  if (!selected) return;
  const copy = structuredClone(selected);
  delete copy.id;
  delete copy.createdAt;
  delete copy.updatedAt;
  delete copy.createdBy;
  delete copy.lastEditedBy;
  if (["line", "arrow"].includes(copy.type)) {
    copy.x += 32;
    copy.y += 32;
    copy.x2 += 32;
    copy.y2 += 32;
  } else if (copy.type === "freehand") {
    copy.points = copy.points.map((point) => ({ x: point.x + 32, y: point.y + 32 }));
    copy.x += 32;
    copy.y += 32;
  } else {
    copy.x += 32;
    copy.y += 32;
  }
  const result = await runCommand({ action: "add", elements: [copy], detail: "i18n:activity.duplicate" }, "toast.duplicated");
  state.selectedId = result.scene.elements.at(-1)?.id || null;
  render();
}

function pointerDown(event) {
  if (event.button !== 0 && event.button !== 1) return;
  try {
    dom.canvas.setPointerCapture(event.pointerId);
  } catch {
    // 合成或輔助技術產生的指標事件不一定具有可擷取的實體指標。
  }
  const point = toWorld(event);
  const shouldPan = state.tool === "pan" || state.spacePressed || event.button === 1;
  if (shouldPan) {
    state.interaction = { type: "pan", pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, view: { ...state.view } };
    dom.canvas.classList.add("panning");
    return;
  }

  const handle = event.target.closest?.("[data-handle='resize']");
  if (state.tool === "select" && handle) {
    const element = state.renderedElements.find((item) => item.id === handle.dataset.id);
    if (element) {
      state.interaction = { type: "resize", pointerId: event.pointerId, start: point, original: structuredClone(element), id: element.id };
    }
    return;
  }

  const hit = elementFromTarget(event.target);
  if (state.tool === "eraser") {
    state.interaction = { type: "erase", pointerId: event.pointerId, erased: new Set(hit ? [hit.id] : []) };
    return;
  }

  if (state.tool === "select") {
    state.selectedId = hit?.id || null;
    if (hit) state.interaction = { type: "move", pointerId: event.pointerId, start: point, original: structuredClone(hit), id: hit.id, moved: false };
    renderSelection();
    renderInspector();
    return;
  }

  if (["text", "note"].includes(state.tool)) {
    startTextEditor(point, state.tool, null, { x: event.clientX, y: event.clientY });
    return;
  }

  if (["rectangle", "ellipse", "arrow", "line", "pencil", "frame"].includes(state.tool)) {
    state.draft = defaultElement(state.tool, point);
    state.interaction = { type: "draw", pointerId: event.pointerId, start: point };
    renderDraft();
  }
}

function pointerMove(event) {
  const interaction = state.interaction;
  if (!interaction || interaction.pointerId !== event.pointerId) return;
  const point = toWorld(event);

  if (interaction.type === "pan") {
    state.view.x = interaction.view.x + event.clientX - interaction.clientX;
    state.view.y = interaction.view.y + event.clientY - interaction.clientY;
    updateView();
    return;
  }

  if (interaction.type === "draw" && state.draft) {
    if (state.draft.type === "freehand") {
      const last = state.draft.points.at(-1);
      if (!last || Math.hypot(point.x - last.x, point.y - last.y) > 2 / state.view.scale) state.draft.points.push(point);
    } else if (["line", "arrow"].includes(state.draft.type)) {
      state.draft.x2 = point.x;
      state.draft.y2 = point.y;
      state.draft.width = point.x - interaction.start.x;
      state.draft.height = point.y - interaction.start.y;
    } else {
      state.draft.x = Math.min(interaction.start.x, point.x);
      state.draft.y = Math.min(interaction.start.y, point.y);
      state.draft.width = Math.max(1, Math.abs(point.x - interaction.start.x));
      state.draft.height = Math.max(1, Math.abs(point.y - interaction.start.y));
    }
    renderDraft();
    return;
  }

  if (interaction.type === "move") {
    const element = state.renderedElements.find((item) => item.id === interaction.id);
    if (!element) return;
    const dx = point.x - interaction.start.x;
    const dy = point.y - interaction.start.y;
    interaction.moved = Math.abs(dx) + Math.abs(dy) > 1;
    moveElementPreview(element, interaction.original, dx, dy);
    renderElements();
    renderSelection();
    return;
  }

  if (interaction.type === "resize") {
    const element = state.renderedElements.find((item) => item.id === interaction.id);
    if (!element) return;
    if (["line", "arrow"].includes(element.type)) {
      element.x2 = point.x;
      element.y2 = point.y;
    } else if (element.type !== "freehand") {
      element.width = Math.max(20, interaction.original.width + point.x - interaction.start.x);
      element.height = Math.max(20, interaction.original.height + point.y - interaction.start.y);
    }
    renderElements();
    renderSelection();
    return;
  }

  if (interaction.type === "erase") {
    const hit = elementFromTarget(document.elementFromPoint(event.clientX, event.clientY));
    if (hit) interaction.erased.add(hit.id);
  }
}

async function pointerUp(event) {
  const interaction = state.interaction;
  if (!interaction || interaction.pointerId !== event.pointerId) return;
  state.interaction = null;
  dom.canvas.classList.remove("panning");

  if (interaction.type === "draw" && state.draft) {
    const draft = state.draft;
    state.draft = null;
    renderDraft();
    const bounds = getElementBounds(draft);
    const valid = draft.type === "freehand" ? draft.points.length > 1 : Math.max(bounds.width, bounds.height) > 3;
    if (valid) {
      delete draft.id;
      await runCommand({ action: "add", elements: [draft], detail: "i18n:activity.draw" }, "toast.added");
    }
    return;
  }

  if (interaction.type === "move") {
    const element = state.renderedElements.find((item) => item.id === interaction.id);
    if (!element || !interaction.moved) return;
    const changes = element.type === "freehand"
      ? { x: element.x, y: element.y, points: element.points }
      : ["line", "arrow"].includes(element.type)
        ? { x: element.x, y: element.y, x2: element.x2, y2: element.y2 }
        : { x: element.x, y: element.y };
    await runCommand({ action: "update", updates: [{ id: element.id, changes }], detail: "i18n:activity.move" });
    return;
  }

  if (interaction.type === "resize") {
    const element = state.renderedElements.find((item) => item.id === interaction.id);
    if (!element) return;
    const changes = ["line", "arrow"].includes(element.type)
      ? { x2: element.x2, y2: element.y2 }
      : { width: element.width, height: element.height };
    await runCommand({ action: "update", updates: [{ id: element.id, changes }], detail: "i18n:activity.resize" });
    return;
  }

  if (interaction.type === "erase" && interaction.erased.size) {
    await deleteElements([...interaction.erased]);
  }
}

function zoomAt(clientX, clientY, direction) {
  const rect = dom.canvas.getBoundingClientRect();
  const sx = clientX - rect.left;
  const sy = clientY - rect.top;
  const worldX = (sx - state.view.x) / state.view.scale;
  const worldY = (sy - state.view.y) / state.view.scale;
  const scale = Math.max(0.12, Math.min(4, state.view.scale * direction));
  state.view.x = sx - worldX * scale;
  state.view.y = sy - worldY * scale;
  state.view.scale = scale;
  updateView();
  renderSelection();
}

function download(filename, type, content) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function exportJson() {
  download("canvas-relay-scene.json", "application/json", `${JSON.stringify(state.scene, null, 2)}\n`);
  showToast("toast.jsonExported");
}

function exportSvg() {
  const clone = dom.canvas.cloneNode(true);
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("viewBox", `0 0 ${state.scene.canvas.width} ${state.scene.canvas.height}`);
  clone.setAttribute("width", state.scene.canvas.width);
  clone.setAttribute("height", state.scene.canvas.height);
  clone.querySelector("#camera")?.setAttribute("transform", "");
  clone.querySelector("#selection-layer")?.replaceChildren();
  clone.querySelector("#draft-layer")?.replaceChildren();
  clone.querySelectorAll(".hidden-by-filter").forEach((node) => node.classList.remove("hidden-by-filter"));
  const style = svgNode("style");
  style.textContent = ".element-text,.frame-label,.author-chip text{font-family:Segoe UI,Microsoft JhengHei,sans-serif}.element-text{fill:#20242c}.frame-label{fill:#677080;font-weight:700}.author-chip rect{fill:#edf0f4;stroke:#aab1bd}.author-chip text{fill:#444c58;font-size:11px;font-weight:700}.element[data-author-type=ai] .author-chip rect{fill:#e9efff;stroke:#6d8fe3}.element[data-author-type=ai] .author-chip text{fill:#163b91}";
  clone.prepend(style);
  download("canvas-relay.svg", "image/svg+xml", new XMLSerializer().serializeToString(clone));
  showToast("toast.svgExported");
}

function bindEvents() {
  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => selectTool(button.dataset.tool));
  });

  document.querySelectorAll("[data-color]").forEach((button) => {
    button.addEventListener("click", () => {
      state.style.stroke = button.dataset.color;
      document.querySelectorAll("[data-color]").forEach((item) => item.classList.toggle("selected", item === button));
    });
  });

  document.querySelector("#stroke-width").addEventListener("change", (event) => state.style.strokeWidth = Number(event.target.value));
  document.querySelector("#font-size").addEventListener("change", (event) => state.style.fontSize = Number(event.target.value));
  document.querySelector("#fill-toggle").addEventListener("change", (event) => state.style.fill = event.target.checked);
  document.querySelector("#show-human").addEventListener("change", (event) => { state.filters.human = event.target.checked; render(); });
  document.querySelector("#show-ai").addEventListener("change", (event) => { state.filters.ai = event.target.checked; render(); });
  document.querySelector("#show-authors").addEventListener("change", (event) => { state.showAuthorLabels = event.target.checked; render(); });
  dom.language.addEventListener("change", (event) => {
    state.language = event.target.value;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language);
    applyLanguage();
  });

  dom.canvas.addEventListener("pointerdown", pointerDown);
  dom.canvas.addEventListener("pointermove", pointerMove);
  dom.canvas.addEventListener("pointerup", pointerUp);
  dom.canvas.addEventListener("pointercancel", pointerUp);
  dom.canvas.addEventListener("dblclick", (event) => {
    const element = elementFromTarget(event.target);
    if (element && ["text", "note", "rectangle", "ellipse"].includes(element.type)) {
      startTextEditor({ x: element.x, y: element.y }, element.type, element, { x: event.clientX, y: event.clientY });
    }
  });
  dom.canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, event.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });

  dom.editor.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancelTextEditor();
    }
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      commitTextEditor();
    }
  });
  dom.editor.addEventListener("blur", () => setTimeout(commitTextEditor, 0));

  document.querySelector("#undo-button").addEventListener("click", () => runCommand({ action: "undo" }, "toast.undone"));
  document.querySelector("#redo-button").addEventListener("click", () => runCommand({ action: "redo" }, "toast.redone"));
  dom.duplicate.addEventListener("click", duplicateSelected);
  document.querySelector("#export-json").addEventListener("click", exportJson);
  document.querySelector("#export-svg").addEventListener("click", exportSvg);
  document.querySelector("#fit-view").addEventListener("click", fitView);
  dom.zoomLabel.addEventListener("click", fitView);
  document.querySelector("#zoom-in").addEventListener("click", () => {
    const rect = dom.canvas.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.2);
  });
  document.querySelector("#zoom-out").addEventListener("click", () => {
    const rect = dom.canvas.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1 / 1.2);
  });
  dom.canvasName.addEventListener("click", async () => {
    const name = window.prompt(t("prompt.canvasName"), state.scene.canvas.name)?.trim();
    if (name && name !== state.scene.canvas.name) await runCommand({ action: "rename", name, detail: "i18n:activity.rename" }, "toast.renamed");
  });

  dom.selectionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const selected = state.renderedElements.find((element) => element.id === state.selectedId);
    if (!selected) return;
    const form = new FormData(dom.selectionForm);
    const changes = {
      x: Number(form.get("x")),
      y: Number(form.get("y")),
      text: String(form.get("text") || "")
    };
    if (!["line", "arrow", "freehand"].includes(selected.type)) {
      changes.width = Number(form.get("width"));
      changes.height = Number(form.get("height"));
    }
    await runCommand({ action: "update", updates: [{ id: selected.id, changes }], detail: "i18n:activity.panelUpdate" }, "toast.updated");
  });

  window.addEventListener("keydown", async (event) => {
    if (event.target.matches("input, textarea, select")) return;
    if (event.code === "Space") {
      state.spacePressed = true;
      dom.canvas.classList.add("space-pan");
      event.preventDefault();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      await runCommand({ action: event.shiftKey ? "redo" : "undo" }, event.shiftKey ? "toast.redone" : "toast.undone");
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
      event.preventDefault();
      await runCommand({ action: "redo" }, "toast.redone");
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
      event.preventDefault();
      await duplicateSelected();
      return;
    }
    if (["Delete", "Backspace"].includes(event.key) && state.selectedId) {
      event.preventDefault();
      await deleteElements([state.selectedId]);
      return;
    }
    const shortcuts = { v: "select", h: "pan", p: "pencil", e: "eraser", r: "rectangle", o: "ellipse", a: "arrow", l: "line", t: "text", n: "note", f: "frame" };
    if (shortcuts[event.key.toLowerCase()]) selectTool(shortcuts[event.key.toLowerCase()]);
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
      state.spacePressed = false;
      dom.canvas.classList.remove("space-pan");
    }
  });
  window.addEventListener("resize", resizeViewport);
}

function exposeBrowserApi() {
  window.CanvasRelay = {
    canvasId: CANVAS_ID,
    getScene: () => structuredClone(state.scene),
    addElements: (elements, detail = t("browser.addDetail")) => runCommand({ action: "add", elements, detail }),
    updateElements: (updates, detail = t("browser.updateDetail")) => runCommand({ action: "update", updates, detail }),
    deleteElements,
    fitView,
    setAuthorLabels: (visible) => {
      state.showAuthorLabels = Boolean(visible);
      document.querySelector("#show-authors").checked = state.showAuthorLabels;
      render();
    }
  };
}

async function initialize() {
  document.documentElement.dataset.theme = "light";
  applyLanguage();
  bindEvents();
  exposeBrowserApi();
  resizeViewport();
  selectTool("select");
  try {
    await refreshScene(true);
  } catch (error) {
    const title = document.createElement("strong");
    title.textContent = t("errors.loadTitle");
    const detail = document.createElement("p");
    detail.textContent = t("errors.loadDetail");
    dom.loading.replaceChildren(title, detail);
    setSync("error", "sync.connectionFailed");
  }
  setInterval(() => {
    if (!state.interaction && dom.editor.hidden) refreshScene().catch(() => setSync("error", "sync.disconnected"));
  }, 1200);
}

initialize();
