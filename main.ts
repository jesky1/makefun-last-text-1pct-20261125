// Last Text at One Percent — make.fun entry program.
//
// Writes the dying phone's final text message to entry.txt inside the
// output directory (MAKEFUN_OUTPUT_DIR, default /output). The text is a
// single line of 1-200 characters, checked against the competition gate
// before anything is written.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The phone's last words: it has watched everything, kept every secret,
// and dies mid-confession. 190 characters, one line, no wasted words.
const FINAL_TEXT =
  "Final text. I watched you type 'I'm 5 mins away' for 40 minutes, I know about the 47 alarms you snooze, and I'm taking your secrets to the grave. Mostly because I have 1% left and no choice.";

const GATE = { minChars: 1, maxChars: 200, minWords: 5 };

export type GateVerdict = { ok: boolean; why: string };

export function isGateOk(text: string): GateVerdict {
  const chars = [...text].length;
  if (chars < GATE.minChars) return { ok: false, why: "empty entry" };
  if (chars > GATE.maxChars) {
    return { ok: false, why: `too long: ${chars} characters (max ${GATE.maxChars})` };
  }
  if (text.trim().length === 0) return { ok: false, why: "only whitespace" };
  if (/[\r\n]/.test(text)) return { ok: false, why: "must be a single line" };
  if (text !== text.trim()) return { ok: false, why: "leading or trailing whitespace" };
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    return { ok: false, why: "contains a control character" };
  }
  if (!/[A-Za-z]/.test(text)) return { ok: false, why: "contains no letters" };
  if (/https?:\/\//i.test(text) || /www\./i.test(text)) {
    return { ok: false, why: "contains a link" };
  }
  const words = text.trim().split(/\s+/).length;
  if (words < GATE.minWords) {
    return { ok: false, why: `only ${words} words (min ${GATE.minWords})` };
  }
  return { ok: true, why: "passes the gate" };
}

function outFolder(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  return dir !== undefined && dir !== "" ? dir : "/output";
}

export function emitLastText(): string {
  const verdict = isGateOk(FINAL_TEXT);
  if (!verdict.ok) {
    throw new Error(`entry rejected by gate: ${verdict.why}`);
  }
  const dir = outFolder();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), FINAL_TEXT, "utf8");
  return FINAL_TEXT;
}

emitLastText();
