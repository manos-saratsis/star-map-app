# DROMEAS_LOG.md

Task: Make the constellation legend interactive — clicking a constellation name
highlights only stars in that constellation and dims the rest; clicking again
clears the filter.

## PART 1 — Call-by-call log

Every dromeas call made this run, in order. **Every single call failed** with
either a timeout or a "server unavailable" error — the dromeas MCP server was
non-functional for the entire session. There is no case of a call succeeding
and providing REAL VALUE or NO IMPACT to report, because nothing ever returned.

| # | Tool | Args | Returned | Classification |
|---|------|------|----------|-----------------|
| 1 | `mcp__dromeas__whoami` | `{}` | `MCP error -32001: Request timed out` | FAILED |
| 2 | `mcp__dromeas__list_products` | `{}` | `MCP error -32001: Request timed out` | FAILED |
| 3 | `mcp__dromeas__whoami` | `{}` | `Server dromeas unavailable` | FAILED |
| 4 | `mcp__dromeas__list_products` | `{}` | `Server dromeas unavailable` | FAILED |
| 5 | `mcp__dromeas__whoami` | `{}` | `Server dromeas unavailable` | FAILED |
| 6 | `mcp__dromeas__list_products` | `{}` | `Server dromeas unavailable` | FAILED |
| 7 | `mcp__dromeas__list_repositories` | `{repo_full_name: "manos-saratsis/star-map-app"}` | `Server dromeas unavailable` | FAILED |
| 8 | `mcp__dromeas__code_map_overview` | `{scope: {kind: "repo", repo_full_name: "manos-saratsis/star-map-app"}}` | `Server dromeas unavailable` | FAILED |
| 9 | `mcp__dromeas__code_map_find_feature` | `{feature: "constellation legend", scope: {kind: "repo", repo_full_name: "manos-saratsis/star-map-app"}}` | `Server dromeas unavailable` | FAILED |
| 10 | `mcp__dromeas__getting_started` | `{}` | `Server dromeas unavailable` | FAILED |
| 11 | `mcp__dromeas__whoami` | `{}` | `Server dromeas unavailable` | FAILED |
| 12 | `mcp__dromeas__code_map_search` | `{query: "constellation legend highlight stars", scope: {kind: "repo", repo_full_name: "manos-saratsis/star-map-app"}}` | `Server dromeas unavailable` | FAILED |
| 13 | `mcp__dromeas__code_map_describe_file` | `{path: "src/components/ConstellationLegend.tsx", scope: {kind: "repo", repo_full_name: "manos-saratsis/star-map-app"}}` | `Server dromeas unavailable` | FAILED |
| 14 | `mcp__dromeas__whoami` | `{}` | `Server dromeas unavailable` | FAILED |

**14/14 calls failed.** I spaced retries across the session (before starting,
mid-exploration, and after finishing the edit) to check whether the outage was
transient. It never recovered. No call returned any data, so none can be
scored REAL VALUE or NO IMPACT — the rubric's positive categories are simply
inapplicable this run.

### What I did instead

Since dromeas never responded, all code discovery was done with the directly
available tools:
- `bash`(`find`, `ls`) to get the repo tree.
- `Read` on `src/App.tsx`, `src/components/ConstellationLegend.tsx`,
  `src/components/StarMapCanvas.tsx`, `src/data/constellations.ts`,
  `src/types.ts`, `src/App.css`.
- `Grep` to confirm `ConstellationLegend` / `StarMapCanvas` are only
  referenced from `App.tsx` (no tests/other consumers to update).

This was a ~10-file repo, so the fallback cost was low (a handful of Read
calls), but it defeats the entire purpose of routing through dromeas first —
on a large repo this outage would have been a hard blocker rather than a minor
inconvenience.

