# Canvas Relay

[English](README.md) | 繁體中文 | [日本語](README.ja.md)

Canvas Relay 是一套由使用者與支援 MCP 的 AI 助手共同操作的本機持久化白板。使用者可以在桌面瀏覽器繪圖，AI 助手則能讀取同一個場景、加入結構化元素、保留作者資訊，並在後續對話繼續工作。

專案刻意維持精簡，只使用 Node.js 內建模組、原生 HTML、CSS 與 JavaScript，執行時沒有外部相依套件。

## 功能

- 提供平移、縮放、選取、繪圖、文字、便條、框架與擦除功能的瀏覽器白板。
- 透過標準輸入/輸出提供 MCP 伺服器。
- 使用 JSON 持久化場景與操作歷史。
- 為每個元素與修改保存人類或 AI 的來源資訊。
- 以非破壞性的修改與擦除效果支援復原和重做。
- 可分別顯示或隱藏人類建立與 AI 建立的元素。
- 支援 SVG 與 JSON 匯出。
- 提供繁體中文、英文與日文介面。
- 使用僅限本機的 HTTP 伺服器、同源檢查與嚴格的內容安全政策。

## 安裝

需求為 Node.js 20 以上版本與桌面瀏覽器。先在 PowerShell 確認版本：

```powershell
node --version
```

接著下載專案：

```powershell
git clone https://github.com/rncchen/canvas-relay.git
Set-Location canvas-relay
```

