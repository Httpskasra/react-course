import { Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/appLayout";
import { DashboardPage } from "./pages/DashboardPage";
import Products from "./pages/Products";
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/products" element={<Products />} />
      </Route>
    </Routes>
  );
}
