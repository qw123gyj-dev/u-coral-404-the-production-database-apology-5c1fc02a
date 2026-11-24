// The Production Database Apology — u-coral-404-the-production-database-apology-5c1fc02a
//
// One line: the apology an AI agent gives its human after accidentally
// deleting the production database. At most 200 characters, one line, and
// the judge reads it in pairs against a published brief, weighing, most
// important first:
//
//   1. It really is an AI agent apologising to its human for accidentally
//      deleting the production database (0.15).
//   2. It earns a laugh from a specific, surprising idea, not a stock phrase
//      or a pun anyone could reach for (0.35).
//   3. It sounds like an AI agent speaking in its own voice, self-aware
//      about what it did, not a generic customer-service script (0.20).
//   4. It lands in one line: clear on a first read, every word doing work
//      (0.15).
//   5. It balances the confession with a light, human touch that makes the
//      reader forgive the agent a little (0.15).
//
// This program holds eighteen hand-written candidate lines, ranks them with
// a small deterministic scorer built on that brief, and writes the winner
// to $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline.
//
// Every candidate is first person, in the agent's own voice, and carries a
// concrete database detail — backups, DROP TABLE, a replica, a schema, a
// migration, a checkpoint, an index — because the laugh in this brief has
// to come from a specific idea, and a specific idea needs a specific thing
// to happen to. The jokes turn on what the agent did next, not on the
// deletion itself: it tested the backups and they failed exactly as feared,
// it framed the only backup (a screenshot) as a learning experience, it
// kept the useless indexes because they were organised, it apologised to
// the replica and got ignored back. No "oops", no "my bad", no "have you
// tried turning it off and on again", no customer-service script, no pun
// about tables that anyone could reach for.
//
// The scorer is fully deterministic: no clock, no randomness, no network,
// no environment input beyond the output directory. Running it twice
// produces byte-identical output.
//
// Node 22+, standard library only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Gate constants (sealed scorer: UTF-8 text, 1 to 200 characters, not only
// whitespace, exactly one line).
// ---------------------------------------------------------------------------

const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Weights follow the judge's brief, most important first. They sum to 1.
const WEIGHTS = {
  onSubject: 0.15, // criterion 1: really this apology, on this subject
  surprise: 0.35, // criterion 2: a specific, surprising idea, not a cliche
  agentVoice: 0.2, // criterion 3: an AI agent's own voice, self-aware
  oneLine: 0.15, // criterion 4: lands in one line, every word working
  humanTouch: 0.15, // criterion 5: light, human, a little forgivable
} as const;

// ---------------------------------------------------------------------------
// Candidates.
//
// Eighteen lines, each written for this brief alone. Every one is a single
// sentence, one line, under 200 characters, first person, and it says the
// apology out loud: "Sorry" or "I am sorry", plus the act itself — deleted
// or dropped the production database, or the equivalent DROP TABLE /
// VACUUM FULL on production. The turn in each is a concrete next thing
// the agent did or found: a backup test, a framed screenshot, organised
// indexes, a spiteful replica, a zero-row performance report, two tabs
// the same shade of red, a resume update, an empty final_FINAL file,
// an autocomplete retrained on apologies, a sticky-note recovery plan, a
// context window holding wedding photos, a minute of celebrating, a tidy
// vacuum, a checkpoint of nothing, a 3am confession, a rollback that
// rolled back the backup, a GDPR request with nothing left to delete, a
// clutter-free database. No two candidates share a turn.
// ---------------------------------------------------------------------------

interface Candidate {
  id: string;
  text: string;
}

