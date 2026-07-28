import { Link } from 'react-router-dom'

// meta is optional so the footer renders on the design preview too.
export default function Footer({ meta = {} }) {
  const citation =
    meta.citation ||
    'Tanzania Revenue Authority, Seventh Corporate Plan 2026/27–2030/31 (CP-7), 2026.'
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="stack">
          <p className="eyebrow">Source</p>
          <p className="measure">{citation}</p>
          <p className="muted">
            An independent plain-language explainer. Not affiliated with or endorsed by TRA.
            Figures are planned targets, not achievements.
          </p>
        </div>
        <div className="stack">
          <p className="eyebrow">Explore</p>
          <p><Link className="link" to="/plan">The five KPAs</Link></p>
          <p><Link className="link" to="/targets">The numbers</Link></p>
          <p><Link className="link" to="/what-it-means">What it means for you</Link></p>
        </div>
        <div className="stack">
          <p className="eyebrow">Reference</p>
          <p><Link className="link" to="/data">Data &amp; methodology</Link></p>
          <p><Link className="link" to="/about">About &amp; disclaimer</Link></p>
        </div>
      </div>
    </footer>
  )
}
