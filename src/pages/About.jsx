import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import { useData } from '../lib/useData.js'
import { useTitle } from '../lib/useTitle.js'

const PRINCIPLES = [
  {
    k: 'Read the numbers as intentions',
    h: 'Targets, not achievements',
    p: 'Every figure on this site is an aspiration or planned target set by TRA in CP-7 — not a result that has been achieved. A target of “18% tax-to-GDP by 2030/31” means the authority aims to reach it, not that it has.',
  },
  {
    k: 'Independence',
    h: 'Not affiliated, not advice',
    p: 'This explainer is not affiliated with, authorised by, or endorsed by the Tanzania Revenue Authority or the Government of Tanzania. It is not legal, tax, or financial advice — for official information, consult TRA or a qualified adviser.',
  },
  {
    k: 'Method',
    h: 'Checked against the source',
    p: 'The data was extracted from the CP-7 document, checked page-by-page, and aligned to TRA’s own logframe export so every indicator carries its planning level, definition, and calculation method.',
  },
  {
    k: 'Transparency',
    h: 'Every number is downloadable',
    p: 'The site is built entirely from open CSV files with no hard-coded figures. The full method and known limitations are documented on the data page.',
  },
]

function Cred({ k, v, big }) {
  return (
    <div className="cred">
      <div className="cred__k">{k}</div>
      <div className={`cred__v${big ? ' cred__v--big' : ''}`}>{v}</div>
    </div>
  )
}

export default function About() {
  useTitle('About')
  const { meta } = useData()
  return (
    <Layout meta={meta}>
      <div className="container">
        <div style={{ paddingTop: 'var(--space-m)' }}>
          <Breadcrumb trail={[{ to: '/', label: 'Home' }, { label: 'About' }]} />
        </div>

        <header className="about-hero">
          <p className="eyebrow">About</p>
          <h1 className="about-hero__title">A plain-language look at CP-7</h1>
          <p className="about-hero__lede">
            An independent explainer of the {meta.doc_title || 'Seventh Corporate Plan (CP-7)'} — reorganising
            the plan’s own goals and targets so anyone can understand, in a few minutes, what the{' '}
            {meta.publisher || 'Tanzania Revenue Authority'} intends to do over 2026/27–2030/31.
          </p>
        </header>

        {/* 01 — What this is */}
        <section className="about-section">
          <div className="about-section__head">
            <span className="about-section__n">01</span>
            <h2 className="about-section__title">What this is — and isn’t</h2>
          </div>
          <div className="principle-grid">
            {PRINCIPLES.map((pr) => (
              <div className="principle" key={pr.h}>
                <span className="principle__k">{pr.k}</span>
                <h3 className="principle__h">{pr.h}</h3>
                <p className="principle__p">
                  {pr.h === 'Every number is downloadable' ? (
                    <>The site is built entirely from open CSV files with no hard-coded figures. The full
                    method and known limitations are documented on the{' '}
                    <Link className="link" to="/data">data page</Link>.</>
                  ) : pr.p}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pull quote */}
        <figure className="pullquote">
          <span className="pullquote__mark" aria-hidden="true">“</span>
          <p>Turning complex public information into experiences people can actually understand.</p>
        </figure>

        {/* 02 — Founder */}
        <section className="about-section">
          <div className="about-section__head">
            <span className="about-section__n">02</span>
            <h2 className="about-section__title">About the founder</h2>
          </div>

          <div className="founder">
            <div className="founder__aside">
              <div className="monogram" aria-hidden="true">GT</div>
              <div className="monogram__rule" aria-hidden="true" />
              <p className="founder__name">Gerald Tesha</p>
              <p className="founder__role">Founder · Information visualization</p>
            </div>

            <div className="founder__body stack">
              <p className="lede">
                This project is part of a broader effort to establish an independent Information Visualization
                Institute — dedicated to making complex public information easier to understand through clear,
                accessible, evidence-based visual communication.
              </p>
              <p>
                The institute’s long-term vision is to turn government strategies, policies, research,
                statistics, budgets, and development reports into interactive experiences that help citizens,
                researchers, policymakers, educators, and development partners make sense of the issues shaping
                society.
              </p>
              <p>
                Gerald is an Information Systems and Network Engineer with a specialization in Information
                Visualization. Based in Dodoma, Tanzania, he has more than nine years of experience across
                data, monitoring and evaluation, information management, and visualization for health and
                international development programmes in Sub-Saharan Africa.
              </p>

              <div className="cred-grid">
                <Cred k="Experience" v="9+ years" big />
                <Cred k="Based in" v="Dodoma, Tanzania" big />
                <Cred k="Discipline" v="Information Systems & Network Engineering — St. Joseph College of Engineering and Technology" />
                <Cred k="Specialization" v="Information Visualization — NYU Tandon School of Engineering" />
              </div>

              <p>
                Collaborators, researchers, designers, software engineers, institutions, and organizations
                interested in advancing this work are warmly welcome to get in touch.
              </p>
            </div>
          </div>
        </section>

        {/* 03 — Contact */}
        <section className="about-section" style={{ borderBottom: 'none' }}>
          <div className="about-section__head">
            <span className="about-section__n">03</span>
            <h2 className="about-section__title">Get in touch</h2>
          </div>
          <div className="contact-cells">
            <a className="contact-cell" href="mailto:hpgerald@gmail.com">
              <span className="contact-cell__k">Email</span>
              <span className="contact-cell__v">hpgerald@gmail.com</span>
            </a>
            <a className="contact-cell" href="tel:+255763453400">
              <span className="contact-cell__k">Phone</span>
              <span className="contact-cell__v">+255 763 453 400</span>
            </a>
            <a className="contact-cell" href="https://www.linkedin.com/in/gtesha/" target="_blank" rel="noopener noreferrer">
              <span className="contact-cell__k">LinkedIn</span>
              <span className="contact-cell__v">linkedin.com/in/gtesha</span>
            </a>
          </div>
        </section>

        <p className="muted" style={{ margin: 'var(--space-l) 0 var(--space-xl)', fontSize: 'var(--step--1)' }}>
          Citation: {meta.citation}
        </p>
      </div>
    </Layout>
  )
}
