import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

// Shared page shell: skip-link, nav, main landmark, footer.
export default function Layout({ children, meta }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <main id="main">{children}</main>
      <Footer meta={meta} />
    </>
  )
}
