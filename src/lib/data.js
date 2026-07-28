import Papa from 'papaparse'

// Single source of truth: every CSV in /public/data. No figures are
// hard-coded in components — everything is read from these files.
export const DATASETS = [
  'meta',
  'kpas',
  'objectives',
  'results',
  'kpis',
  'revenue',
  'resources',
  'barriers_opportunities',
  'transformation',
  'timeline',
  'glossary',
  'impact',
  'intel_audiences',
  'intel_opportunities',
  'intel_skills',
  'intel_sectors',
  'intel_strategic',
  'intel_dep_nodes',
  'intel_dep_links',
]

const cache = {}

function url(name) {
  // BASE_URL respects vite base:'./' so deep-links work on GitHub Pages.
  return `${import.meta.env.BASE_URL}data/${name}.csv`
}

export async function loadCsv(name) {
  if (cache[name]) return cache[name]
  const res = await fetch(url(name))
  if (!res.ok) throw new Error(`Failed to load ${name}.csv (${res.status})`)
  const text = await res.text()
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  })
  cache[name] = parsed.data
  return parsed.data
}

export async function loadAll() {
  const entries = await Promise.all(
    DATASETS.map(async (name) => [name, await loadCsv(name)]),
  )
  return Object.fromEntries(entries)
}

// meta.csv is a key/value table — collapse it into a plain object.
export function metaToObject(rows) {
  const o = {}
  for (const r of rows) if (r.key) o[r.key] = r.value
  return o
}
