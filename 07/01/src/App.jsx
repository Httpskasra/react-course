import { NavLink, Route, Routes } from "react-router-dom";
import FullFormPage from "./pages/FullFormPage";
import MultiStepFormPage from "./pages/MultiStepFormPage";
import Test from "./pages/test";

const navClass = ({ isActive }) =>
  `rounded-xl px-4 py-2 text-sm font-black transition ${
    isActive
      ? "bg-cyan-400 text-slate-950"
      : "text-slate-300 hover:bg-white/5 hover:text-white"
  }`;

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black">React Form Lab</p>
            <p className="mt-1 text-xs text-slate-400">
              React Hook Form + Zod + Context + localStorage
            </p>
          </div>

          <nav className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            <NavLink to="/" end className={navClass}>
              فرم کامل
            </NavLink>
            <NavLink to="/wizard" className={navClass}>
              فرم چندمرحله‌ای
            </NavLink>
            <NavLink to="/test" className={navClass}>
              test
            </NavLink>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<FullFormPage />} />
        <Route path="/wizard" element={<MultiStepFormPage />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </div>
  );
}
