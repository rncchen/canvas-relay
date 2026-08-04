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

## 需求

- Node.js 20 以上版本。
- 桌面瀏覽器。
- 選用：可啟動本機標準輸入/輸出伺服器的 MCP 用戶端。

## 快速開始

```powershell
npm start
```

使用桌面瀏覽器開啟 `http://127.0.0.1:4173`。

伺服器會自動建立執行期資料目錄。目前沒有外部相依套件，因此不需要先執行套件安裝。

## 連接 MCP 用戶端

將 MCP 用戶端設定為使用 Node.js 啟動 `mcp.mjs`。建議使用絕對路徑，因為不同用戶端啟動程式時的工作目錄可能不同。

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

專案根目錄的 `.mcp.json` 含有電腦專用的絕對路徑，因此已排除於 Git 之外。

## 建議的 AI 操作流程

1. 修改畫布前先呼叫 `canvas_get_scene`。
2. 需要理解版面、重疊、視覺密度或手繪內容時，再呼叫 `canvas_get_view`。
3. 以批次方式新增或更新元素。
4. 除非使用者明確要求，否則保留既有內容，不擦除或清空畫布。
5. 需要回復畫布操作時使用 `canvas_undo`。

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

執行期狀態預設儲存在 `data/scene.json` 與 `data/history.json`，兩個檔案都已排除於 Git 之外。

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