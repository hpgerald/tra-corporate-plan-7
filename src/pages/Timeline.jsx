import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import { useData } from '../lib/useData.js'
import { useTitle } from '../lib/useTitle.js'

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function prettyDate(d) {
  if (!d) return ''
  const m = d.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/)
  if (!m) return d
  return `${m[3] ? m[3].replace(/^0/, '') + ' ' : ''}${MONTHS[Number(m[2])]}`
}

export default function Timeline() {
  useTitle('Timeline')
  const { loading, error, data, meta } = useData()

  const items = (data?.timeline || [])
    .slice()
    .sort((a, b) => (a.year + (a.date || '')).localeCompare(b.year + (b.date || '')))
  const kpaName = data ? Object.fromEntries(data.kpas.map((k) => [k.id, k])) : {}

  return (
    <Layout meta={meta}>
      <div className="container section">
        <Breadcrumb trail={[{ to: '/', label: 'Home' }, { label: 'Timeline' }]} />
        <header className="stack" style={{ marginBottom: 'var(--space-l)' }}>
          <p className="eyebrow">Timeline</p>
          <h1 className="h1">Key dates and the five-year rollout</h1>
          <p className="lede">
            The milestones that frame CP-7 — from the reforms that led into it to the year-by-year targets
            that run through 2030/31.
          </p>
        </header>

        {error && <p className="loading">Couldn’t load the data: {error}</p>}
        {loading && <p className="loading">Loading the timeline…</p>}

        {data && (
          <ol className="timeline">
            {items.map((t) => {
              const kp = kpaName[t.related_kpa]
              return (
                <li className="tl-item" key={t.id}>
                  <div className="tl-item__when">
                    {t.year}
                    {t.date && <span className="tl-item__date">{prettyDate(t.date)}</span>}
                  </div>
                  <div className="tl-item__what">
                    <div className="tl-item__milestone">{t.milestone}</div>
                    <div className="tl-item__meta">
                      {kp && <Link className="link" to={`/plan/${kp.id}`}>{kp.title}</Link>}
                      {t.source_page ? `${kp ? ' · ' : ''}p.${t.source_page}` : ''}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </Layout>
  )
}
