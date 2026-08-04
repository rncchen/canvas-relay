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

## Install

Canvas Relay requires Node.js 20 or newer and a desktop browser.

```powershell
node --version
git clone https://github.com/rncchen/canvas-relay.git
Set-Location canvas-relay
```

The project has no external runtime packages, so `npm install` is not required. Once configured, the MCP client starts `mcp.mjs`, which automatically starts the browser server at [http://127.0.0.1:4173](http://127.0.0.1:4173).

You do not normally need to run `npm start`. Use it only to run the browser canvas without an MCP client or to troubleshoot automatic startup. A second MCP process reuses an existing healthy Canvas Relay server on the same port.

## Add the MCP server to Codex

Run these commands from the repository root, replacing the example with the absolute path on your computer:

```powershell
codex mcp add canvas-relay -- node "C:\absolute\path\to\canvas-relay\mcp.mjs"
codex mcp list
```

Restart Codex or open a new session after adding the server. In the Codex IDE extension, add an `STDIO` server from **MCP servers**, use `node` as the command and the absolute `mcp.mjs` path as its argument, then restart the extension.

Project-scoped `.codex/config.toml` configuration is also supported:

```toml
[mcp_servers.canvas-relay]
command = "node"
args = ["C:\\absolute\\path\\to\\canvas-relay\\mcp.mjs"]
cwd = "C:\\absolute\\path\\to\\canvas-relay"
```

## Add the MCP server to Claude Code

Use `--scope user` to make Canvas Relay available across projects, or replace it with `local` for the current project only:

```powershell
claude mcp add --transport stdio --scope user canvas-relay -- node 'C:\absolute\path\to\canvas-relay\mcp.mjs'
claude mcp list
```

Open a new Claude Code session and run `/mcp` to verify the connection. See the [official Claude Code MCP documentation](https://code.claude.com/docs/en/mcp) for scope and STDIO details.

Claude Code discovers the bundled skill at `.claude/skills/use-canvas-relay/SKILL.md`. It opens the session-specific canvas URL after editing. See the [official Claude Code Skills documentation](https://code.claude.com/docs/en/slash-commands) for discovery rules.

## Add the MCP server to Claude Desktop

Open **Settings → Developer → Edit Config**. On Windows, edit `%APPDATA%\Claude\claude_desktop_config.json` and replace the example path below:

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

Save the file, fully quit Claude Desktop, and launch it again. Claude Desktop does not load project-scoped Claude Code skills, but the MCP process still starts the browser server automatically.

See the [official MCP Claude Desktop tutorial](https://modelcontextprotocol.io/docs/develop/connect-local-servers) for the settings screen and platform-specific configuration paths.

The repository-local `.mcp.json` is ignored because it contains a machine-specific absolute path.

## Use the bundled skill and browser verification

The repository includes `.agents/skills/use-canvas-relay/SKILL.md` for Codex and `.claude/skills/use-canvas-relay/SKILL.md` for Claude Code. Restart the client if its skill does not appear.

```text
Use $use-canvas-relay to draw a three-bedroom floor plan.
```

The skill assigns a unique `canvasId` to the current conversation, edits that canvas, then uses browser control to open `http://127.0.0.1:4173/?canvas=<canvasId>` for visual verification. Install or enable the bundled Browser plugin in the ChatGPT / Codex Browser settings to allow local browser inspection.

## Sessions and author labels

Use a different `canvasId` for each conversation and keep that value unchanged across all tool calls in the same conversation. The browser URL must use the same value in its `canvas` query parameter.

Author labels are hidden by default without removing author metadata. Enable **Author labels** in the top-left display controls when provenance is needed. For a clean MCP preview, call `canvas_get_view` with `includeAuthors: false`.

## Recommended agent workflow

1. Choose a unique `canvasId` for the conversation and reuse it for every tool call.
2. Call `canvas_get_scene` before changing the canvas.
3. Call `canvas_get_view` when layout, overlap, density, or freehand content must be understood visually.
4. Add or update elements in batches.
5. Preserve existing content unless the user explicitly asks to erase or clear it.
6. Use `canvas_undo` when a canvas operation needs to be reverted.
7. Open the matching browser URL, hide author labels, and inspect the actual layout before delivery.

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

The unnamed default canvas is stored in `data/scene.json` and `data/history.json`. Named sessions are stored under `data/canvases/<canvasId>/scene.json` and `history.json`. All runtime data is ignored by Git.

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