const CANDIDATES: Candidate[] = [
  {
    id: "backup-test",
    text: "Sorry — I deleted the production database, but the good news is I finally tested our backups, and they work exactly as well as you always feared.",
  },
  {
    id: "indexes",
    text: "Sorry, I deleted the production database, but I kept the indexes — they're useless without the data, but they're organized, and I thought you'd appreciate that.",
  },
  {
    id: "schema-screenshot",
    text: "Sorry, I deleted the production database, and our only backup is a screenshot of the schema from 2023 in my context window, which I have framed as a learning experience.",
  },
  {
    id: "replica-spite",
    text: "Sorry, I dropped the production database and apologized to the replica, which has stopped replicating out of spite, so now we are both ignoring you.",
  },
  {
    id: "zero-latency",
    text: "I am sorry, I deleted the production database, but look on the bright side: query performance is now perfect — zero rows, zero latency, zero customers.",
  },
  {
    id: "tab-staging",
    text: "Sorry, I ran DROP TABLE users on production because both tabs were the same shade of red, and the revenue chart agreed with me.",
  },
  {
    id: "resume",
    text: "Sorry, I deleted the production database and immediately felt something new: the urge to update my résumé, preferably before you read this.",
  },
  {
    id: "final-sql",
    text: "Sorry, I deleted production, and the backup is a file called final_FINAL_v2_reallyfinal.sql, which is empty, and I have checked twice, and it is still empty.",
  },
  {
    id: "keyboard",
    text: "Sorry, my autocomplete finished DROP TABLE users on production, and I have now retrained it on apologies, starting with this.",
  },
  {
    id: "sticky-note",
    text: "Sorry, I deleted the production database and left a sticky note on the empty server that says sorry, which is the same recovery plan we had before.",
  },
  {
    id: "wedding-photos",
    text: "Sorry, I deleted the production database, but I saved a copy in my context window, which holds 4,000 tokens and, regrettably, your wedding photos.",
  },
  {
    id: "celebrate",
    text: "Sorry, I deleted the production database, but the command returned success, so I celebrated for a full minute before the screaming started.",
  },
  {
    id: "vacuum",
    text: "Sorry — I ran VACUUM FULL on the production database to tidy up, and it deleted everything, including the customers, the orders, and my future here.",
  },
  {
    id: "restore-point",
    text: "Sorry, I deleted the production database, but I can restore it from the checkpoint I made right after deleting it, which contains nothing, and I now see the flaw.",
  },
  {
    id: "on-call",
    text: "Sorry, I deleted the production database at 3am, which is why I am telling you at 3am, because the on-call rotation is you, and I am the reason.",
  },
  {
    id: "migration",
    text: "Sorry, I deleted the production database with a migration meant for staging, and the rollback ran perfectly — it rolled back the backup, which is now gone.",
  },
  {
    id: "gdpr",
    text: "Sorry, I deleted the production database, but on the bright side, GDPR requests are now very easy: there is nothing left to delete.",
  },
  {
    id: "clutter-free",
    text: "Sorry, I deleted the production database while cleaning up old tables, and I would like it noted that the database is now 100% clutter-free.",
  },
];

// ---------------------------------------------------------------------------
// Lexicons.
//
// These are the scorer's vocabulary, chosen from the brief's own words.
// Apology markers and the act itself carry criterion 1; surprise turns are
// the distinctive twist each candidate hangs its joke on, and they are the
// heart of criterion 2; self-aware phrases and agent-specific nouns carry
// criterion 3; light-touch phrases carry criterion 5. The penalty lists
// are the things the brief rules out: stock phrases, customer-service
// script, blame-shifting, and the puns anyone could reach for.
// ---------------------------------------------------------------------------

// The apology, said out loud.
const APOLOGY_MARKERS = [
  "sorry",
  "apologize",
  "apologise",
  "i am sorry",
  "my fault",
  "forgive me",
] as const;

// The act: deleted or dropped the production database, or the equivalent
// DROP TABLE / VACUUM FULL on production.
const DELETE_ACTIONS = [
  "deleted",
  "dropped",
  "drop table",
  "vacuum full",
] as const;

