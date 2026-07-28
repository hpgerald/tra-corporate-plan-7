import { Link } from 'react-router-dom'

// trail: array of { to?, label }. The last item is the current page.
export default function Breadcrumb({ trail }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {trail.map((c, i) => (
        <span key={i}>
          {i > 0 && ' / '}
          {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}
