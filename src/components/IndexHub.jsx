import { Link } from 'react-router-dom'

// A large NUMBERED index (01, 02, …). Each row inverts to black on hover/focus.
// items: [{ num, title, meta, to }]
export default function IndexHub({ items }) {
  return (
    <nav className="hub" aria-label="Index">
      {items.map((it) => (
        <Link key={it.to} to={it.to} className="hub__item">
          <span className="hub__num" aria-hidden="true">
            {String(it.num).padStart(2, '0')}
          </span>
          <span>
            <span className="hub__title">{it.title}</span>
            {it.meta && <span className="hub__meta"> {it.meta}</span>}
          </span>
          <span className="hub__arrow" aria-hidden="true">→</span>
        </Link>
      ))}
    </nav>
  )
}
