import { Link } from 'react-router-dom'

// Prev/next paging between sibling sections. prev/next are { to, title } or null.
export default function Pager({ prev, next }) {
  return (
    <nav className="pager" aria-label="Section paging">
      {prev ? (
        <Link className="pager__link" to={prev.to}>
          <span className="pager__dir">← Previous</span>
          <span className="pager__title">{prev.title}</span>
        </Link>
      ) : (
        <span className="pager__link pager__link--empty" aria-hidden="true" />
      )}
      {next ? (
        <Link className="pager__link pager__link--next" to={next.to}>
          <span className="pager__dir">Next →</span>
          <span className="pager__title">{next.title}</span>
        </Link>
      ) : (
        <span className="pager__link pager__link--next pager__link--empty" aria-hidden="true" />
      )}
    </nav>
  )
}
