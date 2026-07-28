import Layout from '../components/Layout.jsx'
import StatCard from '../components/StatCard.jsx'
import IndexHub from '../components/IndexHub.jsx'
import { useData, toNum } from '../lib/useData.js'
import { useTitle } from '../lib/useTitle.js'

// Derive 2–3 headline figures straight from the CSVs (never hard-coded).
function headlineFigures(data) {
  const rev = data.revenue || []
  const kpis = data.kpis || []
  const out = []

  const net = rev.find((r) => /net revenue/i.test(r.line_item) && r.scope === 'mainland')
  if (net) {
    const a = toNum(net.fy2026_27)
    const b = toNum(net.fy2030_31)
    if (a && b) {
      out.push({
        value: `×${(b / a).toFixed(1)}`,
        label: 'Revenue growth',
        note: `TZS ${Math.round(a / 1000)}tn → ${Math.round(b / 1000)}tn by 2030/31`,
      })
    }
  }

  const yield_ = rev.find((r) => /yield/i.test(r.line_item) && r.scope === 'mainland')
  if (yield_) {
    out.push({
      value: `${toNum(yield_.fy2030_31)}%`,
      label: 'Tax-to-GDP yield',
      note: `up from ${toNum(yield_.fy2026_27)}%`,
    })
  }

  const clr = kpis.find((k) => /removal \(exit\)|lodgement to issuance/i.test(k.kpi_name) && /day/i.test(k.baseline))
  if (clr) {
    out.push({
      value: clr.y5_2030_31,
      label: 'Customs clearance time',
      note: `down from ${clr.baseline}`,
    })
  }
  return out.slice(0, 3)
}

export default function Home() {
  const { loading, error, data, meta } = useData()
  useTitle()

  return (
    <Layout meta={meta}>
      <div className="container">
        <section className="hero stack">
          <p className="eyebrow">{meta.publisher || 'Tanzania Revenue Authority'}</p>
          <h1 className="hero__title">The tax plan for 2026–2031, in plain language</h1>
          <p className="lede hero__lede">
            The Seventh Corporate Plan (CP-7) sets out how Tanzania’s tax authority intends to
            collect more revenue, more fairly, over the next five years — and what that means for you.
          </p>
        </section>

        {error && <p className="loading">Couldn’t load the data: {error}</p>}
        {loading && <p className="loading">Loading the plan…</p>}

        {data && (
          <>
            <section className="section" aria-labelledby="figures">
              <h2 id="figures" className="visually-hidden">Headline figures</h2>
              <div className="grid grid--3">
                {headlineFigures(data).map((f, i) => (
                  <StatCard key={i} {...f} />
                ))}
              </div>
            </section>

            <section className="section" aria-labelledby="hub-head">
              <div className="section-head">
                <h2 id="hub-head" className="h2">The five priorities</h2>
                <span className="section-head__count">
                  {data.kpis.length} indicators · 5 areas
                </span>
              </div>
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
            </section>

            <section className="section" aria-labelledby="more-head">
              <div className="section-head">
                <h2 id="more-head" className="h2">Go deeper</h2>
              </div>
              <IndexHub
                items={[
                  { num: 6, title: 'The numbers', meta: `${data.kpis.length} tracked targets, baseline → 2030/31`, to: '/targets' },
                  { num: 7, title: 'Timeline', meta: 'Key dates and the five-year rollout', to: '/timeline' },
                  { num: 8, title: 'What it means for you', meta: 'For individuals, businesses and workers', to: '/what-it-means' },
                ]}
              />
            </section>
          </>
        )}
      </div>
    </Layout>
  )
}
