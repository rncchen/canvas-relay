import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

const testDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "canvas-relay-store-"));
process.env.CANVAS_RELAY_DATA_DIR = testDirectory;
const { applyCommand, composeLayers, readScene } = await import(`../lib/scene-store.mjs?test=${Date.now()}`);

test.after(async () => {
  await fs.rm(testDirectory, { recursive: true, force: true });
});

test("stores author metadata and supports undo and redo", async () => {
  const added = await applyCommand({
    action: "add",
    author: { type: "human", name: "測試者" },
    elements: [{ type: "note", x: 100, y: 120, width: 240, height: 140, text: "持續討論" }]
  }, { authorType: "human" });

  assert.equal(added.scene.revision, 1);
  assert.equal(added.scene.elements.length, 1);
  assert.deepEqual(added.scene.elements[0].createdBy, { type: "human", name: "測試者" });

  const undone = await applyCommand({ action: "undo", author: { type: "human", name: "測試者" } }, { authorType: "human" });
  assert.equal(undone.scene.elements.length, 0);
  assert.equal(undone.scene.revision, 2);

  const redone = await applyCommand({ action: "redo", author: { type: "human", name: "測試者" } }, { authorType: "human" });
  assert.equal(redone.scene.elements.length, 1);
  assert.equal(redone.scene.revision, 3);
  assert.equal((await readScene()).revision, 3);
});

test("preserves creator while recording the latest editor", async () => {
  const scene = await readScene();
  const id = scene.elements[0].id;
  const updated = await applyCommand({
    action: "update",
    author: { type: "ai", name: "Codex" },
    updates: [{ id, changes: { text: "由 AI 延續" } }]
  });

  assert.equal(updated.scene.elements[0].createdBy.type, "human");
  assert.equal(updated.scene.elements[0].text, "持續討論");
  assert.deepEqual(updated.scene.composite.elements[0].lastEditedBy, { type: "ai", name: "Codex" });
  assert.equal(updated.scene.composite.elements[0].text, "由 AI 延續");
  assert.equal(updated.scene.effects[0].author.type, "ai");
  assert.equal(updated.scene.layers.semantics, "current-result-by-creator");
  assert.deepEqual(updated.scene.layers.human.elementIds, [id]);
  assert.deepEqual(updated.scene.layers.ai.elementIds, []);
});

test("keeps erasure applied while filtering the current result by creator", async () => {
  const scene = await readScene();
  const id = scene.elements[0].id;
  const erased = await applyCommand({
    action: "delete",
    author: { type: "ai", name: "Claude" },
    ids: [id]
  });

  assert.equal(erased.scene.elements.length, 1);
  assert.equal(erased.scene.composite.elements.length, 0);
  assert.equal(erased.scene.effects.at(-1).type, "erase");
  assert.deepEqual(erased.scene.effects.at(-1).author, { type: "ai", name: "Claude" });

  const continued = await applyCommand({
    action: "add",
    author: { type: "ai", name: "Claude" },
    elements: [{ type: "note", x: 360, y: 120, width: 240, height: 140, text: "AI 新增的 B" }]
  });

  const humanLayerOnly = composeLayers(continued.scene, ["human"]);
  assert.equal(humanLayerOnly.elements.length, 0);
  assert.equal(humanLayerOnly.erased.length, 1);

  const aiLayerOnly = composeLayers(continued.scene, ["ai"]);
  assert.equal(aiLayerOnly.elements.length, 1);
  assert.equal(aiLayerOnly.elements[0].text, "AI 新增的 B");
  assert.deepEqual(continued.scene.layers.human.elementIds, []);
  assert.deepEqual(continued.scene.layers.ai.elementIds, [aiLayerOnly.elements[0].id]);
});
