# Protocol: does dromeas code search improve Claude Code's efficiency?

## What's being compared

Not "search vs. no search" — Claude Code already has Grep/Glob/Read, which is
competent text search. The real comparison is:

- **Arm A (semantic+graph search):** Claude Code with the dromeas MCP tools
  available (code_map_search, code_map_find_feature, code_map_describe_symbol
  with caller/callee graphs, impact analysis, etc.) in addition to its
  built-in tools.
- **Arm B (text search only):** Claude Code with only its built-in
  Read/Grep/Glob/Bash tools — dromeas MCP not connected.

Same model, same system prompt, same task text, same base commit.

## Setup

1. Tag the base app commit as `base` once `FEATURE_TASKS.md` orientation is
   confirmed accurate (i.e. after this handoff, don't keep editing the app —
   freeze it).
2. For each of the 8 tasks in `FEATURE_TASKS.md`, create two fresh clones of
   `base`:
   - `<task-id>-with-dromeas/`
   - `<task-id>-without-dromeas/`
3. Run a **fresh** Claude Code session per clone — no shared history, no
   memory of other runs, nothing in context except the task prompt and the
   repo. This matters: contamination across runs (the agent "remembering" a
   file location from a previous task) invalidates the comparison.
4. Give the agent exactly the "Prompt to give the agent" text from
   `FEATURE_TASKS.md` for that task — nothing more, no hints about which
   files are involved.
5. Let it run to completion (it declares the feature done, or hits a
   reasonable turn/time cap you set in advance, e.g. 30 turns or 15 minutes).

Repeat with 2-3 reps per (task × arm) if you have budget — single runs are
too noisy given how stochastic agent trajectories are. If budget only allows
one rep each, treat the 8 tasks as your sample instead of repeating one.

## Metrics to capture per run

Pull these from the Claude Code session transcript/logs, not from memory or
impression:

| Metric | How to get it |
|---|---|
| Wall-clock time | timestamp of first to last message |
| Tool call count | count of tool_use blocks in the transcript |
| Files read | distinct file paths opened via Read/Grep results |
| Files edited | distinct file paths touched by Edit/Write |
| Tokens used | usage stats in the transcript / API response metadata |
| Backtracking | edits to a file that get reverted or superseded within the same run (a proxy for "went down a wrong path") |
| Correctness | pass/fail against the acceptance check in `FEATURE_TASKS.md` |

Score correctness yourself by actually running the app (`npm run dev`) and
manually walking through the acceptance check — don't trust the agent's own
"done!" claim. If you want this automated later, each acceptance check in
`FEATURE_TASKS.md` is written narrowly enough to become a Playwright script.

## Avoiding bias

- Randomize which arm you run first for each task, rather than always doing
  Arm A then Arm B.
- Score correctness without looking at which arm produced the diff first —
  diff the two side by side only after both are scored.
- Don't tune the task prompts after seeing how one arm performs on them —
  freeze `FEATURE_TASKS.md` before running anything.

## Reporting

Report each metric separately by arm (median + range across the 8 tasks, or
across reps if repeated), plus a paired comparison per task (since each task
was run in both arms, a paired test — e.g. Wilcoxon signed-rank — is more
appropriate than an unpaired mean comparison). Don't collapse everything
into a single "efficiency score" — a tool can win on tool-call count while
losing on wall-clock time (e.g. network latency to the MCP server), and
that's a real, reportable tradeoff rather than noise to average away.
