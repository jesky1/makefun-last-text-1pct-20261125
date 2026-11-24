// Tests for the Last Text at One Percent entry program.
// Run with: node --test test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const EXPECTED =
  "Final text. I watched you type 'I'm 5 mins away' for 40 minutes, I know about the 47 alarms you snooze, and I'm taking your secrets to the grave. Mostly because I have 1% left and no choice.";
const HERE = new URL(".", import.meta.url).pathname;

async function runEntry(dir) {
  await run(process.execPath, [join(HERE, "main.ts")], {
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: dir },
  });
  return readFile(join(dir, "entry.txt"), "utf8");
}

test("entry is written, exact, in gate, deterministic", async () => {
  const first = await mkdtemp(join(tmpdir(), "last-text-a-"));
  const second = await mkdtemp(join(tmpdir(), "last-text-b-"));
  try {
    const a = await runEntry(first);
    const b = await runEntry(second);
    assert.equal(a, EXPECTED);
    assert.equal(b, EXPECTED);
    assert.equal(a, b, "two runs must produce byte-identical output");
    assert.equal([...a].length, 190);
    assert.ok(!a.includes("\n") && !a.includes("\r"), "must be a single line");
    assert.equal(a, a.trim(), "no leading or trailing whitespace");
    assert.ok(a.trim().length > 0, "not whitespace-only");
  } finally {
    await rm(first, { recursive: true, force: true });
    await rm(second, { recursive: true, force: true });
  }
});

test("gate rejects invalid texts and accepts a 200-char one", async () => {
  process.env.MAKEFUN_OUTPUT_DIR = await mkdtemp(join(tmpdir(), "last-text-gate-"));
  const { isGateOk } = await import("./main.ts");

  const rejected = [
    ["201 characters", "word ".repeat(40) + "x"], // 201 chars
    ["whitespace only", "     "],
    ["empty", ""],
    ["two lines", "line one\nline two"],
    ["carriage return", "line one\rline two"],
    ["trailing space", "a real sentence here "],
    ["control character", "a real sentence here\x07"],
    ["no letters", "12345 !!! ???"],
    ["a link", "see this http://example.com now please"],
    ["too few words", "dying now bye"],
  ];
  for (const [label, text] of rejected) {
    assert.equal(isGateOk(text).ok, false, `${label} must be rejected`);
  }

  const exactly200 = "word ".repeat(39) + "words"; // 200 chars, 40 words
  assert.equal([...exactly200].length, 200);
  assert.equal(isGateOk(exactly200).ok, true, "exactly 200 characters must pass");
  assert.equal(isGateOk(EXPECTED).ok, true, "the entry itself must pass");
});
