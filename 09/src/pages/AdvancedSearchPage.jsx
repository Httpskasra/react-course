import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api";
import ProductCard from "../components/ProductCard";
import { Empty, ErrorBox, Loading } from "../components/StateBox";
import useDebounce from "../hooks/useDebounce";

const initialFilters = {
  q: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
  inStock: "",
  sort: "title_asc",
};

export default function AdvancedSearchPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedQuery = useDebounce(filters.q, 500);

  const requestFilters = useMemo(
    () => ({ ...filters, q: debouncedQuery, page: 1, limit: 24 }),
    [filters, debouncedQuery],
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    getProducts(requestFilters, controller.signal)
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [requestFilters]);

  const update = (name, value) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  return (
    <section className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-emerald-400">
          Teaching Demo
        </p>
        <h2 className="text-3xl font-black">Advanced Search</h2>
        <p className="mt-2 text-slate-400">
          جست‌وجوی debounce شده + فیلتر دسته‌بندی، قیمت، امتیاز، موجودی و
          مرتب‌سازی.
        </p>
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-2 lg:grid-cols-4">
        <Field label="عبارت جست‌وجو" className="lg:col-span-2">
          <input
            value={filters.q}
            onChange={(e) => update("q", e.target.value)}
            placeholder="مثلاً React یا Monitor"
            className="control"
          />
        </Field>
        <Field label="دسته‌بندی">
          <select
            value={filters.category}
            onChange={(e) => update("category", e.target.value)}
            className="control">
            <option value="">همه</option>
            <option>Books</option>
            <option>Electronics</option>
            <option>Accessories</option>
            <option>Office</option>
          </select>
        </Field>
        <Field label="مرتب‌سازی">
          <select
            value={filters.sort}
            onChange={(e) => update("sort", e.target.value)}
            className="control">
            <option value="title_asc">نام: A → Z</option>
            <option value="price_asc">قیمت: کم به زیاد</option>
            <option value="price_desc">قیمت: زیاد به کم</option>
            <option value="rating_desc">بالاترین امتیاز</option>
          </select>
        </Field>
        <Field label="حداقل قیمت">
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="control"
          />
        </Field>
        <Field label="حداکثر قیمت">
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="control"
          />
        </Field>
        <Field label="حداقل امتیاز">
          <select
            value={filters.minRating}
            onChange={(e) => update("minRating", e.target.value)}
            className="control">
            <option value="">مهم نیست</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </Field>
        <Field label="موجودی">
          <select
            value={filters.inStock}
            onChange={(e) => update("inStock", e.target.value)}
            className="control">
            <option value="">همه</option>
            <option value="true">فقط موجود</option>
            <option value="false">فقط ناموجود</option>
          </select>
        </Field>
        <div className="lg:col-span-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="text-sm text-slate-400">
            {loading ? "در حال جست‌وجو..." : `${data?.total ?? 0} نتیجه`}
          </p>
          <button
            onClick={() => setFilters(initialFilters)}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15">
            پاک کردن فیلترها
          </button>
        </div>
      </div>

      <style>{`.control{width:100%;border-radius:.75rem;border:1px solid rgb(255 255 255 / .1);background:rgb(15 23 42);padding:.7rem .8rem;color:white}`}</style>
      {error && <ErrorBox message={error} />}
      {loading && !data ?
        <Loading />
      : data?.items.length ?
        <div
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${loading ? "opacity-50" : ""}`}>
          {data.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      : <Empty />}
    </section>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`space-y-2 ${className}`}>
      <span className="block text-xs font-bold text-slate-400">{label}</span>
      {children}
    </label>
  );
}