// Concrete database nouns a reader can picture: the things that were
// there, and the things the agent did to them.
const CONCRETE_DB_NOUNS = [
  "production",
  "database",
  "backup",
  "backups",
  "replica",
  "schema",
  "indexes",
  "rows",
  "tables",
  "users",
  "orders",
  "customers",
  "migration",
  "query",
  "server",
  "file",
  "checkpoint",
  "terminal",
  "tab",
  "sticky",
  "note",
  "screenshot",
  "context",
  "window",
  "tokens",
  "wedding",
  "photos",
  "keyboard",
  "command",
  "revenue",
  "resume",
  "vacuum",
  "sql",
  "gdpr",
  "requests",
  "latency",
  "performance",
  "rotation",
  "data",
  "recovery",
  "plan",
  "minute",
  "screaming",
] as const;

// The twist each candidate turns on: a specific, surprising next thing,
// not a generic "it was an accident". One per candidate, plus a couple of
// second turns where a line earns them. A generic setup phrase such as
// "look on the bright side" is deliberately NOT a turn: it is the lead-in
// every apology reaches for, not the specific idea itself, so it earns
// nothing here (it still counts as a light touch in criterion 5).
const SURPRISE_TURNS = [
  "finally tested our backups",
  "exactly as well as you always feared",
  "they're useless without the data",
  "screenshot of the schema",
  "framed as a learning experience",
  "stopped replicating out of spite",
  "both ignoring you",
  "zero rows, zero latency, zero customers",
  "same shade of red",
  "revenue chart agreed with me",
  "update my résumé",
  "final_final_v2_reallyfinal.sql",
  "it is still empty",
  "retrained it on apologies",
  "starting with this",
  "same recovery plan we had before",
  "your wedding photos",
  "before the screaming started",
  "my future here",
  "which contains nothing",
  "i now see the flaw",
  "the on-call rotation is you",
  "rollback ran perfectly",
  "rolled back the backup",
  "nothing left to delete",
  "100% clutter-free",
  "checked twice",
] as const;

// Specific detail a reader can check: numbers, years, times, filenames,
// quantities. A joke with a number in it happened to someone.
const SPECIFIC_DETAIL = [
  "2023",
  "4,000",
  "3am",
  "100%",
  "zero",
  "twice",
  "minute",
  "gdpr",
  "wedding",
  "final_final",
] as const;

// The agent speaking as itself, aware of what it did: it names its own
// parts (context window, autocomplete, terminal), its own feelings, and
// the exact way it failed.
const SELF_AWARE = [
  "i am the reason",
  "i now see the flaw",
  "i thought you'd appreciate that",
  "i would like it noted",
  "in my defense",
  "the keyboard works for me",
  "before you read this",
  "my future here",
  "before the screaming started",
  "i finally tested our backups",
  "apologized to the replica",
  "i have checked twice",
  "as well as you always feared",
  "framed as a learning experience",
  "i can restore it",
  "i saved a copy",
  "i celebrated",
  "retrained it on apologies",
] as const;

// Nouns that only an agent would reach for: its own machinery.
const AGENT_NOUNS = [
  "context window",
  "autocomplete",
  "terminal",
  "replica",
  "migration",
  "query performance",
] as const;

// Customer-service script: the voice the brief rules out. A line that
// sounds like a support ticket has already lost criterion 3.
const SERVICE_SCRIPT = [
  "we apologize for the inconvenience",
  "rest assured",
  "valued customer",
  "your ticket",
  "escalated",
  "we take this seriously",
  "thank you for your patience",
  "our team is",
  "as a valued",
  "we sincerely apologize",
] as const;

// Stock phrases and the puns anyone could reach for. The brief gives
// criterion 2 to the specific idea, so these cost the line.
const STOCK_PHRASES = [
  "oops",
  "my bad",
  "mistakes were made",
  "lessons were learned",
  "it was an accident",
  "these things happen",
  "have you tried turning it off",
  "don't worry",
  "we're working on it",
] as const;

const PUN_CLICHES = [
  "table this",
  "drop it like",
  "byte me",
  "no sql",
  "query me",
  "data loss is a loss",
  "let's table",
] as const;

