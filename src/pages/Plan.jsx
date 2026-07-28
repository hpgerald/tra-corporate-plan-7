import Layout from '../components/Layout.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import IndexHub from '../components/IndexHub.jsx'
import { useData } from '../lib/useData.js'
import { useTitle } from '../lib/useTitle.js'

export default function Plan() {
  useTitle('The plan')
  const { loading, error, data, meta } = useData()
  return (
    <Layout meta={meta}>
      <div className="container section">
        <Breadcrumb trail={[{ to: '/', label: 'Home' }, { label: 'The plan' }]} />
        <header className="stack" style={{ marginBottom: 'var(--space-l)' }}>
          <p className="eyebrow">The strategy</p>
          <h1 className="h1">Five Key Performance Areas</h1>
          <p className="lede">
            CP-7 is built on five priority areas (KPAs). Each contains strategic objectives, and each
            objective is tracked by measurable indicators with a baseline and a 2030/31 target.
          </p>
        </header>

        {error && <p className="loading">Couldn’t load the data: {error}</p>}
        {loading && <p className="loading">Loading…</p>}

        {data && (
          <IndexHub
            items={data.kpas
              .slice()
              .sort((a, b) => Number(a.number) - Number(b.number))
              .map((k) => ({
                num: k.number,
                title: k.title,
                meta: `${data.kpis.filter((x) => x.kpa_id === k.id).length} indicators · ${k.focus}`,
                to: `/plan/${k.id}`,
              }))}
          />
        )}
      </div>
    </Layout>
  )
}
