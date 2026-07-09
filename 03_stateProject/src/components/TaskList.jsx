import TaskCard from "./TaskCard";

export default function TaskList({ data, toggleTask  , deleteTask}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {data.map((task) => {
        return <TaskCard task={task} key={task.id} toggleTask={toggleTask} deleteTask={deleteTask} />;
      })}
    </div>
  );
}
