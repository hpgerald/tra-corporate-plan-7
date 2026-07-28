// Shared list of KPIs (reused across detail pages).
// Numbers are always shown as text; direction is a monochrome tag.
const DIR_LABEL = { grow: 'Grow', reduce: 'Reduce', maintain: 'Maintain', eliminate: 'Eliminate' }

function DirectionTag({ dir }) {
  if (!dir) return null
  const fill = dir === 'grow'
  return <span className={`tag${fill ? ' tag--fill' : ''}`}>{DIR_LABEL[dir] || dir}</span>
}

export default function KpiList({ items }) {
  if (!items.length) return <p className="muted">No indicators listed.</p>
  return (
    <ul className="kpi-list">
      {items.map((k) => {
        const meta = [
          k.responsible_dept && `Dept: ${k.responsible_dept}`,
          k.frequency,
          k.source_page && `p.${k.source_page}`,
        ].filter(Boolean).join(' · ')
        return (
          <li className="kpi-row" key={k.id}>
            <div>
              <div className="kpi-row__name">{k.kpi_name}</div>
              {k.calculation_method && (
                <div className="kpi-row__calc">How it’s measured: {k.calculation_method}</div>
              )}
              {meta && <div className="kpi-row__meta">{meta}</div>}
            </div>
            <div className="kpi-row__nums">
              <div className="kpi-row__vals">
                {k.baseline || '—'}
                <span className="kpi-row__arrow" aria-hidden="true">→</span>
                {k.y5_2030_31 || '—'}
              </div>
              <DirectionTag dir={k.direction} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
