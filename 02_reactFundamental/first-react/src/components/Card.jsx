export default function Card({ parentData }) {
  return (
    <>
      {parentData.map((el) => {
        return <SingleCard title={el.title} desc={el.desc} />;
      })}
    </>
  );
}

function SingleCard({ title, desc }) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>

      <p className="text-gray-400">{desc}</p>
    </div>
  );
}
