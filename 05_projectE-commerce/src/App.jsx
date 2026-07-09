import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
     <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<AddProduct/>} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/edit" element={<EditProduct />} />
      </Route>
    </Routes>
  );
}

export default App;