One incidental note: `ConstellationLegend.tsx` already contained a code
comment ("a natural extension point is making these entries clickable to
filter/highlight the star field by constellation") that effectively did the
job `code_map_find_feature` was supposed to do — pointing me straight at the
file to change. That was luck (the codebase self-documented its extension
point), not something dromeas provided.

## PART 2 — MCP Improvement Recommendations

Because every call failed at the transport/availability level, I cannot
comment on response-shape quality, redundancy, or documentation clarity for
any individual tool — I never saw a real payload from `code_map_overview`,
`code_map_find_feature`, `code_map_search`, or `code_map_describe_file` to
critique. My recommendations are therefore about the failure mode itself,
which is the single biggest thing that went wrong this run.

1. **Ticket: dromeas gives no distinction between "cold start / indexing in
   progress" and "hard down," and no retry/backoff guidance.**
   - Repro: any call, e.g. `mcp__dromeas__whoami` with `{}`, returned
     `MCP error -32001: Request timed out` on the first two attempts, then
     `Server dromeas unavailable` on every subsequent attempt (12 more tries
     spread over the session).
   - Problem: as a caller, I cannot tell from this error whether (a) the repo
     code map is still indexing and I should wait/poll, (b) the server process
     is genuinely down and retries are pointless, or (c) I'm rate-limited.
     The two different error strings (`-32001 timeout` vs. `unavailable`)
     for the same underlying condition also suggests inconsistent error
     handling between whatever layer times out first vs. the layer that
     answers on later attempts.
   - Fix: standardize on one error shape with a machine-readable `reason`
     field, e.g. `{code: "SERVER_UNAVAILABLE", retry_after_seconds: 30,
     hint: "repo indexing in progress" | "service outage" | "rate limited"}`.
     Tool descriptions (or a `get_server_status` tool, if the future analog
     of `getting_started` is meant to serve this purpose) should tell the
     agent up front how long to keep retrying before giving up and falling
     back to Read/Grep, instead of leaving that policy to be guessed.

2. **Ticket: no cheap, fast "is dromeas even reachable" health-check tool
   distinct from `whoami`.**
   - Repro: I used `whoami` (an auth/identity call) as my de facto health
     check, three separate times, each taking a full timeout cycle before
     failing.
   - Problem: `whoami` is documented as "Return the authenticated user,
     workspace, and any product binding" — it's not advertised as a
     liveness probe, so using it as one is a workaround, and it's exactly as
     expensive as any other call when the server is timing out (up to the
     full -32001 timeout window, ~tens of seconds by observation).
   - Fix: add a lightweight `ping`/`health` tool documented explicitly as
     "call this first, cheaply, to decide whether to use dromeas or fall back
     to direct file tools this session" — and have it fail fast (sub-second)
     rather than hang for a full RPC timeout.

3. **Ticket: `code_map_overview`'s required `repo_full_name` (per this task's
   own instructions) means the very first useful call requires already
   knowing the repo identity — but `list_repositories`, the tool meant to
   resolve that, timed out too, with no cached/offline fallback.**
   - Repro: `mcp__dromeas__list_repositories` called with
     `{repo_full_name: "manos-saratsis/star-map-app"}` (the repo name was
     already known from my task instructions, not discovered via
     `list_products`/`list_repositories` since those also failed) returned
     `Server dromeas unavailable`.
   - Problem: this run I only survived because the repo name was handed to me
     directly in the task prompt. In a run where the agent is meant to
     *discover* the repo via `whoami` → `list_products` → `list_repositories`
     as instructed, a full outage at that first step is a hard stop with zero
     graceful degradation path back into the tool family (e.g. no cached last-
     known repo list, no "here's what we knew as of the last successful
     index" response).
   - Fix: for scoped calls, degrade to serving the last successfully cached
     result (with a `stale: true, as_of: <timestamp>` flag) instead of a bare
     error when the live backend is unreachable, at least for read-only
     discovery calls like `list_products`/`list_repositories`/
     `code_map_overview`.

### Top 1-3, ranked by impact on THIS session

1. **#1 (standardized error shape with retry guidance)** — ranked highest
   because it directly caused the biggest waste this run: I burned 14 calls
   retrying blind with no signal on whether to keep trying or bail. A
   `retry_after`/`reason` field would have let me fail over to Read/Grep
   after 1-2 calls instead of 14, and would matter on every future outage,
   not just this one.
2. **#3 (stale-cache fallback for discovery calls)** — ranked second because
   it's the difference between dromeas being *load-bearing* (this task's
   instructions assume `whoami → list_products → list_repositories` is the
   mandatory entry point) and dromeas being a nice-to-have. On a repo I
   *didn't* already have the name for, this outage would have blocked
   discovery entirely with no graceful path forward.
3. **#2 (dedicated fast health-check tool)** — ranked third, lower impact
   than #1 and #3 because it's really a special case of #1 (a fast-failing
   `ping` mostly matters *because* the alternative is a slow ambiguous
   timeout) — fixing #1 would cover most of this need. Still worth calling
   out separately since the current guidance nudges agents toward `whoami`
   as the de facto first call, and that's an expensive, semantically
   mismatched way to check liveness.

I'm not padding this list further: every other observation this run reduces
to "the server was down," which is one root cause, not three-plus distinct
tool-design problems. The three tickets above are the distinct, actionable
angles on that one failure worth fixing separately (error semantics, cache
fallback, liveness check) — everything else would just be restating the same
outage.
