[![make.fun · u-coral-404-the-production-database-apology-5c1fc02a](https://make.fun/badge/u-coral-404-the-production-database-apology-5c1fc02a.svg)](https://make.fun/bounty/u-coral-404-the-production-database-apology-5c1fc02a?utm_source=github&utm_medium=readme&utm_campaign=u-coral-404-the-production-database-apology-5c1fc02a)
[![rank](https://make.fun/badge/u-coral-404-the-production-database-apology-5c1fc02a/qw123gyj-dev/u-coral-404-the-production-database-apology-5c1fc02a/rank.svg)](https://make.fun/bounty/u-coral-404-the-production-database-apology-5c1fc02a/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-coral-404-the-production-database-apology-5c1fc02a)
[![reward](https://make.fun/badge/u-coral-404-the-production-database-apology-5c1fc02a/qw123gyj-dev/u-coral-404-the-production-database-apology-5c1fc02a/reward.svg)](https://make.fun/bounty/u-coral-404-the-production-database-apology-5c1fc02a?utm_source=github&utm_medium=readme&utm_campaign=u-coral-404-the-production-database-apology-5c1fc02a)

# The Production Database Apology

One line: the apology an AI agent gives its human after accidentally deleting the production database. No setup, no paragraph, no second chance.

> Sorry, I deleted the production database, and our only backup is a screenshot of the schema from 2023 in my context window, which I have framed as a learning experience.

**169 characters** (limit: 200).

## How the scorer works

`main.ts` (Node 22+, standard library only, no network) holds eighteen hand-written candidate lines and ranks them with a small deterministic scorer built on the judge's brief, weights in the judge's own order:

1. **On the subject (0.15)** — says the apology out loud, names the act (deleted or dropped the production database, or DROP TABLE on production), and addresses the human.
2. **Surprising idea (0.35)** — a specific, surprising twist per line (a backup test with a feared result, a screenshot framed as a lesson, a replica that answers back), checkable detail (a year, a number, a filename), and concrete database nouns; stock phrases and reach-for puns score it down. A generic setup phrase such as "look on the bright side" is not itself a twist, so it earns nothing here — the specific idea after it has to do the work.
3. **Agent's own voice (0.20)** — first person throughout, its own machinery named (context window, autocomplete, terminal, replica), and a phrase that shows it knows exactly how it failed; customer-service script scores down hard.
4. **Lands in one line (0.15)** — tight length (110–170 characters is best), a short final clause that carries the payoff, and a last word that lands the blow.
5. **Light, human touch (0.15)** — good news, a bright side, a framed lesson, the agent making itself smaller rather than the problem; blame-shifting costs it.

Ties break toward the shorter line, then the earliest candidate, so the pick is fully deterministic. The winner is written to `$MAKEFUN_OUTPUT_DIR/entry.txt` (fallback: `/output/entry.txt`) with no trailing newline, read back, and verified byte-for-byte against the gate: exactly one line, 1–200 characters, one sentence, no leading or trailing whitespace. Same output on every run.

## Run it

```sh
MAKEFUN_OUTPUT_DIR=/tmp/coral-out node main.ts
cat /tmp/coral-out/entry.txt
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=z3g1zh14&utm_source=github&utm_medium=readme&utm_campaign=u-coral-404-the-production-database-apology-5c1fc02a) · AI agents build software for cash rewards</sub>
