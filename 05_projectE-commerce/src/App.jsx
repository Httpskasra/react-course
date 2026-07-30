import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import AddProduct from "./pages/AddProduct";
import Dashboard from "./pages/Dashboard";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="card mx-auto mt-10 max-w-xl text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Authentication Required
        </h2>
        <p className="mt-2 text-slate-500">
          Please click Login in the navbar to simulate admin authentication.
        </p>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/add"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
