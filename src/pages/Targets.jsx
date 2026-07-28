import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import ComparisonBar from '../components/ComparisonBar.jsx'
import { useData } from '../lib/useData.js'
import { parseNum, barMax, directionTag, plainLine } from '../lib/format.js'
import { useTitle } from '../lib/useTitle.js'

const DIRECTIONS = [
  { key: 'grow', label: 'Growing' },
  { key: 'reduce', label: 'Reducing' },
  { key: 'maintain', label: 'Maintaining' },
]

function Chip({ pressed, onClick, children, count }) {
  return (
    <button type="button" className="chip" aria-pressed={pressed} onClick={onClick}>
      {children}
      {count != null && <span className="chip__count"> {count}</span>}
    </button>
  )
}

export default function Targets() {
  useTitle('The numbers')
  const { loading, error, data, meta } = useData()
  const [kpa, setKpa] = useState('all')
  const [dir, setDir] = useState('all')

  const kpas = useMemo(
    () => (data ? data.kpas.slice().sort((a, b) => Number(a.number) - Number(b.number)) : []),
    [data],
  )
  const kpaName = useMemo(() => Object.fromEntries(kpas.map((k) => [k.id, k])), [kpas])

  const kpis = data?.kpis || []
  const byDir = (arr, d) => (d === 'all' ? arr : arr.filter((k) => k.direction === d))
  const byKpa = (arr, id) => (id === 'all' ? arr : arr.filter((k) => k.kpa_id === id))

  const filtered = useMemo(() => byDir(byKpa(kpis, kpa), dir), [kpis, kpa, dir])

  return (
    <Layout meta={meta}>
      <div className="container section">
        <Breadcrumb trail={[{ to: '/', label: 'Home' }, { label: 'The numbers' }]} />
        <header className="stack" style={{ marginBottom: 'var(--space-l)' }}>
          <p className="eyebrow">The numbers</p>
          <h1 className="h1">Every target, baseline → 2030/31</h1>
          <p className="lede">
            {kpis.length ? `All ${kpis.length} tracked indicators` : 'Every tracked indicator'} from the CP-7
            results framework. Each bar compares today’s baseline with the 2030/31 target; the figures are
            written out in full. For what this means in everyday terms, see{' '}
            <Link className="link" to="/what-it-means">what it means for you</Link>.
          </p>
        </header>

        {error && <p className="loading">Couldn’t load the data: {error}</p>}
        {loading && <p className="loading">Loading the targets…</p>}

        {data && (
          <>
            <div className="filters">
              <div className="filter-group" role="group" aria-label="Filter by priority area">
                <span className="filter-group__label">Area</span>
                <Chip pressed={kpa === 'all'} onClick={() => setKpa('all')} count={byDir(kpis, dir).length}>All</Chip>
                {kpas.map((k) => (
                  <Chip
                    key={k.id}
                    pressed={kpa === k.id}
                    onClick={() => setKpa(k.id)}
                    count={byDir(byKpa(kpis, k.id), dir).length}
                  >
                    {String(k.number).padStart(2, '0')} {k.focus}
                  </Chip>
                ))}
              </div>
              <div className="filter-group" role="group" aria-label="Filter by direction of change">
                <span className="filter-group__label">Change</span>
                <Chip pressed={dir === 'all'} onClick={() => setDir('all')} count={byKpa(kpis, kpa).length}>All</Chip>
                {DIRECTIONS.map((d) => (
                  <Chip
                    key={d.key}
                    pressed={dir === d.key}
                    onClick={() => setDir(d.key)}
                    count={byDir(byKpa(kpis, kpa), d.key).length}
                  >
                    {d.label}
                  </Chip>
                ))}
              </div>
            </div>

            <p className="result-count" role="status" aria-live="polite">
              Showing {filtered.length} of {kpis.length} indicators
            </p>

            {filtered.length === 0 ? (
              <p className="empty">No indicators match these filters.</p>
            ) : (
              <div className="target-grid">
                {filtered.map((k) => {
                  const tag = directionTag(k)
                  const kp = kpaName[k.kpa_id]
                  return (
                    <article className="target-card" key={k.id} aria-label={k.kpi_name}>
                      <div className="target-card__top">
                        <span className="target-card__kpa">
                          {kp ? `KPA ${kp.number}` : ''}
                        </span>
                        <span className={`tag${tag.fill ? ' tag--fill' : ''}`}>{tag.label}</span>
                      </div>
                      <div className="target-card__name">{k.kpi_name}</div>
                      <div className="target-card__vals">
                        {k.baseline || '—'}
                        <span className="target-card__arrow" aria-hidden="true">→</span>
                        {k.y5_2030_31 || '—'}
                      </div>
                      <ComparisonBar
                        baseline={parseNum(k.baseline)}
                        target={parseNum(k.y5_2030_31)}
                        max={barMax(k.baseline, k.y5_2030_31, k.unit)}
                      />
                      <p className="target-card__plain">{plainLine(k)}</p>
                      <p className="target-card__src">
                        {kp && <Link className="link" to={`/plan/${kp.id}`}>{kp.title}</Link>}
                        {k.source_page ? ` · p.${k.source_page}` : ''}
                      </p>
                    </article>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
