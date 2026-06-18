import { useState } from "react";

function Form() {
  const [form, SetForm] = useState({
    Firstname: "",
    age: 0,
    email: "",
    salam: " ",    
  });
  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    SetForm({ ...form, [name]: value });
  };
  return (
    <form>
      <h2>name</h2>
      <input
        name="Firstname"
        className="border"
        type="text"
        value={form.Firstname}
        // onChange={(e) => {
        //   SetForm(
        //     { ...form, Firstname: e.target.value },
        //     console.log(e.target),
        //   );
        // }}
        onChange={onChangeHandler}
      />
      <h2>age</h2>
      <input
        name="age"
        className="border"
        type="number"
        value={form.age}
        // onChange={(e) => {
        //   SetForm({ ...form, age: e.target.value }, console.log(e.target));
        // }}
        onChange={onChangeHandler}
      />
      <h2>email</h2>
      <input
        name="email"
        className="border"
        type="email"
        value={form.email}
        // onChange={(e) => {
        //   SetForm({ ...form, email: e.target.value }, console.log(e.target));
        // }}
        onChange={onChangeHandler}
      />
      <input
        name="salam"
        className="border"
        type="email"
        value={form.salam}
        // onChange={(e) => {
        //   SetForm({ ...form, email: e.target.value }, console.log(e.target));
        // }}
        onChange={onChangeHandler}
      />

      <p>
        name: {form.Firstname} age : {form.age} email:{form.email} salam:{" "}
        {form.salam}
      </p>
    </form>
  );
}
export default Form;
