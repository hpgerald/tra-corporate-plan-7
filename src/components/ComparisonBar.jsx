// Proportional comparison bar: baseline -> target.
// Purely decorative (aria-hidden); the numbers are always shown as text nearby.
// values are numeric; `max` sets the scale (defaults to the larger of the two).
export default function ComparisonBar({ baseline, target, max }) {
  const hi = (max ?? Math.max(baseline || 0, target || 0) * 1.05) || 1
  const pct = (v) => `${Math.max(0, Math.min(100, ((v || 0) / hi) * 100))}%`
  return (
    <div className="cbar" aria-hidden="true">
      <div className="cbar__track">
        <div className="cbar__fill" style={{ width: pct(target) }} />
        {Number.isFinite(baseline) && (
          <div className="cbar__base" style={{ left: pct(baseline) }} />
        )}
      </div>
    </div>
  )
}
