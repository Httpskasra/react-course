import { useEffect, useState, type FormEvent } from "react";
import type { Product, ProductInput } from "../types/product";
const EMPTY: ProductInput = {
  title: "",
  description: "",
  price: 100,
  category: "General",
  stock: 5,
};
export function ProductForm({
  product,
  onSave,
  busy,
  onCancel,
}: {
  product: Product | null;
  onSave: (input: ProductInput) => void;
  busy: boolean;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductInput>(EMPTY);
  useEffect(() => {
    setForm(
      product ?
        {
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
        }
      : EMPTY,
    );
  }, [product]);
  function submit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }
  return (
    <form onSubmit={submit} className="form">
      <h2>{product ? `ویرایش محصول #${product.id}` : "افزودن محصول جدید"}</h2>
      <label>
        نام محصول
        <input
          required
          maxLength={120}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </label>
      <label>
        توضیحات
        <textarea
          maxLength={500}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>
      <label>
        دسته‌بندی
        <input
          required
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </label>
      <div className="fields">
        <label>
          قیمت
          <input
            required
            min="0"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        </label>
        <label>
          موجودی
          <input
            required
            min="0"
            step="1"
            type="number"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />
        </label>
      </div>
      <div className="actions">
        <button disabled={busy} type="submit">
          {busy ? "در حال ذخیره..." : "ذخیره"}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          انصراف
        </button>
      </div>
    </form>
  );
}