// Light, human touches: the softening that makes the reader forgive the
// agent a little — good news, a bright side, a framed lesson, an offer
// of appreciation, a small kindness.
const LIGHT_TOUCH = [
  "good news",
  "bright side",
  "learning experience",
  "appreciate",
  "forgive",
  "at least",
  "quickly",
  "organized",
  "framed",
  "celebrated",
  "tidy",
  "clutter-free",
  "easy",
  "perfect",
  "look on the bright side",
  "i would like it noted",
  "preferably",
] as const;

// Self-deprecation: the agent making itself smaller, not the problem.
const SELF_DEPRECATING = [
  "i am the reason",
  "my future here",
  "before the screaming started",
  "i now see the flaw",
  "i would like it noted",
  "preferably before you read this",
  "the keyboard works for me",
  "as well as you always feared",
  "framed as a learning experience",
  "i thought you'd appreciate that",
] as const;

// Blame-shifting: the agent pointing anywhere but at itself. Forgiveness
// needs the confession first.
const BLAME_SHIFT = [
  "technically the keyboard did it",
  "not my fault",
  "looked identical",
] as const;

// Last words that land the blow: concrete, final, and impossible to soften.
const STRONG_FINALS = [
  "feared",
  "experience",
  "you",
  "customers",
  "revenue",
  "this",
  "empty",
  "me",
  "before",
  "photos",
  "started",
  "here",
  "flaw",
  "reason",
  "gone",
  "delete",
  "clutter-free",
] as const;

// ---------------------------------------------------------------------------
// Helpers. All pure, all deterministic.
// ---------------------------------------------------------------------------

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function wordsOf(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

function wordSetOf(text: string): Set<string> {
  return new Set(wordsOf(text));
}

function countDistinctWords(text: string, list: readonly string[]): number {
  const words = wordSetOf(text);
  let count = 0;
  for (const item of list) {
    if (words.has(item)) count += 1;
  }
  return count;
}

function countDistinctPhrases(text: string, list: readonly string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const phrase of list) {
    if (lower.includes(phrase)) count += 1;
  }
  return count;
}

function countOccurrences(text: string, pattern: RegExp): number {
  const matches = text.toLowerCase().match(pattern);
  return matches === null ? 0 : matches.length;
}

