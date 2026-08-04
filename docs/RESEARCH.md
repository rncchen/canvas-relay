# Research notes

## Problem

Most agent conversations treat diagrams as temporary output. A browser whiteboard and an AI tool often operate on different representations, so authorship, edits, and context are lost between sessions.

Canvas Relay explores a small local-first model in which a person and an MCP-capable assistant share one persistent scene without requiring a hosted collaboration service.

## Questions explored

### Can one scene preserve human and AI authorship?

Yes, when source creator identity is immutable and later changes record a separate editor. This allows the interface to filter by original creator while still showing the latest composed result.

### Can erasing remain reversible without copying the full document?

The current model stores erase effects that reference source element identifiers. This preserves provenance and makes the visible result reversible. Full scene snapshots are still used for bounded undo and redo because the implementation favors clarity over minimal storage.

### Can browser and agent actions share behavior?

Both surfaces call the same `applyCommand` function. This keeps validation, revisions, history, author metadata, and persistence consistent across HTTP and MCP commands.

### Is file-based persistence sufficient?

For one local browser and a small number of local agent processes, an atomic JSON file with a lock is simple and inspectable. It avoids a database dependency and works well for a prototype.

The model becomes less suitable when scenes grow large, writers are distributed across machines, or low-latency multi-user editing is required.

## Current design choices

### Standard input/output MCP transport

The MCP process is launched by the client and communicates over standard input/output. This avoids opening another network port and fits local desktop clients. It also means each client may start its own MCP process, so the shared file lock remains necessary.

### SVG as the common visual format

The browser already uses SVG, and the MCP server can render the same scene into SVG without a browser dependency. SVG preserves text and geometry and is compact enough for tool responses.

Rendering logic currently exists in both `public/app.js` and `mcp.mjs`. This keeps each surface self-contained, but visual parity must be tested when rendering rules change.

### Effect-based composition

Updates and erasures are appended as effects. The approach protects provenance and supports reversible collaboration. The tradeoff is that long-running scenes can accumulate many effects and require compaction.

### Bounded snapshot history

History stores complete previous scenes. This makes undo and redo reliable and easy to reason about. Storage cost grows with scene size, so a future implementation may use command inversion or periodic checkpoints.

## Limitations

- No authentication or remote access model.
- No live push channel; the browser refreshes scene state periodically.
- No conflict-free replicated data type or operational transformation.
- One lock coordinates writers only on the same filesystem.
- No schema migration framework beyond loading defaults into the current schema.
- Browser and MCP SVG renderers can diverge.
- Runtime JSON size grows with source elements, effects, and snapshot history.
- Automated tests do not currently include browser layout or interaction tests.

## Future research

1. Add scene compaction that preserves source provenance while collapsing superseded effects.
2. Compare snapshot history with inverse commands and checkpointed event logs.
3. Add a shared renderer that can run in both browser and Node.js contexts.
4. Evaluate server-sent events or WebSocket updates for lower-latency browser refresh.
5. Define explicit schema migrations and compatibility tests.
6. Explore multi-user synchronization with a conflict-free replicated data type.
7. Add desktop browser visual regression and interaction tests.
8. Measure performance with thousands of elements and long freehand paths.

These items are research directions, not commitments or a published roadmap.
