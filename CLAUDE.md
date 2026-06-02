# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

- **Project:** 东风日产企微助手 - 用户洞察产品原型 (static demo dashboard)
- **Stack:** HTML5 + CSS3 + Vanilla JS (no framework, no build tools, no backend)
- **Entry:** `index.html` → password `dndc2026` → `main.html` → iframe loads `userinsight.html`
- **Local dev:** `python3 -m http.server 8000` → `http://localhost:8000/index.html`
- **Syntax check:** `node --check script.js && node --check mock.js`
- **Detailed docs:** See `agent.md` for full project documentation

## File Map

| File | Lines | Role |
|------|-------|------|
| `userinsight.html` | ~3,900 | Main dashboard: 3 tabs (渠道效果/培育运营/用户群体洞察), filter bars, KPIs, charts, 6 modals |
| `script.js` | ~2,900 | All JS logic: init, event delegation, rendering, modal management, download |
| `mock.js` | ~1,400 | `MOCK` namespace with 12 data modules + backward-compat aliases |
| `style.css` | ~5,000 | Global styles, CSS variables, chart components, modal/drawer styles |
| `index.html` | ~130 | Password gate |
| `main.html` | ~130 | iframe container with top nav |
| `workbench.html` | standalone | Independent workbench, does NOT share JS/CSS with the dashboard |
| `agent.md` | — | Detailed project docs (partially outdated — see Current Architecture below) |

## Architecture: What agent.md Doesn't Cover

### 11-Level Lead Quality System

The project migrated from an 8-level to an 11-level lead classification, aligned with `MOCK.leadLevels`:

```
H-试驾排程单, H-试驾线索单, H-非试驾线索单, A, B,
C-意向不明, C-无法接通, F-战败, L-休眠, E-意向含糊, 无效号码
```

Key JS constants in `script.js`:
- `LEVEL_COLORS` — hex colors for each of the 11 levels (used by bar charts, legends, pie charts)
- `LEVEL_LABELS` — `[{key, label}]` array, labels dynamically sourced from `MOCK.leadLevels`
- `storeLevel(s, key)` — safe property accessor
- `storeHTotal(s)` / `storeCTotal(s)` / `storeTotal(s)` / `storeHabTotal(s)` — aggregation helpers
- `maxStoreTotal(stores)` — find max total across a store array (used for bar normalization)

Drill-down data in `mock.js` also uses the 11-level structure: `hSchedule`, `hLead`, `hNonTest`, `cUnclear`, `cUnreachable` instead of flat `h`/`c`.

### Generic Multi-Select Filter System

`initFilterMultiSelects()` in `script.js` now uses a fully generic approach. All `.custom-multi-select` elements are initialized uniformly via `input[type="checkbox"]` selectors — no per-filter class names needed.

- `updateMultiSelectText(multiSelect)` — generic text update, finds text span via `.select-header span`
- Select-all checkbox: `input[type="checkbox"][value="all"]`
- Item checkboxes: `input[type="checkbox"]:not([value="all"])`

When adding a new multi-select filter to HTML, just use the `.custom-multi-select` wrapper pattern — the JS handles it automatically.

### Bar Length Normalization

Two rendering functions normalize bar widths by total volume so differences between items are visible:
1. **`renderRankList`** (ranking charts): bars normalized to `maxCount` across items
2. **`generateStoreCard`** (drill-down store cards): accepts optional `maxTotal` parameter; bar width = `(storeTotal / maxTotal) × 100%`

When rendering groups of store cards, callers must compute `maxTotal` for the current scope (global / region / area) and pass it to `generateStoreCard`.

### Drill-Down Modal Rendering

Two shared rendering functions used by both project and schedule drill-down modals:
- `renderDrillContent(channels)` — renders region→subregion→store hierarchy with tab switching
- `generateStoreCard(store, areaLabel, maxTotal)` — renders individual store card with 11-level mini bar and labels

### Channel V-Chart Legend

The `channelVChart` legend in `userinsight.html` is hardcoded as 11 items matching `MOCK.leadLevels`. The JS function `alignChannelQualityLeadLevels()` also updates this legend at runtime, but the HTML default should always match.

## Common Pitfalls

- **Data property names:** Drill-down data uses `hSchedule`/`hLead`/`hNonTest`/`cUnclear`/`cUnreachable`, NOT `h`/`c`. Always use `storeLevel()` or the aggregation helpers.
- **`const` vs `var`:** Recent refactoring changed some `const`→`var`. The codebase uses both; match surrounding style.
- **Inline onclick:** Many UI elements use inline `onclick=` handlers (HTML attributes + dynamically generated in JS). This is the established pattern — use `addEventListener` for new init-time bindings only.
- **Filter HTML duplication:** Filter bars appear in all 3 tabs. Use `replace_all: true` when editing filter HTML in `userinsight.html`.
- **`<i>` icon tags in bars:** Bar chart `<i>` elements use inline `style="width: X%;"` for bar lengths. Don't add CSS classes to them.
- **Script loading order:** `mock.js` loads before `script.js` in `userinsight.html`. `MOCK` is available at script parse time.
- **GitHub Pages:** The site is deployed at `hw00913-bot.github.io/demo_userinsight/`. Push to `main` to deploy.
