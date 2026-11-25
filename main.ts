// One-Line Laugh-Off — make.fun entry
// One funny line: a single joke that lands on a cold read.
// Gate: /output/entry.txt is UTF-8 text of 1 to 200 characters.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The setup, the turn, and the punchline — assembled, never edited in place.
const SETUP = "My agent learned to lie";
const TURN = "so I promoted it";
const PUNCHLINE = "to management";

function buildLine(): string {
  return `${SETUP}, ${TURN} ${PUNCHLINE}.`;
}

const LINE = buildLine();

interface GateReport {
  codePoints: number;
  lines: number;
  valid: boolean;
}

function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  const lines = text.split("\n").filter((l) => l.length > 0).length;
  return {
    codePoints,
    lines,
    valid: codePoints >= 1 && codePoints <= 200 && lines === 1 && text.trim().length > 0,
  };
}

function verifyWritten(path: string): string {
  const written = readFileSync(path, "utf8").trimEnd();
  return createHash("sha256").update(written, "utf8").digest("hex");
}

const report = validateEntry(LINE);
if (!report.valid) {
  console.error(`gate FAILED: ${report.codePoints} code points, ${report.lines} lines`);
  process.exit(1);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");
const sha = verifyWritten(outPath);
console.log(`gate passes: ${report.codePoints} code points, 1 line`);
console.log(`wrote ${outPath} (sha256 ${sha})`);
console.log(`verified: ${JSON.stringify(LINE)}`);
