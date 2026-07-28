import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

// ---- shared helpers -------------------------------------------------
export function BasisTag({ basis }) {
  const doc = /^doc/i.test(basis)
  return <span className={`basis ${doc ? 'basis--doc' : 'basis--inf'}`}>{doc ? 'Documented' : 'Inferred'}</span>
}

export function Legend() {
  return (
    <div className="legend">
      <span>Every insight is evidence-based and labelled:</span>
      <span className="legend__item"><span className="basis basis--doc">Documented</span> stated in CP-7</span>
      <span className="legend__item"><span className="basis basis--inf">Inferred</span> our analysis of the plan</span>
    </div>
  )
}

const KEY_LABEL = {
  ngos: 'NGOs', development_partners: 'Development partners', tech_companies: 'Technology companies',
  financial_institutions: 'Financial institutions', local_government: 'Local government',
  data_professionals: 'Data professionals', private_companies: 'Private companies', job_seekers: 'Job seekers',
}
function label(k) {
  return KEY_LABEL[k] || k.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}
const split = (s) => (s ? s.split('|').map((x) => x.trim()).filter(Boolean) : [])

function KpaLink({ kpas, id, page }) {
  const kp = kpas.find((k) => k.id === id)
  return (
    <span className="intel-card__ev">
      {kp && <Link className="link" to={`/plan/${kp.id}`}>{kp.title}</Link>}
      {page ? `${kp ? ' · ' : ''}p.${page}` : ''}
    </span>
  )
}

// ---- 1. Audience intelligence --------------------------------------
export function AudienceIntel({ audiences, kpas }) {
  const [sel, setSel] = useState(audiences[0]?.id)
  const a = audiences.find((x) => x.id === sel) || audiences[0]
  if (!a) return null
  return (
    <div>
      <div className="filter-group" role="group" aria-label="Choose an audience">
        {audiences.map((x) => (
          <button key={x.id} type="button" className="chip" aria-pressed={x.id === a.id} onClick={() => setSel(x.id)}>
            {x.audience}
          </button>
        ))}
      </div>
      <div className="aud-panel">
        <div className="aud-panel__head">
          <div className="aud-panel__name">{a.audience}</div>
          <p className="aud-panel__why">{a.why_it_matters}</p>
        </div>
        <div className="aud-grid">
          <div className="aud-cell">
            <div className="aud-cell__k">What opportunities exist</div>
            <p>{a.opportunities}</p>
          </div>
          <div className="aud-cell">
            <div className="aud-cell__k">What to consider doing</div>
            <p>{a.actions}</p>
          </div>
          <div className="aud-cell">
            <div className="aud-cell__k">Skills to develop</div>
            <div className="aud-cell__tags">
              {split(a.skills).map((s) => <span className="tag" key={s}>{s}</span>)}
              {!split(a.skills).length && <span className="muted">—</span>}
            </div>
          </div>
          <div className="aud-cell">
            <div className="aud-cell__k">Sectors to watch</div>
            <div className="aud-cell__tags">
              {split(a.sectors_to_watch).map((s) => <span className="tag" key={s}>{s}</span>)}
            </div>
          </div>
          <div className="aud-cell">
            <div className="aud-cell__k">Who to engage with</div>
            <div className="aud-cell__tags">
              {split(a.engage_with).map((s) => <span className="tag" key={s}>{s}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- 2. Opportunity explorer ---------------------------------------
export function OpportunityExplorer({ opportunities, kpas }) {
  const [type, setType] = useState('all')
  const types = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.type))).sort(),
    [opportunities],
  )
  const shown = type === 'all' ? opportunities : opportunities.filter((o) => o.type === type)
  return (
    <div>
      <div className="filter-group" role="group" aria-label="Filter opportunities by type">
        <span className="filter-group__label">Type</span>
        <button type="button" className="chip" aria-pressed={type === 'all'} onClick={() => setType('all')}>
          All<span className="chip__count"> {opportunities.length}</span>
        </button>
        {types.map((t) => (
          <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
            {t}<span className="chip__count"> {opportunities.filter((o) => o.type === t).length}</span>
          </button>
        ))}
      </div>
      <p className="result-count" role="status" aria-live="polite">Showing {shown.length} of {opportunities.length} opportunities</p>
      <div className="intel-grid intel-grid--3">
        {shown.map((o) => (
          <article className="intel-card" key={o.id} aria-label={o.title}>
            <div className="intel-card__top">
              <span className="intel-card__type">{o.type}</span>
              <BasisTag basis={o.basis} />
            </div>
            <div className="intel-card__title">{o.title}</div>
            <p className="intel-card__desc">{o.description}</p>
            <div className="aud-cell__tags">
              {split(o.audiences).map((k) => <span className="tag" key={k}>{label(k)}</span>)}
            </div>
            <div className="intel-card__ev">Evidence: {o.evidence}</div>
            <KpaLink kpas={kpas} id={o.related_kpa} page={o.source_page} />
          </article>
        ))}
      </div>
    </div>
  )
}

