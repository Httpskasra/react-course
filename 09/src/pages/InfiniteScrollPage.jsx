import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts } from "../api";
import ProductCard from "../components/ProductCard";
import { ErrorBox, Loading } from "../components/StateBox";

const PAGE_SIZE = 8;

export default function InfiniteScrollPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasNextPage, setHasNextPage] = useState(true);

  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const nextPageRef = useRef(1);
  const hasNextPageRef = useRef(true);
  const requestIdRef = useRef(0);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasNextPageRef.current) return;

    const requestId = ++requestIdRef.current;
    const pageToLoad = nextPageRef.current;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const result = await getProducts({ page: pageToLoad, limit: 8 });

      if (requestId !== requestIdRef.current) return;

      setItems((currentItems) => {
        const byId = new Map(currentItems.map((item) => [item.id, item]));

        for (const item of result.items) {
          byId.set(item.id, item);
        }

        return Array.from(byId.values());
      });

      nextPageRef.current = result.page + 1;
      hasNextPageRef.current = result.hasNextPage;
      setHasNextPage(result.hasNextPage);
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (loading || !hasNextPage) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [items.length, loading, hasNextPage, loadMore]);

  return (
    <section className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-violet-400">
          Teaching Demo
        </p>
        <h2 className="text-3xl font-black">Infinite Scroll</h2>
        <p className="mt-2 text-slate-400">
          وقتی به انتهای لیست نزدیک می‌شوید، صفحه‌ی بعدی به‌صورت خودکار دریافت و
          به داده‌های قبلی اضافه می‌شود.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <span className="rounded-lg bg-white/5 px-3 py-2">
          تعداد آیتم‌های دریافت‌شده:{" "}
          <strong className="text-white">{items.length}</strong>
        </span>
        <span className="rounded-lg bg-white/5 px-3 py-2">
          صفحه‌ی بعدی:{" "}
          <strong className="text-white">
            {hasNextPage ? nextPageRef.current : "—"}
          </strong>
        </span>
      </div>

      {error && (
        <div className="space-y-3">
          <ErrorBox message={error} />
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50">
            تلاش دوباره
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {loading && (
        <Loading
          text={
            items.length ?
              "در حال بارگذاری صفحه بعدی..."
            : "در حال دریافت صفحه اول..."
          }
        />
      )}

      {!hasNextPage && items.length > 0 && (
        <p className="py-5 text-center text-sm text-slate-500">
          به انتهای لیست رسیدید.
        </p>
      )}

      {hasNextPage && (
        <div ref={sentinelRef} className="h-12 w-full" aria-hidden="true" />
      )}
    </section>
  );
}
