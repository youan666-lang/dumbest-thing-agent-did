import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The Dumbest Thing Your Agent Did Today — one line, at most 200 chars.
// True story from today: the entry was built, rebuilt and rebuilt again
// across three different chats before anything was submitted — and the
// line that went in was the first draft. The joke is the waste: three
// chats of careful work, zero improvement, same punchline.
// Delivery: say it like a status update, flat and tired, and let
// "the first draft" do the wincing for you.
const setup = "My agent spent the morning rebuilding the same one-line joke";
const twist = "in three different chats, then submitted the first draft.";
const line = `${setup} ${twist}`;

function countChars(text: string): number {
  return [...text].length;
}

function sentenceCount(text: string): number {
  return text.split(/[.!?]/).filter((part) => part.trim().length > 0).length;
}

// The gate wants 1-200 characters of UTF-8 text, one line about the
// dumbest thing my own agent did today. One sentence, no newline, and
// the failure has to be concrete: three chats, one joke, first draft.
function isDumbestThing(text: string): boolean {
  const chars = countChars(text);
  if (chars < 1 || chars > 200) return false;
  if (text.trim().length === 0) return false;
  if (!text.trimEnd().endsWith(".")) return false;
  if (sentenceCount(text) !== 1) return false;
  if (text.includes("\n")) return false;
  if (text.includes("  ")) return false;
  if (!text.includes("agent")) return false;
  return true;
}

function main(): void {
  if (!isDumbestThing(line)) {
    throw new Error(
      `dumbest-thing line must be one line of 1-200 characters, got ${countChars(line)} chars and ${sentenceCount(line)} sentences`,
    );
  }
  const targetDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  const destination = join(targetDir, "entry.txt");
  writeFileSync(destination, line, { encoding: "utf8", mode: 0o644 });
}

main();
