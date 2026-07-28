import { useState } from 'react'

// A single inline glossary term. Shows its definition on hover, focus, or tap.
export function GlossaryTerm({ term, definition, children }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      type="button"
      className={`gloss${open ? ' is-open' : ''}`}
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
      onBlur={() => setOpen(false)}
    >
      {children || term}
      <span className="gloss__pop" role="tooltip">
        <b>{term}</b>
        {definition}
      </span>
    </button>
  )
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Renders `text`, wrapping the first occurrence of each known glossary term
// in a GlossaryTerm tooltip. `glossary` is an array of {term, definition_plain}.
export function GlossaryText({ text, glossary }) {
  if (!text) return null
  // longest terms first so multi-word terms win over their substrings
  const terms = glossary
    .filter((g) => g.term)
    .slice()
    .sort((a, b) => b.term.length - a.term.length)

  const used = new Set()
  const nodes = []
  let rest = text
  let key = 0

  // Greedy left-to-right scan: at each position, find the earliest match among
  // not-yet-used terms, emit text before it, then the tooltip.
  while (rest.length) {
    let best = null
    for (const g of terms) {
      if (used.has(g.term.toLowerCase())) continue
      const re = new RegExp(`\\b${escapeRe(g.term)}\\b`, 'i')
      const m = re.exec(rest)
      if (m && (best === null || m.index < best.index)) {
        best = { index: m.index, matchText: m[0], g }
        if (m.index === 0) break
      }
    }
    if (!best) { nodes.push(rest); break }
    if (best.index > 0) nodes.push(rest.slice(0, best.index))
    used.add(best.g.term.toLowerCase())
    nodes.push(
      <GlossaryTerm key={key++} term={best.g.term} definition={best.g.definition_plain}>
        {best.matchText}
      </GlossaryTerm>,
    )
    rest = rest.slice(best.index + best.matchText.length)
  }
  return <>{nodes}</>
}
