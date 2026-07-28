// A headline figure. Meaning from scale + rule, never colour.
export default function StatCard({ value, label, note, invert = true }) {
  return (
    <div className={`stat${invert ? ' stat--invert' : ''}`}>
      <span className="stat__value num">{value}</span>
      {label && <span className="stat__label">{label}</span>}
      {note && <span className="stat__note">{note}</span>}
    </div>
  )
}