// ---- 3. Skills map --------------------------------------------------
const DEMAND_CLASS = { high: 'demand--high', rising: 'demand--rising', emerging: 'demand--emerging' }
export function SkillsMap({ skills, kpas }) {
  const cats = []
  const seen = new Map()
  for (const s of skills) {
    if (!seen.has(s.category)) { seen.set(s.category, cats.length); cats.push({ cat: s.category, items: [] }) }
    cats[seen.get(s.category)].items.push(s)
  }
  return (
    <div>
      {cats.map((c) => (
        <section className="skill-cat" key={c.cat}>
          <h3 className="skill-cat__head">{c.cat} skills</h3>
          <div className="intel-grid intel-grid--3">
            {c.items.map((s) => (
              <article className="intel-card" key={s.id} aria-label={s.skill}>
                <div className="intel-card__top">
                  <span className="intel-card__title">{s.skill}</span>
                  <span className={`demand ${DEMAND_CLASS[s.demand.toLowerCase()] || ''}`}>{s.demand}</span>
                </div>
                <p className="intel-card__desc">{s.why_it_matters}</p>
                <div className="intel-card__foot">
                  <span className="intel-card__ev" style={{ border: 0, margin: 0, padding: 0 }}>Where: {s.where_in_strategy}</span>
                </div>
                <div className="intel-card__foot">
                  <BasisTag basis={s.basis} />
                  <KpaLink kpas={kpas} id={s.related_kpa} page={s.source_page} />
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

// ---- 4. Sector attention heatmap -----------------------------------
export function SectorHeatmap({ sectors, kpas }) {
  const rows = sectors.slice().sort((a, b) => Number(b.attention) - Number(a.attention))
  return (
    <div className="heatmap">
      {rows.map((s) => {
        const n = Number(s.attention) || 0
        return (
          <div className="heat-row" key={s.id}>
            <div>
              <div className="heat-row__label">{s.sector}</div>
              <div className="heat-row__sub">{s.outlook}</div>
            </div>
            <div>
              <div className="heat-bar" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={`heat-cell${i <= n ? ' heat-cell--on' : ''}`} />
                ))}
                <span className="heat-score">{n}/5 attention</span>
              </div>
              <div className="heat-row__sub" style={{ marginTop: '0.3em' }}>
                {s.why} <BasisTag basis={s.basis} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---- 5. Strategic briefing -----------------------------------------
const CAT_ORDER = [
  ['priority', 'National priorities'],
  ['dependency', 'Implementation dependencies'],
  ['risk', 'Risks that could delay delivery'],
  ['gap', 'Capability gaps'],
  ['leverage', 'Strategic leverage points'],
  ['success', 'Key success factors'],
  ['theme', 'Hidden themes'],
]
export function StrategicBriefing({ items, kpas }) {
  const byCat = Object.fromEntries(CAT_ORDER.map(([k]) => [k, []]))
  for (const it of items) (byCat[it.category] || (byCat[it.category] = [])).push(it)
  return (
    <div>
      {CAT_ORDER.map(([cat, title]) => (
        byCat[cat]?.length ? (
          <section key={cat}>
            <h3 className="brief-group__head">{title}</h3>
            {byCat[cat].map((it) => (
              <details className="brief" key={it.id}>
                <summary>
                  <span className="brief__title">{it.title}</span>
                  <span style={{ display: 'inline-flex', gap: '0.5em', alignItems: 'center' }}>
                    <BasisTag basis={it.basis} />
                    <span className="brief__toggle" aria-hidden="true">+</span>
                  </span>
                </summary>
                <div className="brief__body">
                  <p>{it.insight}</p>
                  <p className="brief__ev">Evidence: {it.evidence}</p>
                  <KpaLink kpas={kpas} id={it.related_kpa} page={it.source_page} />
                </div>
              </details>
            ))}
          </section>
        ) : null
      ))}
    </div>
  )
}
