import { useState } from "react";

export default function TaskCard({ task, toggleTask, deleteTask }) {
  const [expand, setExpand] = useState(false);

  return (
    <div
      className="
        bg-zinc-900
        p-5
        rounded-xl
      ">
      <div
        className="
          flex
          justify-between
          items-center
        ">
        <h3
          className="
            text-xl
            font-bold
          ">
          {task.name}
        </h3>

        <span
          className={`
            px-3 py-1 rounded
            
              
               "bg-green-600"
            
          
          `}>
          {task.status}
        </span>
      </div>

      {expand && (
        <p
          className="
            text-zinc-400
            mt-4
          ">
          {task.description}
        </p>
      )}

      <div
        className="
          flex
          gap-3
          mt-4
        ">
        <button
          className="
            px-3
            py-2
            bg-zinc-700
            rounded
          "
          onClick={() => {
            setExpand(!expand);
          }}>
          {expand ? "hide" : "detail"}
        </button>

        <button
          className="
            px-3
            py-2
            bg-indigo-600
            rounded
          "
          onClick={() => {
            toggleTask(task.id);
          }}>
          Toggle Status
        </button>

        <button
          className="
            px-3
            py-2
            bg-red-600
            rounded
          "
          onClick={() => deleteTask(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
