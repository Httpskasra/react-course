export default function CategoryFilter({ value, onChange }) {
  return <select className="input" value={value} onChange={e => onChange(e.target.value)}>
    <option value="all">All categories</option><option value="electronics">Electronics</option><option value="clothing">Clothing</option><option value="books">Books</option><option value="home">Home</option>
  </select>
}
