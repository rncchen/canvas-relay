# Canvas Relay

English | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md)

Canvas Relay is a persistent local whiteboard shared by people and MCP-capable AI assistants. A person can draw in the browser while an agent reads the same scene, adds structured elements, records authorship, and continues the work in a later conversation.

The project is intentionally small: it uses Node.js built-ins, plain HTML, CSS, and JavaScript, with no runtime dependencies.

## Features

- Browser-based infinite-style canvas with pan, zoom, selection, drawing, text, notes, frames, and erasing.
- MCP server over standard input/output for AI clients.
- Persistent JSON scene and history storage.
- Human and AI provenance on every element and edit.
- Non-destructive update and erase effects with undo and redo.
- Independent visibility filters for human-created and AI-created elements.
- SVG and JSON export.
- Traditional Chinese, English, and Japanese interface translations.
- Local-only HTTP server with same-origin checks and a restrictive content security policy.

## Requirements

- Node.js 20 or newer.
- A desktop browser.
- Optional: an MCP client that can launch a local standard input/output server.

## Quick start

```powershell
npm start
```

Open `http://127.0.0.1:4173` in a desktop browser.

The server creates the runtime data directory automatically. No package installation is required because the project currently has no external dependencies.

## Connect an MCP client

Configure the client to launch `mcp.mjs` with Node.js. Use an absolute path because MCP clients do not always start processes from the repository directory.

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

The repository-local `.mcp.json` is ignored because it contains a machine-specific absolute path.

## Recommended agent workflow

1. Call `canvas_get_scene` before changing the canvas.
2. Call `canvas_get_view` when layout, overlap, density, or freehand content must be understood visually.
3. Add or update elements in batches.
4. Preserve existing content unless the user explicitly asks to erase or clear it.
5. Use `canvas_undo` when a canvas operation needs to be reverted.

## MCP tools

| Tool | Purpose |
| --- | --- |
| `canvas_get_scene` | Read source elements, effects, provenance, layers, activity, and the current composite scene. |
| `canvas_get_view` | Render the current composite scene as SVG. |
| `canvas_add_elements` | Add text, notes, rectangles, ellipses, lines, arrows, freehand strokes, or frames. |
| `canvas_update_elements` | Add non-destructive move, resize, text, and style changes. |
| `canvas_delete_elements` | Add reversible erase effects for selected elements. |
| `canvas_undo` | Restore the scene before the latest human or AI operation. |
| `canvas_redo` | Reapply the latest undone operation. |
| `canvas_clear` | Reversibly erase all currently visible elements. Use only after explicit user confirmation. |

The MCP server also exposes these resources:

- `canvas://scene/current`
- `canvas://view/current.svg`

## Data and configuration

By default, runtime state is stored in `data/scene.json` and `data/history.json`. Both files are ignored by Git.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4173` | HTTP port for the browser application. |
| `CANVAS_RELAY_DATA_DIR` | `<repository>/data` | Alternate directory for scene, history, and lock files. |

The HTTP server binds to `127.0.0.1`. It is designed for local use and has no authentication layer. Do not expose it directly to a network.

## Tests

```powershell
npm test
```

The test suite covers MCP negotiation, persistent scene changes, authorship, non-destructive effects, layer composition, undo, and redo.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Development guide](docs/DEVELOPMENT.md)
- [Research notes](docs/RESEARCH.md)
- [繁體中文 README](README.zh-TW.md)
- [日本語 README](README.ja.md)
