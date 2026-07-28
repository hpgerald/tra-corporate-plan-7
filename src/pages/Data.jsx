import Layout from '../components/Layout.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import { DATASETS } from '../lib/data.js'
import { useData } from '../lib/useData.js'
import { useTitle } from '../lib/useTitle.js'

const DOCS = ['DATA_NOTES.md', 'AUDIT.md']

function fileUrl(name) {
  return `${import.meta.env.BASE_URL}data/${name}`
}

export default function Data() {
  useTitle('Data & methodology')
  const { data, meta } = useData()
  const counts = data
    ? Object.fromEntries(DATASETS.map((n) => [n, (data[n] || []).length]))
    : {}

  return (
    <Layout meta={meta}>
      <div className="container section">
        <Breadcrumb trail={[{ to: '/', label: 'Home' }, { label: 'Data & methodology' }]} />
        <header className="stack" style={{ marginBottom: 'var(--space-l)' }}>
          <p className="eyebrow">Data &amp; methodology</p>
          <h1 className="h1">Every number, downloadable and sourced</h1>
          <p className="lede">
            This site is built entirely from CSV files — no figures are hard-coded. Every numeric row
            carries the printed source page it came from. Download the raw data below.
          </p>
        </header>

        <h2 className="h3" style={{ marginBottom: 'var(--space-s)' }}>Datasets</h2>
        <ul className="kpi-list">
          {DATASETS.map((name) => (
            <li className="kpi-row" key={name}>
              <div>
                <div className="kpi-row__name mono">{name}.csv</div>
                {data && <div className="kpi-row__meta">{counts[name]} rows</div>}
              </div>
              <div className="kpi-row__nums">
                <a className="link" href={fileUrl(`${name}.csv`)} download>Download</a>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="h3" style={{ margin: 'var(--space-l) 0 var(--space-s)' }}>Methodology &amp; notes</h2>
        <ul className="kpi-list">
          {DOCS.map((name) => (
            <li className="kpi-row" key={name}>
              <div className="kpi-row__name mono">{name}</div>
              <div className="kpi-row__nums">
                <a className="link" href={fileUrl(name)} download>Download</a>
              </div>
            </li>
          ))}
        </ul>

        <div className="stack measure" style={{ marginTop: 'var(--space-l)' }}>
          <p className="muted">
            <strong>How it was built.</strong> The figures were extracted from the CP-7 PDF with pdfplumber
            and, for the KPI logframe, reconciled page-by-page against the source images and then aligned to
            TRA’s own clean logframe export. All {data ? data.kpis.length : 258} indicator rows carry their
            planning level (outcome or output) and definition, with figures cross-checked against the source. Page
            numbers refer to the document’s own printed pages. Where a value is not stated in the source it
            is left blank, never invented — see <span className="mono">DATA_NOTES.md</span> and{' '}
            <span className="mono">AUDIT.md</span>.
          </p>
          <p className="muted"><strong>Source.</strong> {meta.citation}</p>
        </div>
      </div>
    </Layout>
  )
}
