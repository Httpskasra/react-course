import { useState } from "react";

export default function Search() {
  const [serachquery, SetSerachquery] = useState("");

  const products = ["iPhone", "MacBook", "AirPods"];
  const filterdProducts = products.filter((i) => {
    return i
      .toLowerCase()
      .replaceAll(" ", "")
      .includes(serachquery.toLowerCase().replaceAll(" ", ""));
  });
  return (
    <>
      <SearchBar query={serachquery} setter={SetSerachquery}>
        <h1>salam</h1>
        <h2>chetori</h2>
      </SearchBar>
      {filterdProducts.map((product) => (
        <Product data={product} />
      ))}
      <SearchBar query={serachquery} setter={SetSerachquery}>
        <hr />
        {filterdProducts.map((product) => (
          <Product data={product} />
        ))}
      </SearchBar>
    </>
  );
}

function Product({ data }) {
  return <h1>{data}</h1>;
}

function SearchBar({ children, query, setter }) {
  return (
    <>
      {children}
      <input
        type="text"
        value={query}
        onChange={(e) => setter(e.target.value)}
      />
    </>
  );
}
