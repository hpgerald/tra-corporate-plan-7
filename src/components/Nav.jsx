import { Link, NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/plan', label: 'The plan' },
  { to: '/targets', label: 'Numbers' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/what-it-means', label: 'For you' },
  { to: '/data', label: 'Data' },
  { to: '/about', label: 'About' },
]

export default function Nav() {
  return (
    <header className="nav">
      <nav className="container nav__inner" aria-label="Primary">
        <Link to="/" className="nav__brand">
          CP-7 <span>Explained</span>
        </Link>
        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className="nav__link">
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
