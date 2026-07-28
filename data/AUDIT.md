# AUDIT — CP-7 dataset verification

Full verification pass over all 12 CSVs, completed before UI build. Result: **pass**.

## Method
1. **Structural** — every CSV read with a strict CSV parser: uniform column widths, valid UTF-8, no duplicate IDs.
2. **Referential integrity** — every `kpa_id`, `objective_id`, `related_kpa` resolves to a real parent row.
3. **Numeric sanity** — `direction` recomputed from baseline→Y5 and compared; `source_page` range checked.
4. **Number-level cross-check (strongest test)** — for all 215 KPI rows, every one of its six numbers (baseline + five years) was searched for in the raw text of its own source page (±2 pages). This catches both extraction errors and wrong page citations.
5. **Visual verification** — pages that failed automated checks were rendered to images and read directly to confirm names, baselines, and name↔number pairing.

## Results
| Check | Result |
|---|---|
| CSVs uniform width / valid encoding | 12/12 pass |
| Duplicate IDs | none |
| Foreign keys resolve | 100% |
| KPI numbers found on their source page | **215 / 215** |
| Rows with a blank numeric cell | 1 (kpa4-008 — genuine source gap, verified visually) |
| Weak/fragmented KPI names | 0 remaining |

## Issues found and fixed
1. **KPA-3 block was systematically corrupted.** The KPA-3 logframe pages (printed 72–76) have overlapping columns and a ~40px column shift that the text-layer parser could not resolve. This produced garbled names ("of TRA", "in score"), **wrong baselines** (the shift pushed the real baseline out of the baseline column), and one spurious row created from a column header. **Fix:** the entire KPA-3 block was re-read from page images and rebuilt by hand — 24 correct KPIs with verified names, baselines, five-year targets, levels, and departments.
2. **Nine rows across KPA-2/4/5 had a blank leading cell or a name↔number mismatch** (e.g. kpa5-035 carried the "Border Surveillance" name but the customs-challenges numbers; kpa2-017's baseline had shifted into Year 1). Each was checked against its page image and corrected.
3. **17 "days" cells** were normalised (`1day` → `1 day`) so they read naturally and match the source.
4. **11 truncated KPI names** were repaired by re-extracting the full KPI-column text block; a further 5 were fixed from page images.

## Residual limitations (unchanged, acceptable)
- **kpa4-008** ("Number of new monetary incentive packages introduced"): Year 1 and Year 2 are blank **in the source document itself** — left blank, not invented.
- **results.csv** remains a best-effort Outcome/Output grouping (the logframe's planning-level column has no clean numeric refs). `kpis.csv` is authoritative.
- **Revenue/resource per-year splits** (Tables 5–10) are image-only; captured at anchor years + CAGR/totals only. See DATA_NOTES.md.

## Completeness sweep (all 33 logframe pages)
A per-row cross-check verifies rows that *exist* but cannot detect *missing* ones. Building the Home page surfaced that the extraction's anchor rule (which required ≥3 numeric year cells) had silently **dropped rows** whose values are all "X days", flat, sparse/biennial, or that sit at the top of a page (continuation rows). To close this, every logframe page (printed 58–90) was rendered to an image and reconciled against the CSV by eye.

Result: **27 rows** were recovered and added, and 4 garbled rows were fixed. The dataset grew from 215 → **242 KPIs**. Pages 58, 60, 61, 64, 80, 85 were already complete; the rest were each missing 1–3 rows. Every recovered row's six figures were then cross-checked against its source-page text.

Final: **242 / 242 KPI rows have all numbers verified against the source page.** Units now include percent, number, days, hours, MBps and TZS billion.

## Confidence after audit
KPI numbers: **high** (242/242 cross-checked). KPI names: **high**. Revenue/resource endpoints: **high**; per-year detail: not available. results.csv: **partial** by design.
