import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Pannel from "./components/Pannel";
import SearchBar from "./components/SerachBar";
import Statistics from "./components/Statistics";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Mars Explorer",
      status: "active",
      description: "Exploration mission to Mars.",
    },
    {
      id: 2,
      name: "Moon Base",
      status: "completed",
      description: "First lunar settlement mission.",
    },
    {
      id: 3,
      name: "Europa Probe",
      status: "active",
      description: "Probe mission to Europa.",
    },
    {
      id: 4,
      name: "Titan Research",
      status: "completed",
      description: "Research mission to Titan.",
    },
  ]);
  const [search, setSearech] = useState("");
  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }
  function toggleTask(id) {
    setTasks(
      tasks.map((i) =>
        i.id === id ?
          { ...i, status: i.status === "active" ? "complete" : "active" }
        : i,
      ),
    );
  }
  const fillterdTasks = tasks.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <SearchBar search={search} onSearch={setSearech} />
      <div className="max-w-6xl mx-auto p-6">
        <Pannel title={"Mission Statistics"}>
          <Statistics tasks={tasks} />
        </Pannel>
        <TaskList
          data={fillterdTasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;
