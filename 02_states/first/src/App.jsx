import { useState } from "react";
import "./App.css";
import Form from "./components/Form";

function App() {
  const [count, setCount] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const fullName = name + lastName;
  function onCount() {
    setCount((prev) => prev + 1);
  }
  return (
    <>
      <div >
        <button onClick={onCount}>{count} </button>
        <button onClick={() => setIsDark(!isDark)}>change theme </button>
        <h1>{count % 2 == 0 ? "zoj" : "fard"}</h1>

        <hr />
        <h5>first</h5>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <h5>last</h5>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <h2>{lastName}</h2>

        <h1>{fullName}</h1>

        <hr />
        <Form/>
      </div>
    </>
  );
}

export default App;

function SimpleForm() {
  const [name, setName] = useState("");

  return (
    <div>
      <h2>Simple Form</h2>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p>Name: {name}</p>
    </div>
  );
}
