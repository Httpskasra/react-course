export default function SearchBox({ value, onChange }) {
  return <input className="input" value={value} onChange={e => onChange(e.target.value)} placeholder="Search products..." />
}
