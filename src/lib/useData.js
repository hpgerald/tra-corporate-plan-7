import { useEffect, useState } from 'react'
import { loadAll, metaToObject } from './data.js'

// Loads every CSV once and caches (via data.js cache). Returns derived helpers.
export function useData() {
  const [state, setState] = useState({ loading: true, error: null, data: null })

  useEffect(() => {
    let alive = true
    loadAll()
      .then((data) => {
        if (alive) setState({ loading: false, error: null, data })
      })
      .catch((e) => {
        if (alive) setState({ loading: false, error: e.message, data: null })
      })
    return () => {
      alive = false
    }
  }, [])

  const meta = state.data ? metaToObject(state.data.meta) : {}
  return { ...state, meta }
}

// --- small numeric helpers ---------------------------------
export function toNum(s) {
  if (s == null) return null
  const m = String(s).replace(/,/g, '').match(/-?\d+(\.\d+)?/)
  return m ? parseFloat(m[0]) : null
}
