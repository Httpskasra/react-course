export default function SearchBar({ onSearch, search }) {
  return (
    <>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-5 border border-zinc-700 rounded outline-none"
      />
    </>
  );
}
