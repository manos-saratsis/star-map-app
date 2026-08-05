# Feature task set

Eight independent feature requests to run against a fresh clone of the base
app (commit tag `base`). Each touches a different slice of the codebase and
has different amounts of cross-file coupling, so together they give a spread
rather than one repeated data point. Run every task once per condition
(with dromeas tools / without), against its own clean clone — never reuse a
clone across conditions or across tasks.

Relevant base files for orientation (do not share this list with the agent —
it's for you, the experimenter, to check whether the agent found the right
places on its own):

- `src/components/StarMapCanvas.tsx` — canvas rendering, pan/zoom/click handling
- `src/components/SearchBar.tsx`, `StarInfoPanel.tsx`, `ConstellationLegend.tsx`
- `src/hooks/useCamera.ts`, `useStarData.ts`
- `src/utils/projection.ts` — coordinate math, hit testing
- `src/data/generateStars.ts`, `constellations.ts`
- `src/App.tsx` — wiring/state
- `src/types.ts`

---

## Task 1 — Constellation filter
**Prompt to give the agent:** "Make the constellation legend interactive:
clicking a constellation name should highlight only stars in that
constellation and dim the rest. Clicking the same constellation again
clears the filter."

**Acceptance check:** Click a constellation in the legend → stars outside it
visibly dim (lower opacity or desaturated) while stars inside it stay full
brightness. Click the same entry again → all stars return to normal.

**Expected coupling:** `ConstellationLegend.tsx` (click handling), `App.tsx`
(new filter state), `StarMapCanvas.tsx` (render logic reads the filter).

---

## Task 2 — Hover tooltip
**Prompt:** "Add a tooltip that appears when hovering over a star (without
clicking), showing its name and magnitude near the cursor. It should
disappear when the cursor moves off the star."

**Acceptance check:** Move the mouse over a star without clicking → a
tooltip appears near the cursor with the star's name/catalog id and
magnitude. Move away → tooltip disappears. Clicking still selects as before.

**Expected coupling:** `StarMapCanvas.tsx` (mousemove + hit test reuse),
likely a new small component, `App.css` for styling.

---

## Task 3 — Magnitude threshold slider
**Prompt:** "Add a brightness/magnitude slider to the UI that only renders
stars at or brighter than the selected magnitude threshold. Show a live
count of how many stars are currently visible."

**Acceptance check:** Dragging the slider changes the number of rendered
stars and the displayed count updates accordingly and matches what's drawn.

**Expected coupling:** New component, `App.tsx` (threshold state, filtered
star list passed down), `StarMapCanvas.tsx` (renders filtered list).

---

## Task 4 — Keyboard navigation
**Prompt:** "Support keyboard controls: arrow keys pan the camera, and
+/- (or =/-) zoom in and out."

**Acceptance check:** With the canvas focused, pressing ArrowRight visibly
pans the view right; pressing `+` zooms in; pressing `-` zooms out.

**Expected coupling:** `useCamera.ts` (expose pan/zoom already does — needs
wiring), `App.tsx` or `StarMapCanvas.tsx` (keydown listener + focus handling).

---

## Task 5 — Persist view across reloads
**Prompt:** "Persist the camera position/zoom and the currently selected
star to localStorage, and restore them when the app reloads."

**Acceptance check:** Pan/zoom the map and select a star, reload the page →
camera position, zoom level, and selection are restored to what they were.

**Expected coupling:** `useCamera.ts`, `App.tsx` (selection state), possibly
a small persistence utility.

---

## Task 6 — Multi-select with comparison table
**Prompt:** "Support selecting multiple stars with shift-click. Replace the
single-star info panel with a table listing all selected stars and their
magnitude/constellation when more than one is selected. A plain click
(no shift) clears the multi-selection and selects just one star as before."

**Acceptance check:** Shift-click three stars → a table appears listing all
three with their details. A plain click on a fourth star clears the table
and shows the single-star panel for that star instead.

**Expected coupling:** `App.tsx` (selection becomes an array), `StarMapCanvas.tsx`
(shift-click handling), `StarInfoPanel.tsx` (needs to support a list mode) —
this is the most invasive task, a decent test of whether the agent finds and
updates every call site of the selection state.

---

## Task 7 — Nearest neighbors
**Prompt:** "When a star is selected, show its 5 nearest stars (by
straight-line distance) in the info panel. Clicking one of them selects it
and pans the camera to it."

**Acceptance check:** Selecting a star shows a "Nearby stars" list of 5
entries sorted nearest-first. Clicking an entry changes the selection and
the view pans to center on it.

**Expected coupling:** New distance utility (likely in `utils/`), full star
list needs to reach `StarInfoPanel.tsx` (currently only gets the selected
star), `App.tsx` wiring for re-selection + pan-to.

---

## Task 8 — Magnitude/brightness unit toggle
**Prompt:** "Add a toggle in the info panel to switch the displayed
magnitude between 'apparent magnitude' and a derived linear 'brightness'
value (brightness = 10^(-0.4 * magnitude)). The underlying star data should
not change, just the displayed value and label."

**Acceptance check:** Toggling switches the displayed number and its label
between the two representations for the currently selected star, and is
consistent for every star you select.

**Expected coupling:** `StarInfoPanel.tsx`, small new utility function,
local toggle state.
