import { useEffect } from 'react'

const BASE = 'CP-7 Explained'

// Sets the document title per route, e.g. "The numbers — CP-7 Explained".
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE
  }, [title])
}
