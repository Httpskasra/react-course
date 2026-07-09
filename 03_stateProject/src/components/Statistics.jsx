export default function Statistics({ tasks }) {
  const actives = tasks.filter((t) => t.status === "active").length;
  const compeletes = tasks.length - actives;
  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className="
          bg-green-900
          p-4
          rounded
        ">
        <p>active</p>
        <h3>{actives}</h3>
      </div>

      <div
        className="
          bg-blue-900
          p-4
          rounded
        ">
        <p>Completed </p>
        <h3>{compeletes}</h3>
      </div>
    </div>
  );
}