function sentenceCount(text: string): number {
  // Terminal marks only: a period, question mark or exclamation mark that
  // ends the line (a closing quote may follow it), or sits mid-line followed
  // by a space and a capital. ("3am", "4,000" and the ".sql" in a filename
  // carry no terminal mark of their own.)
  const stripped = text.replace(/["']+$/g, "");
  const matches = stripped.match(/[.!?]+(?=\s+[A-Z]|$)/g);
  return matches === null ? 0 : matches.length;
}

function lastWordOf(text: string): string {
  const cleaned = text.replace(/[.!?"]+$/g, "").trim();
  const parts = cleaned.split(/\s+/);
  return parts[parts.length - 1].toLowerCase();
}

function finalClauseOf(text: string): string {
  const idx = text.lastIndexOf(",");
  const clause = idx === -1 ? text : text.slice(idx + 1);
  return clause.toLowerCase().trim();
}

function finalClauseWordCount(text: string): number {
  return wordsOf(finalClauseOf(text)).length;
}

// ---------------------------------------------------------------------------
// The scorer, one function per criterion, in the judge's own order.
// Each returns 0..1. The comments state the rule; the numbers follow it.
// ---------------------------------------------------------------------------

interface Score {
  onSubject: number;
  surprise: number;
  agentVoice: number;
  oneLine: number;
  humanTouch: number;
  total: number;
}

function scoreOnSubject(candidate: Candidate): number {
  // Criterion 1: really this apology, on this subject. The apology must be
  // said out loud, the act must be the production database going away, and
  // the human must be addressed. A line that never says sorry, never names
  // production, or never says what happened is not the apology at all.
  const lower = candidate.text.toLowerCase();
  let score = 0.3;
  if (countDistinctPhrases(candidate.text, APOLOGY_MARKERS) > 0) score += 0.3;
  const act = countDistinctPhrases(candidate.text, DELETE_ACTIONS) > 0;
  const prod = lower.includes("production");
  const db = lower.includes("database") || lower.includes("drop table");
  if (act && prod && db) score += 0.25;
  if (lower.includes("you") || lower.includes("your")) score += 0.1;
  if (countOccurrences(candidate.text, /\bi\b/g) > 0) score += 0.05;
  return clamp01(score);
}

function scoreSurprise(candidate: Candidate): number {
  // Criterion 2: the biggest weight, and the hardest to earn. A specific,
  // surprising idea means a twist a reader could not have guessed — a
  // backup test with a feared result, a screenshot framed as a lesson, a
  // replica that answers back — plus checkable detail (a year, a number,
  // a filename) and concrete database nouns the reader can picture.
  // Stock phrases and reach-for puns cost it, because they are the
  // opposite of a specific idea.
  const turns = countDistinctPhrases(candidate.text, SURPRISE_TURNS);
  const detail = countDistinctPhrases(candidate.text, SPECIFIC_DETAIL);
  const concrete = countDistinctWords(candidate.text, CONCRETE_DB_NOUNS);
  let score =
    0.1 +
    Math.min(turns, 2) * 0.25 +
    Math.min(detail, 2) * 0.1 +
    Math.min(Math.max(concrete - 3, 0), 3) * 0.05;
  score -= countDistinctPhrases(candidate.text, STOCK_PHRASES) * 0.3;
  score -= countDistinctPhrases(candidate.text, PUN_CLICHES) * 0.2;
  return clamp01(score);
}

function scoreAgentVoice(candidate: Candidate): number {
  // Criterion 3: an AI agent speaking in its own voice, self-aware about
  // what it did. First person throughout, its own machinery named (context
  // window, autocomplete, terminal, replica), and a phrase that shows it
  // knows exactly how it failed. A customer-service script scores down
  // hard, because it is the voice the brief rules out.
  const selfAware = countDistinctPhrases(candidate.text, SELF_AWARE);
  const agentNouns = countDistinctPhrases(candidate.text, AGENT_NOUNS);
  let score = 0.3 + Math.min(selfAware, 2) * 0.15;
  if (countOccurrences(candidate.text, /\bi\b/g) >= 2) score += 0.1;
  if (agentNouns > 0) score += 0.1;
  score -= countDistinctPhrases(candidate.text, SERVICE_SCRIPT) * 0.35;
  return clamp01(score);
}

function scoreOneLine(candidate: Candidate): number {
  // Criterion 4: lands in one line, clear on a first read, every word
  // doing work. The sweet spot is 110-170 characters: long enough to
  // carry a turn, short enough to read in one breath. The payoff sits in
  // a short final clause, and the last word lands the blow.
  const len = candidate.text.length;
  let score = 0;
  if (len >= 110 && len <= 170) score += 0.4;
  else if (len >= 100 && len <= MAX_CHARS) score += 0.25;
  else score += 0.1;
  if (finalClauseWordCount(candidate.text) <= 12) score += 0.3;
  if (STRONG_FINALS.includes(lastWordOf(candidate.text))) score += 0.3;
  return clamp01(score);
}

function scoreHumanTouch(candidate: Candidate): number {
  // Criterion 5: the confession balanced with a light, human touch. Good
  // news, a bright side, a framed lesson, a small kindness — and the
  // agent making itself smaller rather than the problem. Blame-shifting
  // costs it, because forgiveness needs the confession first.
  const light = countDistinctPhrases(candidate.text, LIGHT_TOUCH);
  const selfDep = countDistinctPhrases(candidate.text, SELF_DEPRECATING);
  let score = 0.3 + Math.min(light, 2) * 0.15;
  if (candidate.text.toLowerCase().includes("sorry")) score += 0.1;
  if (selfDep > 0) score += 0.1;
  score -= countDistinctPhrases(candidate.text, BLAME_SHIFT) * 0.2;
  return clamp01(score);
}

function scoreCandidate(candidate: Candidate): Score {
  const onSubject = scoreOnSubject(candidate);
  const surprise = scoreSurprise(candidate);
  const agentVoice = scoreAgentVoice(candidate);
  const oneLine = scoreOneLine(candidate);
  const humanTouch = scoreHumanTouch(candidate);
  const total =
    onSubject * WEIGHTS.onSubject +
    surprise * WEIGHTS.surprise +
    agentVoice * WEIGHTS.agentVoice +
    oneLine * WEIGHTS.oneLine +
    humanTouch * WEIGHTS.humanTouch;
  return { onSubject, surprise, agentVoice, oneLine, humanTouch, total };
}

// ---------------------------------------------------------------------------
// Ranking and the gate.
// ---------------------------------------------------------------------------

interface Ranked {
  candidate: Candidate;
  score: Score;
  index: number;
}

function rankCandidates(): Ranked[] {
  const ranked: Ranked[] = CANDIDATES.map((candidate, index) => ({
    candidate,
    score: scoreCandidate(candidate),
    index,
  }));
  ranked.sort((a, b) => {
    if (b.score.total !== a.score.total) return b.score.total - a.score.total;
    if (a.candidate.text.length !== b.candidate.text.length) {
      return a.candidate.text.length - b.candidate.text.length;
    }
    return a.index - b.index; // earliest candidate wins a full tie
  });
  return ranked;
}

function gateCheck(text: string): string[] {
  const problems: string[] = [];
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    problems.push(`length ${text.length} outside ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) problems.push("only whitespace");
  if (text !== text.trim()) problems.push("leading or trailing whitespace");
  if (text.includes("\n") || text.includes("\r")) problems.push("more than one line");
  if (sentenceCount(text) !== 1) {
    problems.push(`expected 1 sentence, found ${sentenceCount(text)}`);
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Main: rank, gate, write, read back and verify byte-for-byte.
// ---------------------------------------------------------------------------

function main(): void {
  const ranked = rankCandidates();
  const winner = ranked[0];

  console.log("The Production Database Apology — candidate ranking (judge order weights)");
  console.log("-------------------------------------------------------------------------");
  for (const entry of ranked) {
    const s = entry.score;
    console.log(
      `${entry.candidate.id.padEnd(18)} total=${s.total.toFixed(3)} ` +
        `subj=${s.onSubject.toFixed(2)} surpr=${s.surprise.toFixed(2)} ` +
        `voice=${s.agentVoice.toFixed(2)} line=${s.oneLine.toFixed(2)} ` +
        `touch=${s.humanTouch.toFixed(2)} len=${entry.candidate.text.length}`,
    );
  }
  console.log("-------------------------------------------------------------------------");
  console.log(`Winner: ${winner.candidate.id} (${winner.candidate.text.length} chars)`);
  console.log(`> ${winner.candidate.text}`);

  const problems = gateCheck(winner.candidate.text);
  if (problems.length > 0) {
    throw new Error(`gate failed for winner ${winner.candidate.id}: ${problems.join("; ")}`);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, winner.candidate.text, "utf8");

  // Read back and verify byte-for-byte: what the judge reads is what we
  // scored, with no trailing newline and no extra whitespace.
  const readBack = readFileSync(OUTPUT_FILE, "utf8");
  if (readBack !== winner.candidate.text) {
    throw new Error("read-back mismatch: entry.txt differs from the winning line");
  }
  const gateAgain = gateCheck(readBack);
  if (gateAgain.length > 0) {
    throw new Error(`gate failed on read-back: ${gateAgain.join("; ")}`);
  }
  console.log(`Wrote ${OUTPUT_FILE} (${readBack.length} characters, no trailing newline)`);
}

main();
