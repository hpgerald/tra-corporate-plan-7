import { useParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import IndexHub from '../components/IndexHub.jsx'
import StatCard from '../components/StatCard.jsx'
import Pager from '../components/Pager.jsx'
import NotFound from './NotFound.jsx'
import { useData } from '../lib/useData.js'
import { useTitle } from '../lib/useTitle.js'

export default function KpaDetail() {
  const { kpaId } = useParams()
  const { loading, error, data, meta } = useData()
  useTitle(data?.kpas.find((k) => k.id === kpaId)?.title || 'The plan')

  if (loading) return <Layout><div className="container section"><p className="loading">Loading…</p></div></Layout>
  if (error) return <Layout><div className="container section"><p className="loading">Couldn’t load the data: {error}</p></div></Layout>

  const kpas = data.kpas.slice().sort((a, b) => Number(a.number) - Number(b.number))
  const kpa = kpas.find((k) => k.id === kpaId)
  if (!kpa) return <NotFound message={`No priority area with id “${kpaId}”.`} />

  const kpis = data.kpis.filter((x) => x.kpa_id === kpa.id)
  const objectives = data.objectives
    .filter((o) => o.kpa_id === kpa.id)
    .sort((a, b) => parseFloat(a.ref) - parseFloat(b.ref))

  const idx = kpas.findIndex((k) => k.id === kpa.id)
  const prev = idx > 0 ? { to: `/plan/${kpas[idx - 1].id}`, title: kpas[idx - 1].title } : null
  const next = idx < kpas.length - 1 ? { to: `/plan/${kpas[idx + 1].id}`, title: kpas[idx + 1].title } : null

  return (
    <Layout meta={meta}>
      <div className="container section">
        <Breadcrumb trail={[{ to: '/', label: 'Home' }, { to: '/plan', label: 'The plan' }, { label: `KPA ${kpa.number}` }]} />
        <header className="stack" style={{ marginBottom: 'var(--space-l)' }}>
          <p className="eyebrow">Key Performance Area {String(kpa.number).padStart(2, '0')}</p>
          <h1 className="h1">{kpa.title}</h1>
          <p className="lede">{kpa.summary_plain}</p>
        </header>

        <div className="grid grid--3" style={{ marginBottom: 'var(--space-xl)' }}>
          <StatCard value={kpis.length} label="Indicators tracked" invert={false} />
          <StatCard value={objectives.length} label="Strategic objectives" invert={false} />
          <StatCard value={kpa.focus} label="In plain terms" invert={false} />
        </div>

        <div className="section-head"><h2 className="h2">Strategic objectives</h2></div>
        <IndexHub
          items={objectives.map((o, i) => ({
            num: i + 1,
            title: o.title,
            meta: `Objective ${o.ref} · ${data.kpis.filter((x) => x.objective_id === o.id).length} indicators`,
            to: `/objective/${o.id}`,
          }))}
        />

        <Pager prev={prev} next={next} />
      </div>
    </Layout>
  )
}
