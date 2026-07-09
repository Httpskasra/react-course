import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
// import Test from "./components/Test";

function App() {
  // const [counter, setCounter] = useState(0);

  const [loading, setLoading] = useState(true);
  const [products, setproducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();

        setproducts(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);



  return (
    <>
      {loading ?
        <p> loading ...</p>
      : <div>
          {" "}
          {products.map((m) => (
            <h4>{m.title}</h4>
          ))}
        </div>
      }
      {/* <button
        onClick={() => {
          setCounter(counter + 1);
        }}>
        {" "}
        {counter}
      </button> */}

      {/* <Test/> */}
    </>
  );
}

export default App;
