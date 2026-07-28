import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import { GlossaryText } from '../components/Glossary.jsx'
import {
  Legend, AudienceIntel, OpportunityExplorer, SkillsMap, SectorHeatmap, StrategicBriefing,
} from '../components/Intel.jsx'
import SankeyDeps from '../components/SankeyDeps.jsx'
import { useData } from '../lib/useData.js'
import { useTitle } from '../lib/useTitle.js'

const PERSONAS = [
  { key: 'individual', title: 'If you’re an individual taxpayer' },
  { key: 'business', title: 'If you run a business' },
  { key: 'worker', title: 'If you earn a salary or work at TRA' },
]

function IntelSection({ n, title, sub, children }) {
  return (
    <section className="intel-section" aria-labelledby={`is-${n}`}>
      <div className="intel-head">
        <span className="intel-head__n">{String(n).padStart(2, '0')}</span>
        <h2 id={`is-${n}`} className="intel-head__title">{title}</h2>
        {sub && <p className="intel-head__sub">{sub}</p>}
      </div>
      {children}
    </section>
  )
}

export default function WhatItMeans() {
  useTitle('What it means for you')
  const { loading, error, data, meta } = useData()

  return (
    <Layout meta={meta}>
      <div className="container section">
        <Breadcrumb trail={[{ to: '/', label: 'Home' }, { label: 'What it means for you' }]} />
        <header className="stack" style={{ marginBottom: 'var(--space-l)' }}>
          <p className="eyebrow">Opportunities &amp; strategic intelligence</p>
          <h1 className="h1">What CP-7 means for you</h1>
          <p className="lede">
            Anyone can read the plan. This page goes further — reading the strategic intelligence between the
            lines: the opportunities, skills, sectors and risks the plan implies, and what different people can
            do about them. Underlined terms show a plain definition on hover, tap, or focus.
          </p>
        </header>

        {error && <p className="loading">Couldn’t load the data: {error}</p>}
        {loading && <p className="loading">Loading the intelligence layer…</p>}

        {data && (
          <>
            <Legend />

            <IntelSection
              n={1}
              title="Find yourself"
              sub="Pick who you are to see why CP-7 matters to you, the opportunities it opens, and what to do next."
            >
              <AudienceIntel audiences={data.intel_audiences} kpas={data.kpas} />
            </IntelSection>

            <IntelSection
              n={2}
              title="Opportunities the plan creates"
              sub="Concrete openings implied by CP-7 — each tied to who benefits and the evidence behind it."
            >
              <OpportunityExplorer opportunities={data.intel_opportunities} kpas={data.kpas} />
            </IntelSection>

            <IntelSection
              n={3}
              title="Skills that will be in demand"
              sub="Where the plan points the labour market — what to study, teach, or reskill into, and why."
            >
              <SkillsMap skills={data.intel_skills} kpas={data.kpas} />
            </IntelSection>

            <IntelSection
              n={4}
              title="Sectors to watch"
              sub="How much focus CP-7 places on each sector, scored on our reading of the plan."
            >
              <SectorHeatmap sectors={data.intel_sectors} kpas={data.kpas} />
            </IntelSection>

            <IntelSection
              n={5}
              title="How the pieces connect"
              sub="What CP-7’s delivery depends on: enablers feed capabilities that produce outcomes. Thicker bands mean stronger dependencies."
            >
              <SankeyDeps nodes={data.intel_dep_nodes} links={data.intel_dep_links} />
            </IntelSection>

            <IntelSection
              n={6}
              title="Strategic briefing"
              sub="The bigger picture: national priorities, what delivery depends on, the risks, the gaps, and the leverage points."
            >
              <StrategicBriefing items={data.intel_strategic} kpas={data.kpas} />
            </IntelSection>

            <IntelSection
              n={7}
              title="In everyday terms"
              sub="Concrete, grounded examples of what the targets could mean in day-to-day life."
            >
              {PERSONAS.map((p) => {
                const cards = data.impact.filter((r) => r.audience === p.key)
                if (!cards.length) return null
                return (
                  <div className="persona" key={p.key} style={{ marginTop: 'var(--space-m)' }}>
                    <div className="persona__head">
                      <h3 className="h3">{p.title}</h3>
                    </div>
                    <div className="impact-grid">
                      {cards.map((r) => {
                        const kp = data.kpas.find((k) => k.id === r.related_kpa)
                        return (
                          <article className="impact-card" key={r.id}>
                            <h4 className="impact-card__situation">{r.situation}</h4>
                            <p className="impact-card__change">
                              <GlossaryText text={r.what_changes} glossary={data.glossary} />
                            </p>
                            <p className="impact-card__basis">
                              <GlossaryText text={r.plain_language} glossary={data.glossary} />{' '}
                              {kp && <Link className="link" to={`/plan/${kp.id}`}>{kp.title}</Link>}
                              {r.source_page ? ` · p.${r.source_page}` : ''}
                            </p>
                          </article>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </IntelSection>

            <section className="intel-section" aria-labelledby="glossary-head">
              <div className="intel-head">
                <span className="intel-head__n">08</span>
                <h2 id="glossary-head" className="intel-head__title">Glossary</h2>
              </div>
              <dl className="stack">
                {data.glossary.map((g) => (
                  <div key={g.term}>
                    <dt style={{ fontWeight: 700 }}>{g.term}</dt>
                    <dd style={{ margin: 0, color: 'var(--grey-800)' }}>
                      {g.definition_plain}
                      {g.source_page ? <span className="muted"> (p.{g.source_page})</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </>
        )}
      </div>
    </Layout>
  )
}
