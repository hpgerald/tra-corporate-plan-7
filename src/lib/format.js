// Numeric + plain-language helpers for KPI figures.

export function parseNum(s) {
  if (s == null) return null
  const m = String(s).replace(/,/g, '').match(/-?\d+(\.\d+)?/)
  return m ? parseFloat(m[0]) : null
}

// Scale for the proportional bar. Percentages share a common 0–100 scale so
// cards are comparable; other units scale to their own range.
export function barMax(baseline, target, unit) {
  const b = parseNum(baseline)
  const t = parseNum(target)
  if (unit === 'percent') return Math.max(100, b || 0, t || 0)
  const hi = Math.max(b || 0, t || 0)
  return hi > 0 ? hi * 1.15 : 1
}

// A short monochrome direction tag: "Grow ×1.8", "Reduce", "Maintain", "Introduce".
export function directionTag(k) {
  const b = parseNum(k.baseline)
  const t = parseNum(k.y5_2030_31)
  if (b === null || t === null) return { label: k.direction || '—', fill: false }
  if (k.direction === 'grow') {
    if (b === 0) return { label: 'Introduce', fill: true }
    const r = t / b
    return { label: r >= 1.1 ? `Grow ×${r.toFixed(1)}` : 'Grow', fill: true }
  }
  if (k.direction === 'reduce') return { label: t === 0 ? 'Eliminate' : 'Reduce', fill: false }
  if (k.direction === 'maintain') return { label: 'Maintain', fill: false }
  return { label: k.direction || '—', fill: false }
}

// A plain-language sentence describing the change.
export function plainLine(k) {
  const name = k.kpi_name.replace(/\.$/, '')
  const b = k.baseline
  const t = k.y5_2030_31
  if (k.direction === 'maintain' || b === t) return `Holds at ${b} through 2030/31.`
  const verb = k.direction === 'reduce' ? 'Falls' : 'Rises'
  if (parseNum(b) === 0) return `Introduced and grows to ${t} by 2030/31.`
  return `${verb} from ${b} to ${t} by 2030/31.`
}
