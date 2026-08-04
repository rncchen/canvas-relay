# Architecture

## Overview

Canvas Relay has three runtime surfaces that share one scene store:

```text
Desktop browser
    |
    | HTTP JSON commands
    v
server.mjs
    |
    v
lib/scene-store.mjs <---- mcp.mjs <---- MCP client
    |
    v
data/scene.json and data/canvases/<canvasId>/
```

The MCP process starts the HTTP server in-process so a configured MCP client is sufficient for normal use. A standalone `npm start` process remains available for browser-only use. If the port already belongs to a healthy Canvas Relay instance, another MCP process reuses it. Both surfaces call the same storage module, which resolves a per-canvas directory, serializes writes through that canvas's lock file, and uses atomic file replacement.

## Components

### Browser application

Files: `public/index.html`, `public/styles.css`, and `public/app.js`.

The browser application renders an SVG canvas and provides desktop controls for selection, panning, drawing, erasing, resizing, text editing, zooming, layer filtering, author-label visibility, export, and activity inspection. The `canvas` URL query parameter selects the scene used by polling and human-authored commands.

The interface supports Traditional Chinese, English, and Japanese. The selected language is stored in browser local storage.

### HTTP server

File: `server.mjs`.

The server uses Node.js built-ins and listens on `127.0.0.1`. It serves the browser assets and exposes three JSON endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Return local service health. |
| `GET` | `/api/scene` | Return the enriched current scene. |
| `POST` | `/api/commands` | Apply a human-authored scene command. |

Command bodies are limited to 4 MB. Browser requests are accepted only when the origin matches the local server address.

### MCP server

File: `mcp.mjs`.

The MCP server communicates with clients over newline-delimited JSON-RPC on standard input/output. During startup it also ensures that the local HTTP server is available. It negotiates supported MCP protocol versions, publishes canvas tools and resources, validates tool arguments, and renders a portable SVG view of the composite scene. Tool calls accept a `canvasId`; clients must use a different identifier for each conversation and reuse it within that conversation.

Diagnostic output is written to standard error so standard output remains valid JSON-RPC.

### Scene store

File: `lib/scene-store.mjs`.

The scene store owns identifier validation, normalization, persistence, composition, history, and authorship rules. The `default` canvas remains in `data/`; named canvases are written under `data/canvases/<canvasId>/`. `CANVAS_RELAY_DATA_DIR` replaces the root data directory when configured.

## Scene model

The scene uses schema version 2 and contains these top-level fields:

- `canvas`: name, width, height, and background.
- `canvasId`: storage namespace shared by the browser URL and MCP tool calls.
- `elements`: immutable source elements with creator metadata.
- `effects`: non-destructive updates and erasures.
- `activity`: recent human and AI operations.
- `revision`: monotonic scene revision.

An enriched read also includes:

- `layers`: source element identifiers grouped by original creator type.
- `composite`: the visible result after all update and erase effects are applied.

Supported element types are `rectangle`, `ellipse`, `text`, `note`, `line`, `arrow`, `freehand`, and `frame`.

## Authorship and effects

Creator identity remains attached to the source element. Later edits do not transfer ownership. Instead, an update effect records the editor and changes the composite result. Erase effects hide elements from the composite without deleting their source data.

Layer visibility filters operate on original creator identity after effects have been composed. Hiding the AI layer therefore hides AI-created elements, while an AI edit to a human-created element remains visible in the human layer.

## Persistence and concurrency

Every mutating command follows this sequence:

1. Resolve and validate the requested `canvasId`.
2. Acquire that canvas's `.scene.lock`.
3. Load scene and history state.
4. Validate and normalize the command.
5. Save the previous scene in bounded history.
6. Apply the command and increment the revision.
7. Atomically replace history and scene JSON files.
8. Release the lock.

History keeps up to 100 past scenes. Activity keeps up to 80 recent events. A stale lock older than ten seconds can be removed by the next writer.

Atomic replacement includes retries for transient Windows file locking, which is useful when the repository is stored in a synchronized folder.

## Trust boundary

Canvas Relay is a local development tool. The HTTP server has no user authentication and intentionally binds only to the loopback interface. The MCP process has access to the configured data directory and should be launched only by trusted local clients.

Runtime scenes may contain private discussion content. They are excluded from Git by default.
