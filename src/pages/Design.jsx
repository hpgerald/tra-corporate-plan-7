import Layout from '../components/Layout.jsx'
import StatCard from '../components/StatCard.jsx'
import IndexHub from '../components/IndexHub.jsx'
import ComparisonBar from '../components/ComparisonBar.jsx'

const GREYS = [
  'var(--black)', 'var(--grey-900)', 'var(--grey-800)', 'var(--grey-700)',
  'var(--grey-600)', 'var(--grey-500)', 'var(--grey-400)', 'var(--grey-300)',
  'var(--grey-200)', 'var(--grey-100)', 'var(--white)',
]
const GREY_NAMES = ['black', '900', '800', '700', '600', '500', '400', '300', '200', '100', 'white']

const TYPE = [
  ['display', 'Display · step-5'],
  ['h1', 'Heading 1 · step-4'],
  ['h2', 'Heading 2 · step-3'],
  ['h3', 'Heading 3 · step-2'],
  ['lede', 'Lede · step-1'],
  ['', 'Body · step-0 — the quick brown fox jumps over the lazy dog.'],
  ['eyebrow', 'Eyebrow · step-−1'],
]

export default function Design() {
  return (
    <Layout>
      <div className="container section stack-l">
        <header className="stack">
          <p className="eyebrow">Design system</p>
          <h1 className="h1">Monochrome, editorial, type-led</h1>
          <p className="lede">
            Meaning comes from type, scale, thin rules and whitespace — never colour.
            Interactive elements invert to black on hover and focus.
          </p>
        </header>

        <hr className="rule rule--strong" />

        {/* Palette */}
        <section className="stack" aria-labelledby="d-palette">
          <h2 id="d-palette" className="h3">Palette — grey ramp only</h2>
          <div className="grid grid--4">
            {GREYS.map((c, i) => (
              <div className="swatch" key={i}>
                <div className="swatch__chip" style={{ background: c }} />
                <div className="swatch__label">{GREY_NAMES[i]}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule" />

        {/* Type scale */}
        <section className="stack" aria-labelledby="d-type">
          <h2 id="d-type" className="h3">Type scale — fluid</h2>
          <div className="stack">
            {TYPE.map(([cls, label], i) => (
              <div key={i} className={cls}>{label}</div>
            ))}
          </div>
        </section>

        <hr className="rule" />

        {/* Numbered index hub — hover states */}
        <section className="stack" aria-labelledby="d-hub">
          <h2 id="d-hub" className="h3">Numbered index hub — hover to invert</h2>
          <IndexHub
            items={[
              { num: 1, title: 'Revenue mobilisation', meta: '57 indicators', to: '/design' },
              { num: 2, title: 'Digital & data capability', meta: '29 indicators', to: '/design' },
              { num: 3, title: 'Stakeholder engagement', meta: '24 indicators', to: '/design' },
            ]}
          />
        </section>

        <hr className="rule" />

        {/* Stat cards */}
        <section className="stack" aria-labelledby="d-stats">
          <h2 id="d-stats" className="h3">Stat cards</h2>
          <div className="grid grid--3">
            <StatCard value="×1.9" label="Revenue growth" note="TZS 40tn → 75tn by 2030/31" />
            <StatCard value="18%" label="Tax yield target" note="up from 14.5%" />
            <StatCard value="2 days" label="Customs clearance" note="down from 4 days" />
          </div>
        </section>

        <hr className="rule" />

        {/* Comparison bar + tags */}
        <section className="stack" aria-labelledby="d-bar">
          <h2 id="d-bar" className="h3">Comparison bar &amp; direction tags</h2>
          <div className="grid grid--2">
            <div className="stack">
              <div className="num" style={{ fontWeight: 700 }}>30% → 55%</div>
              <ComparisonBar baseline={30} target={55} max={100} />
              <p className="muted">Large taxpayers’ contribution. Bar is decorative; numbers are text.</p>
            </div>
            <div className="stack" style={{ display: 'flex', gap: 'var(--space-2xs)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <span className="tag tag--fill">Grow ×1.8</span>
              <span className="tag">Reduce</span>
              <span className="tag">Maintain</span>
              <span className="tag">● New</span>
            </div>
          </div>
        </section>

        <hr className="rule" />

        {/* Buttons & links */}
        <section className="stack" aria-labelledby="d-controls">
          <h2 id="d-controls" className="h3">Controls</h2>
          <p>
            An inline <a className="link" href="#main">text link</a> and a{' '}
            <a className="btn" href="#main">ghost button</a>, both invert on hover/focus.
          </p>
        </section>
      </div>
    </Layout>
  )
}
