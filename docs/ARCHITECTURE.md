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
data/scene.json and data/history.json
```

The browser and MCP server run as separate processes. Both call the same storage module, which serializes writes through a lock file and uses atomic file replacement.

## Components

### Browser application

Files: `public/index.html`, `public/styles.css`, and `public/app.js`.

The browser application renders an SVG canvas and provides desktop controls for selection, panning, drawing, erasing, resizing, text editing, zooming, layer filtering, export, and activity inspection. It polls the scene endpoint and submits human-authored commands to the HTTP server.

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

The MCP server communicates with clients over newline-delimited JSON-RPC on standard input/output. It negotiates supported MCP protocol versions, publishes canvas tools and resources, validates tool arguments, and renders a portable SVG view of the composite scene.

Diagnostic output is written to standard error so standard output remains valid JSON-RPC.

### Scene store

File: `lib/scene-store.mjs`.

The scene store owns normalization, persistence, composition, history, and authorship rules. Runtime files are written under `data/` by default or under `CANVAS_RELAY_DATA_DIR` when configured.

## Scene model

The scene uses schema version 2 and contains these top-level fields:

- `canvas`: name, width, height, and background.
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

1. Acquire `data/.scene.lock`.
2. Load scene and history state.
3. Validate and normalize the command.
4. Save the previous scene in bounded history.
5. Apply the command and increment the revision.
6. Atomically replace history and scene JSON files.
7. Release the lock.

History keeps up to 100 past scenes. Activity keeps up to 80 recent events. A stale lock older than ten seconds can be removed by the next writer.

Atomic replacement includes retries for transient Windows file locking, which is useful when the repository is stored in a synchronized folder.

## Trust boundary

Canvas Relay is a local development tool. The HTTP server has no user authentication and intentionally binds only to the loopback interface. The MCP process has access to the configured data directory and should be launched only by trusted local clients.

Runtime scenes may contain private discussion content. They are excluded from Git by default.
