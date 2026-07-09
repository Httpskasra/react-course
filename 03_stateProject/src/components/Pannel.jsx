export default function Pannel({ children ,title}) {
  return (
    <div className="border-zinc-600 p-5">
      <h2 className="font-bold">{title}</h2>
      {children}
    </div>
  );
}
