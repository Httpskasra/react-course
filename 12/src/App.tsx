import { useState } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "./api/products";
import { ProductForm } from "./components/ProductForm";
import { useDebounce } from "./hooks/useDebounce";
import {
  productDetailOptions,
  productKeys,
  useCreateProduct,
  useDeleteProduct,
  useInfiniteProducts,
  useProduct,
  useProducts,
  useToggleStock,
  useUpdateProduct,
} from "./hooks/useProducts";
import type { Product, ProductInput } from "./types/product";
export default function App() {
  const client = useQueryClient();
  const fetching = useIsFetching({ queryKey: productKeys.all });
  const [mode, setMode] = useState<"pages" | "infinite">("pages");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const search = useDebounce(q);
  const [selectedId, setSelectedId] = useState(0);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const filters = { q: search, category, page, limit: 8 };
  const list = useProducts(filters);
  const infinite = useInfiniteProducts(search, category);
  const detail = useProduct(selectedId);
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const remove = useDeleteProduct();
  const toggle = useToggleStock();
  const visible =
    mode === "pages" ?
      (list.data?.items ?? [])
    : (infinite.data?.pages.flatMap((p) => p.items) ?? []);
  const active = mode === "pages" ? list : infinite;
  const pending = create.isPending || update.isPending;
  function save(input: ProductInput) {
    const action =
      editing ?
        update.mutateAsync({ id: editing.id, data: input })
      : create.mutateAsync(input);
    void action
      .then(() => {
        setShowForm(false);
        setEditing(null);
        setMessage("محصول ذخیره شد");
      })
      .catch((e) => setMessage(`خطا: ${(e as Error).message}`));
  }
  function del(product: Product) {
    if (!window.confirm(`محصول «${product.title}» حذف شود؟`)) return;
    remove.mutate(product.id, {
      onSuccess: () => {
        if (selectedId === product.id) setSelectedId(0);
        setMessage("محصول حذف شد");
      },
      onError: (e) => setMessage(e.message),
    });
  }
  return (
    <main className="container">
      <header>
        <div>
          <div className="eyebrow">React + TypeScript + TanStack Query</div>
          <h1>آزمایشگاه React Query</h1>
          <p>
            CRUD، جستجو، صفحه‌بندی، Infinite Query، Prefetch و Optimistic
            Updates
          </p>
        </div>
        <span className="pill">
          {fetching ? `${fetching} درخواست فعال` : "کش آماده است"}
        </span>
      </header>
      <section className="toolbar">
        <input
          aria-label="جستجوی محصول"
          placeholder="جستجوی محصول..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <select
          aria-label="دسته‌بندی"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}>
          <option value="">همه دسته‌ها</option>
          <option>Electronics</option>
          <option>Books</option>
          <option>Clothing</option>
          <option>General</option>
        </select>
        <button
          className="secondary"
          onClick={() => setMode(mode === "pages" ? "infinite" : "pages")}>
          {mode === "pages" ? "حالت Infinite Scroll" : "حالت Pagination"}
        </button>
        <button
          className="secondary"
          onClick={() =>
            void client.invalidateQueries({ queryKey: productKeys.all })
          }>
          تازه‌سازی کش
        </button>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}>
          + محصول جدید
        </button>
      </section>
      {message && (
        <div className="notice" role="status">
          {message}
          <button className="text" onClick={() => setMessage("")}>
            ×
          </button>
        </div>
      )}
      {showForm && (
        <ProductForm
          product={editing}
          onSave={save}
          busy={pending}
          onCancel={() => setShowForm(false)}
        />
      )}
      {active.isPending ?
        <div className="state">در حال بارگذاری اولیه...</div>
      : active.isError ?
        <div className="state error">
          خطا: {active.error.message}{" "}
          <button onClick={() => void active.refetch()}>تلاش مجدد</button>
        </div>
      : <>
          <div className="meta">
            {mode === "pages" ?
              `تعداد کل: ${list.data?.total ?? 0}`
            : `تعداد بارگذاری‌شده: ${visible.length}`}{" "}
            {active.isFetching &&
              !active.isPending &&
              " · در حال به‌روزرسانی..."}
          </div>
          <div className="grid">
            {visible.map((product) => (
              <article
                className="card"
                key={product.id}
                onMouseEnter={() =>
                  void client.prefetchQuery(productDetailOptions(product.id))
                }>
                <div className="top">
                  <span className="tag">{product.category}</span>
                  <span>#{product.id}</span>
                </div>
                <h3>{product.title}</h3>
                <p>{product.description || "بدون توضیحات"}</p>
                <div className="stats">
                  <strong>{product.price.toLocaleString("fa-IR")} واحد</strong>
                  <span>موجودی: {product.stock}</span>
                </div>
                <div className="actions">
                  <button
                    className="secondary"
                    onClick={() => setSelectedId(product.id)}>
                    جزئیات
                  </button>
                  <button
                    className="secondary"
                    onClick={() => {
                      setEditing(product);
                      setShowForm(true);
                    }}>
                    ویرایش
                  </button>
                  <button
                    className="secondary"
                    disabled={toggle.isPending}
                    onClick={() =>
                      toggle.mutate(
                        { product, stock: product.stock + 1 },
                        { onError: (e) => setMessage(e.message) },
                      )
                    }>
                    + موجودی
                  </button>
                  <button
                    className="danger"
                    disabled={remove.isPending}
                    onClick={() => del(product)}>
                    حذف
                  </button>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && <div className="state">محصولی یافت نشد.</div>}
          {mode === "pages" ?
            <div className="pagination">
              <button
                className="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}>
                قبلی
              </button>
              <span>
                صفحه {page} از {list.data?.totalPages ?? 1}
              </span>
              <button
                className="secondary"
                disabled={page >= (list.data?.totalPages ?? 1)}
                onClick={() => setPage((p) => p + 1)}>
                بعدی
              </button>
            </div>
          : <div className="pagination">
              <button
                disabled={!infinite.hasNextPage || infinite.isFetchingNextPage}
                onClick={() => void infinite.fetchNextPage()}>
                {infinite.isFetchingNextPage ?
                  "در حال دریافت..."
                : infinite.hasNextPage ?
                  "بارگذاری بیشتر"
                : "پایان محصولات"}
              </button>
            </div>
          }
        </>
      }
      {selectedId > 0 && (
        <div className="overlay" onClick={() => setSelectedId(0)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <button className="secondary" onClick={() => setSelectedId(0)}>
              بستن ×
            </button>
            {detail.isPending ?
              <p>در حال بارگذاری...</p>
            : detail.isError ?
              <p>{detail.error.message}</p>
            : <>
                <h2>{detail.data.title}</h2>
                <p>{detail.data.description}</p>
                <p>دسته: {detail.data.category}</p>
                <p>قیمت: {detail.data.price}</p>
                <p>موجودی: {detail.data.stock}</p>
              </>
            }
          </aside>
        </div>
      )}
      <footer>
        Devtools را از گوشه صفحه باز کن و وضعیت Queryها و Cache را مشاهده کن.
      </footer>
    </main>
  );
}
