import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DATASETS, loadCsv } from '../lib/data.js'

// /#/debug — loads every CSV and reports row counts + column headers.
// Used to confirm the data layer works (Phase 2 Definition of Done).
export default function Debug() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const out = []
        for (const name of DATASETS) {
          const data = await loadCsv(name)
          out.push({
            name,
            count: data.length,
            cols: data.length ? Object.keys(data[0]) : [],
          })
        }
        if (alive) setRows(out)
      } catch (e) {
        if (alive) setError(e.message)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const total = rows.reduce((s, r) => s + r.count, 0)

  return (
    <main style={{ padding: '2rem', fontFamily: 'ui-monospace, monospace', maxWidth: 900 }}>
      <p><Link to="/">← home</Link></p>
      <h1 style={{ fontFamily: 'system-ui, sans-serif' }}>Data debug</h1>
      {error && <p style={{ color: '#b00' }}>Error: {error}</p>}
      {!error && !rows.length && <p>Loading…</p>}
      {rows.length > 0 && (
        <>
          <p>{rows.length} datasets · {total} total rows</p>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={cell}>dataset</th>
                <th style={cell}>rows</th>
                <th style={cell}>columns</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td style={cell}>{r.name}</td>
                  <td style={{ ...cell, textAlign: 'right' }}>{r.count}</td>
                  <td style={{ ...cell, fontSize: 12 }}>{r.cols.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  )
}

const cell = {
  border: '1px solid #ccc',
  padding: '4px 8px',
  textAlign: 'left',
  verticalAlign: 'top',
}
