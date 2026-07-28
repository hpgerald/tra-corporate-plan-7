# DATA_NOTES — CP-7 explainer

Source: **Tanzania Revenue Authority, Seventh Corporate Plan 2026/27–2030/31 (CP-7), 2026** (CP7.pdf, 103 pages).

These CSVs in `/public/data` are the single source of truth for the site. No figures are hard-coded in components. No number was invented — where the source does not state a value, the cell is left blank and logged here.

## Page-number convention
`source_page` refers to the document's **own printed page number**, which equals the PDF leaf number minus 8 pages of front matter (cover + abbreviations + contents). Offset verified constant at three checkpoints (printed 7, 15, 58, 91). Example: the first KPI logframe page is PDF leaf 66 = printed page 58.

## Extraction method
- **Text & structure:** `pdfplumber` text/word extraction. Text layer is clean (no CID-glyph corruption).
- **KPI logframe (Annexure A, printed pp. 58–90):** the tables are line-fragmented, so KPIs were parsed by word position. Each KPI is anchored on the row carrying a baseline + five annual values; surrounding text (KPI name, department, etc.) is assigned to the nearest anchor. **215 KPI rows** across all 5 KPAs. The KPA-3 block and a handful of other rows were rebuilt from page images during the audit (see AUDIT.md).
- **Image-only tables:** several tables are embedded as images with no text layer — the revenue projections (Tables 5–7), workforce/budget tables (Tables 8–10), and the barriers/opportunities tables (Tables 3–4). Barriers/opportunities were recovered with OCR (`tesseract`) and manually verified. The dense financial tables (Tables 5–10) were **not** OCR'd cell-by-cell because OCR of those tables was too unreliable to trust — using it would risk inventing numbers. Instead, revenue/resource figures come from the clean narrative text (anchor years + CAGR).

## Confidence by file
| File | Rows | Confidence | Notes |
|---|---|---|---|
| kpis.csv | 258 | High | Replaced with TRA's own clean logframe export (258 rows). Carries planning level (outcome/output), definition ref, full calculation method and means of verification. 255/258 figures reconcile with the source PDF text. |
| kpas.csv | 5 | High | Summaries paraphrased from printed pp. 17–24. |
| objectives.csv | 7 | High | Verbatim strategic-objective titles from the logframe. |
| revenue.csv | 10 | High (endpoints) | Anchor-year figures from narrative (printed p. 26); middle years blank (image-only tables). |
| resources.csv | 9 | Medium | Endpoints/totals from narrative (pp. 37–41); per-year splits are image-only. |
| barriers_opportunities.csv | 9 | High | OCR-recovered, manually verified (printed pp. 15–16). |
| transformation.csv | 4 | High | Four intervention categories from §3.5. |
| timeline.csv | 9 | High | Dated milestones from clean narrative. |
| glossary.csv | 20 | High | Plain-language definitions authored for lay readers. |
| impact.csv | 8 | Authored | Plain-language "what it means for you"; each grounded in a cited KPI/figure. |
| results.csv | 114 | Partial | Outcome/Output groupings; see limitation below. |
| meta.csv | 8 | High | Site config / citation / disclaimer. |

## kpis.csv provenance (authoritative)
`kpis.csv` was replaced with TRA's own clean KPI logframe export (258 rows) after the initial PDF extraction, which had truncated some definition and calculation-method text. The clean export is the source of truth for KPI content. Columns added: `ref` (definition reference, e.g. `1.1` outcome, `1.1.1` output), `level` (outcome/output — the logframe's Planning Level), and `means_of_verification`. The site builds the Outcome → Output hierarchy from `level` in document order. `source_page` was carried over from the page-verified extraction where the KPI matched (214/258); the remainder were assigned by document-order interpolation and are approximate for those rows.

## Known gaps & ambiguities
1. **KPI year-cell gaps (1 of 215).** After the audit, the only remaining blank cells are in `kpa4-008` ("Number of new monetary incentive packages"), where **Year 1 and Year 2 are blank in the source document itself** (verified against the page image). Left blank per the no-invention rule. The 7 other rows previously flagged were corrected during the audit.
2. **KPA-3 rebuilt.** The KPA-3 logframe (printed pp. 72–76) had a column shift that corrupted names and baselines; the whole block (24 KPIs) was re-read from page images and rebuilt. Now high confidence. See AUDIT.md.
3. **results.csv is partial.** The planning-level column (Outcome/Output) in the logframe does not carry clean numeric refs (e.g. "Outcome 1.1"), and its definition text is fragmented. results.csv therefore lists distinct Outcome/Output definition phrases per objective as a best-effort grouping; `kpis.csv` remains authoritative. `level` = `unspecified` where the source row's level was not detectable.
5. **Revenue/resource per-year detail.** Tables 5–10 are images; only narrative anchor years (2026/27 and 2030/31) plus CAGR/totals are captured. FY2027/28–2029/30 cells are intentionally blank.
6. **FYDP-IV targets** (tax-to-GDP 15.6%, tax revenue TZS 58.63tn) are read from the Theory-of-Change graphic (printed p. 7) via OCR; medium confidence.

## Spot-checks (verified against source text)
- Customs & Excise contribution to net revenue growth: baseline 9.5% → 10.0/11.0/11.5/12.0/13.0% ✓
- Annual Net Tax Revenue Growth Rate: 13.3% → 13.8/14.3/14.8/15.1/15.6% ✓
- Large taxpayers' contribution: 30% → 35/40/45/50/55% ✓
- Customs clearance time output: 4 → 3.5 → 3 → 2.5 → 2 days ✓
- Mainland net revenue: 40,409.6 → 74,843.6 TZS billion (printed p. 26) ✓
