# Star Map App

A small Vite + React + TypeScript canvas app: a field of ~4,000 procedurally
generated stars across 10 constellations, with search-by-name, click-to-select
with an info panel, and pan/zoom.

This app exists as a **shared base codebase for an experiment**: comparing
whether Claude Code with the dromeas semantic/graph code-search MCP tools
available completes feature-add tasks more efficiently than Claude Code with
only its built-in text search (Grep/Glob/Read).

See:
- `FEATURE_TASKS.md` — 8 independent feature-request prompts (with acceptance
  checks) to run against fresh clones of this base.
- `EXPERIMENT_PROTOCOL.md` — the run methodology: how to set up the two
  arms, what metrics to capture, and how to avoid biasing the comparison.

## Running locally

```bash
npm install
npm run dev
```

## Project structure

- `src/components/StarMapCanvas.tsx` — canvas rendering, pan/zoom/click handling
- `src/components/SearchBar.tsx`, `StarInfoPanel.tsx`, `ConstellationLegend.tsx`
- `src/hooks/useCamera.ts`, `useStarData.ts`
- `src/utils/projection.ts` — coordinate math, hit testing
- `src/data/generateStars.ts`, `constellations.ts`
- `src/App.tsx` — wiring/state
- `src/types.ts`