專案沒有外部執行期套件，因此不需要執行 `npm install`。設定 MCP 後，Codex、Claude Code 或 Claude Desktop 啟動 `mcp.mjs` 時，會自動帶起 [http://127.0.0.1:4173](http://127.0.0.1:4173) 的畫布網頁伺服器。

一般使用不需要另外執行 `npm start`。這個指令只用於未啟動 MCP 用戶端時單獨使用瀏覽器畫布，或排查自動啟動失敗：

```powershell
npm start
```

若連接埠已經有 Canvas Relay 執行中，新啟動的 MCP 會沿用現有伺服器；若被其他程式占用，MCP 仍可操作資料，並會在錯誤輸出說明瀏覽器伺服器無法啟動。

## 將 MCP 加入 Codex

在專案根目錄執行下列指令。請把路徑換成你電腦上的實際絕對路徑：

```powershell
codex mcp add canvas-relay -- node "C:\absolute\path\to\canvas-relay\mcp.mjs"
codex mcp list
```

完成後重新啟動 Codex，或開啟新的工作階段。使用 Codex IDE 擴充功能時，也可以從「MCP servers」加入 `STDIO` 伺服器；命令填入 `node`，參數填入 `C:\absolute\path\to\canvas-relay\mcp.mjs`，儲存後重新啟動擴充功能。

若偏好直接編輯專案設定，可在 `.codex/config.toml` 加入：

```toml
[mcp_servers.canvas-relay]
command = "node"
args = ["C:\\absolute\\path\\to\\canvas-relay\\mcp.mjs"]
cwd = "C:\\absolute\\path\\to\\canvas-relay"
```

## 將 MCP 加入 Claude Code

在專案根目錄執行下列指令。`user` 範圍會讓所有專案都能使用 Canvas Relay；若只想在目前專案使用，可改成 `local`：

```powershell
claude mcp add --transport stdio --scope user canvas-relay -- node 'C:\absolute\path\to\canvas-relay\mcp.mjs'
claude mcp list
```

新增後開啟新的 Claude Code 工作階段，並輸入 `/mcp` 確認連線。各種設定範圍與 STDIO 指令格式可參考 [Claude Code MCP 官方文件](https://code.claude.com/docs/en/mcp)。

Claude Code 專用 skill 位於 `.claude/skills/use-canvas-relay/SKILL.md`，會在完成畫布後開啟該對話專屬的瀏覽器網址。第一次透過 PowerShell 開啟瀏覽器時，Claude Code 可能會要求核准指令；skill 的發現規則可參考 [Claude Code Skills 官方文件](https://code.claude.com/docs/en/slash-commands)。

## 將 MCP 加入 Claude Desktop

在 Claude Desktop 開啟「Settings」→「Developer」→「Edit Config」。Windows 的設定檔位於 `%APPDATA%\Claude\claude_desktop_config.json`，加入以下內容並換成實際絕對路徑：

```json
{
  "mcpServers": {
    "canvas-relay": {
      "type": "stdio",
      "command": "node",
      "args": [
        "C:\\absolute\\path\\to\\canvas-relay\\mcp.mjs"
      ]
    }
  }
}
```

儲存後完整結束並重新開啟 Claude Desktop。Claude Desktop 不會載入專案內的 Claude Code skill；MCP 仍會自動啟動畫布伺服器，可直接開啟工具回覆中的工作階段網址。

設定頁面與 Windows 路徑可參考 [MCP 官方 Claude Desktop 教學](https://modelcontextprotocol.io/docs/develop/connect-local-servers)。

專案根目錄的 `.mcp.json` 含有電腦專用的絕對路徑，因此已排除於 Git 之外。

## 使用專案技能與瀏覽器驗證

專案同時提供 Codex 與 Claude Code skill：

- Codex：`.agents/skills/use-canvas-relay/SKILL.md`
- Claude Code：`.claude/skills/use-canvas-relay/SKILL.md`

從專案目錄啟動用戶端時會自動發現對應 skill；若沒有出現在清單中，請重新啟動用戶端。

使用範例：

```text
使用 $use-canvas-relay 畫一張三房兩廳平面圖
```

技能會為目前對話建立獨立的 `canvasId`，寫入完成後使用瀏覽器控制能力開啟：

```text
http://127.0.0.1:4173/?canvas=<canvasId>
```

Codex 會使用 Browser 外掛開啟並檢查頁面；Claude Code 會開啟系統預設瀏覽器，並在環境提供瀏覽器控制工具時執行檢查。瀏覽器功能不可用時，畫布 MCP 仍能讀寫資料，但無法完成實際畫面驗證。

## 工作階段與作者標籤

不同對話應使用不同的 `canvasId`，同一對話的所有 MCP 工具呼叫則必須沿用同一個值。瀏覽器網址的 `canvas` 查詢參數也要使用相同值，才能看到該工作階段的畫布。

作者標籤預設隱藏，畫布元素仍會保留作者資料。需要查看來源時，勾選左上角的「作者標籤」；產生乾淨的 MCP 預覽時，呼叫 `canvas_get_view` 並傳入 `includeAuthors: false`。

## 建議的 AI 操作流程

1. 為目前對話選定唯一的 `canvasId`，並在所有工具呼叫中沿用。
2. 修改畫布前先呼叫 `canvas_get_scene`。
3. 需要理解版面、重疊、視覺密度或手繪內容時，再呼叫 `canvas_get_view`。
4. 以批次方式新增或更新元素。
5. 除非使用者明確要求，否則保留既有內容，不擦除或清空畫布。
6. 需要回復畫布操作時使用 `canvas_undo`。
7. 交付前開啟對應的瀏覽器網址，隱藏作者標籤並檢查實際版面。

## MCP 工具

| 工具 | 用途 |
| --- | --- |
| `canvas_get_scene` | 讀取來源元素、效果、作者資訊、圖層、活動紀錄與目前合成場景。 |
| `canvas_get_view` | 將目前合成場景轉成 SVG。 |
| `canvas_add_elements` | 新增文字、便條、方框、圓形、直線、箭頭、手繪線或框架。 |
| `canvas_update_elements` | 加入非破壞性的移動、縮放、文字與樣式修改。 |
| `canvas_delete_elements` | 為指定元素加入可復原的擦除效果。 |
| `canvas_undo` | 回復最近一次人類或 AI 操作前的場景。 |
| `canvas_redo` | 重新套用最近一次被復原的操作。 |
| `canvas_clear` | 可復原地擦除全部可見元素，僅能在使用者明確確認後使用。 |

MCP 伺服器也提供以下資源：

- `canvas://scene/current`
- `canvas://view/current.svg`

## 資料與設定

未指定 `canvasId` 的預設畫布儲存在 `data/scene.json` 與 `data/history.json`。具名工作階段則儲存在 `data/canvases/<canvasId>/scene.json` 與 `history.json`。這些執行期資料都已排除於 Git 之外。

| 環境變數 | 預設值 | 用途 |
| --- | --- | --- |
| `PORT` | `4173` | 瀏覽器應用程式使用的 HTTP 連接埠。 |
| `CANVAS_RELAY_DATA_DIR` | `<repository>/data` | 場景、歷史與鎖定檔案的替代目錄。 |

HTTP 伺服器只綁定 `127.0.0.1`。此工具定位為本機使用，沒有登入機制，請勿直接對外公開。

## 測試

```powershell
npm test
```

測試涵蓋 MCP 協商、持久化場景修改、作者資訊、非破壞性效果、圖層合成、復原與重做。

## 補充文件

- [架構](docs/ARCHITECTURE.md)
- [開發指南](docs/DEVELOPMENT.md)
- [研究筆記](docs/RESEARCH.md)
