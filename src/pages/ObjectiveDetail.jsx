import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import KpiList from '../components/KpiList.jsx'
import Pager from '../components/Pager.jsx'
import NotFound from './NotFound.jsx'
import { useData } from '../lib/useData.js'
import { useTitle } from '../lib/useTitle.js'

// Build the Outcome → Output hierarchy by walking rows in document order.
// The KPI logframe lists each outcome (with its indicators) followed by that
// outcome's outputs (each with their own indicators).
function buildClusters(kpis) {
  const clusters = []
  let cur = null
  for (const k of kpis) {
    if (k.level === 'outcome') {
      if (!cur || cur.def !== k.definition) {
        cur = { def: k.definition, outcomeItems: [], outputs: [] }
        clusters.push(cur)
      }
      cur.outcomeItems.push(k)
    } else {
      if (!cur) { cur = { def: null, outcomeItems: [], outputs: [] }; clusters.push(cur) }
      let g = cur.outputs.find((o) => o.def === k.definition)
      if (!g) { g = { def: k.definition, items: [] }; cur.outputs.push(g) }
      g.items.push(k)
    }
  }
  return clusters
}

export default function ObjectiveDetail() {
  const { objId } = useParams()
  const { loading, error, data, meta } = useData()
  useTitle(data?.objectives.find((o) => o.id === objId)?.title || 'Strategic objective')

  if (loading) return <Layout><div className="container section"><p className="loading">Loading…</p></div></Layout>
  if (error) return <Layout><div className="container section"><p className="loading">Couldn’t load the data: {error}</p></div></Layout>

  const objectives = data.objectives.slice().sort((a, b) => parseFloat(a.ref) - parseFloat(b.ref))
  const obj = objectives.find((o) => o.id === objId)
  if (!obj) return <NotFound message={`No strategic objective with id “${objId}”.`} />

  const kpa = data.kpas.find((k) => k.id === obj.kpa_id)
  const kpis = data.kpis.filter((x) => x.objective_id === obj.id)
  const clusters = buildClusters(kpis)
  const nOut = kpis.filter((k) => k.level === 'outcome').length
  const nOutput = kpis.filter((k) => k.level === 'output').length

  const idx = objectives.findIndex((o) => o.id === obj.id)
  const prev = idx > 0 ? { to: `/objective/${objectives[idx - 1].id}`, title: objectives[idx - 1].title } : null
  const next = idx < objectives.length - 1 ? { to: `/objective/${objectives[idx + 1].id}`, title: objectives[idx + 1].title } : null

  return (
    <Layout meta={meta}>
      <div className="container section">
        <Breadcrumb trail={[
          { to: '/', label: 'Home' },
          { to: '/plan', label: 'The plan' },
          kpa ? { to: `/plan/${kpa.id}`, label: `KPA ${kpa.number}` } : { label: 'KPA' },
          { label: `Objective ${obj.ref}` },
        ]} />
        <header className="stack" style={{ marginBottom: 'var(--space-l)' }}>
          <p className="eyebrow">Strategic Objective {obj.ref}{kpa ? ` · ${kpa.title}` : ''}</p>
          <h1 className="h2">{obj.title}</h1>
          <p className="muted">
            {kpis.length} indicators across {nOut} outcome{nOut === 1 ? '' : 's'} and {nOutput} output-level
            measures · source p.{obj.source_page}
          </p>
        </header>

        {clusters.map((c, ci) => (
          <section className="outcome-block" key={ci} aria-label={c.def || 'Indicators'}>
            {c.def && (
              <>
                <p className="outcome-block__label">Outcome</p>
                <h2 className="outcome-block__head">{c.def}</h2>
              </>
            )}
            {c.outcomeItems.length > 0 && <KpiList items={c.outcomeItems} />}
            {c.outputs.map((g, gi) => (
              <div className="output-sub" key={gi}>
                <p className="output-sub__label">Output</p>
                <h3 className="output-sub__head">{g.def}</h3>
                <KpiList items={g.items} />
              </div>
            ))}
          </section>
        ))}

        {kpa && (
          <p style={{ marginTop: 'var(--space-l)' }}>
            <Link className="link" to={`/plan/${kpa.id}`}>← All of {kpa.title}</Link>
          </p>
        )}

        <Pager prev={prev} next={next} />
      </div>
    </Layout>
  )
}
