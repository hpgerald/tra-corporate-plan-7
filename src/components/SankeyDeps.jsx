import { useMemo, useState } from 'react'

// A dependency Sankey: Enablers → Capabilities → Outcomes.
// Band thickness ≈ dependency strength. Monochrome; hover a node to trace it.
const W = 960
const H = 560
const NW = 13
const GAP = 16
const TOP = 56
const COLX = [172, 474, 776]

export default function SankeyDeps({ nodes, links }) {
  const [hover, setHover] = useState(null)

  const layout = useMemo(() => {
    const byId = Object.fromEntries(nodes.map((n) => [n.id, { ...n, layer: Number(n.layer) }]))
    const L = links.map((l) => ({ ...l, weight: Number(l.weight) }))
    const outSum = {}, inSum = {}
    for (const l of L) {
      outSum[l.source] = (outSum[l.source] || 0) + l.weight
      inSum[l.target] = (inSum[l.target] || 0) + l.weight
    }
    for (const n of Object.values(byId)) {
      n.value = n.layer === 0 ? (outSum[n.id] || 0) : n.layer === 2 ? (inSum[n.id] || 0)
        : Math.max(outSum[n.id] || 0, inSum[n.id] || 0)
    }
    const cols = [0, 1, 2].map((ly) => nodes.map((n) => byId[n.id]).filter((n) => n.layer === ly))
    // global scale so the densest column fits
    let scale = Infinity
    for (const col of cols) {
      const sum = col.reduce((s, n) => s + n.value, 0)
      const avail = H - TOP - 8 - (col.length - 1) * GAP
      if (sum > 0) scale = Math.min(scale, avail / sum)
    }
    for (const col of cols) {
      const total = col.reduce((s, n) => s + n.value, 0) * scale + (col.length - 1) * GAP
      let y = TOP + (H - TOP - total) / 2
      for (const n of col) { n.x = COLX[n.layer]; n.y = y; n.h = n.value * scale; y += n.h + GAP }
    }
    // stack links (sorted to reduce crossings)
    const sortable = L.map((l) => ({ ...l, sy: byId[l.source].y, ty: byId[l.target].y }))
    sortable.sort((a, b) => a.sy - b.sy || a.ty - b.ty)
    const srcCur = {}, tgtCur = {}
    for (const n of Object.values(byId)) { srcCur[n.id] = n.y; tgtCur[n.id] = n.y }
    const bands = sortable.map((l) => {
      const s = byId[l.source], t = byId[l.target]
      const w = l.weight * scale
      const sy0 = srcCur[l.source]; srcCur[l.source] += w
      const ty0 = tgtCur[l.target]; tgtCur[l.target] += w
      const x0 = s.x + NW, x1 = t.x, xm = (x0 + x1) / 2
      const d = `M${x0},${sy0} C${xm},${sy0} ${xm},${ty0} ${x1},${ty0} L${x1},${ty0 + w} C${xm},${ty0 + w} ${xm},${sy0 + w} ${x0},${sy0 + w} Z`
      return { ...l, d }
    })
    const neighbours = {}
    for (const l of L) {
      ;(neighbours[l.source] ||= new Set()).add(l.target)
      ;(neighbours[l.target] ||= new Set()).add(l.source)
    }
    return { byId, cols, bands, neighbours }
  }, [nodes, links])

  const short = (s) => s.split(' (')[0]
  const linkActive = (l) => !hover || l.source === hover || l.target === hover
  const nodeActive = (id) => !hover || id === hover || layout.neighbours[hover]?.has(id)

  // text equivalent for screen readers
  const summary = links
    .map((l) => `${short(layout.byId[l.source].label)} supports ${short(layout.byId[l.target].label)}`)
    .join('; ')

  return (
    <figure style={{ margin: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="sankey-title sankey-desc"
          style={{ width: '100%', minWidth: 620, color: 'var(--ink)', display: 'block' }}
        >
          <title id="sankey-title">Implementation dependencies of CP-7</title>
          <desc id="sankey-desc">
            How enablers feed capabilities that deliver outcomes. {summary}.
          </desc>

          {['Enablers', 'Capabilities', 'Outcomes'].map((h, i) => (
            <text key={h} x={COLX[i] + NW / 2} y={28} textAnchor="middle"
              fontSize="13" fontWeight="700" fill="currentColor"
              style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</text>
          ))}

          {layout.bands.map((l, i) => (
            <path key={i} d={l.d}
              fill={l.source === hover || l.target === hover ? '#4d4d4d' : (l.basis?.toLowerCase().startsWith('doc') ? '#c9c9c9' : '#e2e2e2')}
              stroke={l.basis?.toLowerCase().startsWith('doc') ? 'none' : '#c9c9c9'}
              strokeDasharray={l.basis?.toLowerCase().startsWith('doc') ? '0' : '3 2'}
              opacity={linkActive(l) ? 1 : 0.12} />
          ))}

          {layout.cols.flat().map((n) => (
            <g key={n.id}
              onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
              tabIndex={0} style={{ cursor: 'pointer', opacity: nodeActive(n.id) ? 1 : 0.3, outline: 'none' }}>
              <title>{n.label}{n.note ? ` — ${n.note}` : ''}</title>
              <rect x={n.x} y={n.y} width={NW} height={Math.max(2, n.h)} fill="currentColor" />
              {n.layer === 0 && (
                <text x={n.x - 10} y={n.y + n.h / 2} textAnchor="end" dominantBaseline="central"
                  fontSize="12.5" fill="currentColor">{short(n.label)}</text>
              )}
              {n.layer === 2 && (
                <text x={n.x + NW + 10} y={n.y + n.h / 2} textAnchor="start" dominantBaseline="central"
                  fontSize="12.5" fill="currentColor">{short(n.label)}</text>
              )}
              {n.layer === 1 && (
                <text x={n.x + NW / 2} y={n.y - 6} textAnchor="middle"
                  fontSize="12.5" fontWeight="700" fill="currentColor">{short(n.label)}</text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="muted" style={{ fontSize: 'var(--step--1)', marginTop: 'var(--space-2xs)' }}>
        Band thickness ≈ how strongly one depends on the other. Solid = documented in CP-7; dashed = inferred.
        Hover or focus a node to trace its dependencies.
      </figcaption>
    </figure>
  )
}
