import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api";
import { Empty, ErrorBox, Loading } from "../components/StateBox";

export default function PaginationPage() {
  const LIMIT = 8;
  const [Data, setData] = useState([]);
  const [Page, setPage] = useState(1);
  const [loading, setloading] = useState(false);
  const [Error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts(Page) {
      try {
        setloading(true);
        setError("");

        const data = await getProducts(Page, LIMIT, controller.signal);

        setData(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setloading(false);
      }
    }

    fetchProducts(Page);

    return () => {
      controller.abort();
    };
  }, [Page]);

  return (
    <section className="space-y-6">
      <PageHeading
        title="Pagination"
        description="فعلاً همه چیز استاتیک است. قرار است بعداً pagination واقعی، state و API را روی همین قالب اضافه کنیم."
      />
      {Error && <ErrorBox message={Error} />}
      {loading && <Loading />}
      {!Data.items ?
        <Empty />
      : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Data?.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      }

      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row">
        <p className="text-sm text-slate-400">صفحه 1 از 5 — مجموع 40 محصول</p>

        <div className="flex gap-2">
          <button
            className="rounded-xl bg-white/10 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setPage( p - 1)}
            disabled={!Data.hasPrevPage || loading}>
            قبلی
          </button>

          {Array.from({ length: Data.totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, Page - 2), Page + 3)
            .map((number) => (
              <button
                key={number}
                className={`h-10 w-10 rounded-xl ${
                  number === Page ?
                    "bg-white font-black text-slate-950"
                  : "bg-white/10"
                }`}
                onClick={() => setPage(number)}>
                {number}
              </button>
            ))}
          <button
            className="rounded-xl bg-white/10 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setPage((p) => p + 1)}
            disabled={!Data.hasNextPage || loading}>
            بعدی
          </button>
        </div>
      </div>
    </section>
  );
}

function PageHeading({ title, description }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-cyan-400">
        Starter Template
      </p>

      <h2 className="text-3xl font-black">{title}</h2>

      <p className="mt-2 max-w-3xl text-slate-400">{description}</p>
    </div>
  );
}
