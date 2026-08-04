# Development guide

## Project layout

```text
.
|-- lib/
|   `-- scene-store.mjs
|-- public/
|   |-- app.js
|   |-- index.html
|   `-- styles.css
|-- test/
|   |-- mcp.test.mjs
|   `-- scene-store.test.mjs
|-- mcp.mjs
|-- server.mjs
`-- package.json
```

The runtime `data/` directory is intentionally absent from version control. It is created automatically.

## Commands

```powershell
# Start only the browser application
npm start

# Start the MCP server and its browser application
npm run mcp

# Run all tests
npm test
```

The default browser URL is `http://127.0.0.1:4173`. Use `http://127.0.0.1:4173/?canvas=<canvasId>` when testing a named session. Normal MCP clients launch `mcp.mjs`, which starts the HTTP server automatically; `npm start` is only needed for browser-only development or startup troubleshooting.

## Development principles

- Keep the runtime dependency-free unless a new dependency clearly reduces maintenance or security risk.
- Preserve source creator identity when adding edit behavior.
- Express updates and erasures as effects instead of rewriting source elements.
- Call the shared scene store from both HTTP and MCP surfaces so behavior stays consistent.
- Keep the browser interface desktop-oriented. This tool is designed for a desktop MCP workflow.
- Keep JSON-RPC output isolated on standard output. Diagnostics belong on standard error.
- Keep visible interface strings in the translation table.

## Adding an element field

Update every place that owns or renders the field:

1. Add normalization and update validation in `lib/scene-store.mjs`.
2. Extend the MCP schema in `mcp.mjs`.
3. Update MCP SVG rendering when the field affects appearance.
4. Update browser rendering and editing in `public/app.js`.
5. Add storage and MCP tests.

## Adding an MCP tool

1. Define the tool and input schema in `mcp.mjs`.
2. Add dispatch behavior in `callTool`.
3. Reuse `applyCommand` for mutations whenever possible.
4. Return both readable text and structured content.
5. Add a protocol-level test in `test/mcp.test.mjs`.
6. Document the tool in `README.md`.

## Manual desktop QA

Automated tests do not validate browser layout. Before publishing a UI change, verify the application in a real desktop browser at common desktop widths.

Check the following:

- Tool names remain fully visible in all three languages.
- The toolbar grows with its longest localized label.
- The inspector and canvas retain usable space.
- Drawing, selecting, moving, resizing, duplicating, editing, and erasing work.
- Pan and zoom preserve pointer alignment.
- Human and AI visibility filters produce the expected composite result.
- Author labels can be shown independently and are hidden by default.
- Different `canvasId` values keep elements, revisions, and undo history isolated.
- Undo and redo work across browser and MCP operations.
- JSON and SVG exports download successfully.
- Long scene names and activity entries do not break the layout.

## API checks

```powershell
Invoke-RestMethod http://127.0.0.1:4173/api/health
Invoke-RestMethod http://127.0.0.1:4173/api/scene
```

Use a temporary data directory for destructive experiments:

```powershell
$env:CANVAS_RELAY_DATA_DIR = Join-Path $env:TEMP canvas-relay-dev
npm start
```

Do not reuse common system environment variables for task-specific paths.

## Publishing checklist

- Run `npm test`.
- Complete the manual desktop QA checklist.
- Confirm `.mcp.json` and runtime scene files are not staged.
- Confirm documentation links resolve.
- Review staged changes with `git diff --cached`.
- Choose and add a license before publishing if the repository is intended for reuse by others.
- Commit and push only after explicit approval from the repository owner.
