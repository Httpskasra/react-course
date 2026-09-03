import ProductCard from '../components/ProductCard'
import { products } from '../data'

export default function AdvancedSearchPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-emerald-400">
          Starter Template
        </p>

        <h2 className="text-3xl font-black">Advanced Search</h2>

        <p className="mt-2 text-slate-400">
          فعلاً فرم فقط ظاهر دارد. بعداً state، controlled inputs،
          debounce، useMemo و API را روی آن اضافه می‌کنیم.
        </p>
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-2 lg:grid-cols-4">
        <Field label="عبارت جست‌وجو" className="lg:col-span-2">
          <input
            placeholder="مثلاً React یا Monitor"
            className="control"
          />
        </Field>

        <Field label="دسته‌بندی">
          <select className="control" defaultValue="">
            <option value="">همه</option>
            <option>Books</option>
            <option>Electronics</option>
            <option>Accessories</option>
            <option>Office</option>
          </select>
        </Field>

        <Field label="مرتب‌سازی">
          <select className="control" defaultValue="title_asc">
            <option value="title_asc">نام: A → Z</option>
            <option value="price_asc">قیمت: کم به زیاد</option>
            <option value="price_desc">قیمت: زیاد به کم</option>
            <option value="rating_desc">بالاترین امتیاز</option>
          </select>
        </Field>

        <Field label="حداقل قیمت">
          <input type="number" min="0" className="control" />
        </Field>

        <Field label="حداکثر قیمت">
          <input type="number" min="0" className="control" />
        </Field>

        <Field label="حداقل امتیاز">
          <select className="control" defaultValue="">
            <option value="">مهم نیست</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </Field>

        <Field label="موجودی">
          <select className="control" defaultValue="">
            <option value="">همه</option>
            <option value="true">فقط موجود</option>
            <option value="false">فقط ناموجود</option>
          </select>
        </Field>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 lg:col-span-4">
          <p className="text-sm text-slate-400">8 نتیجه</p>

          <button className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15">
            پاک کردن فیلترها
          </button>
        </div>
      </div>

      <style>{`
        .control {
          width: 100%;
          border-radius: .75rem;
          border: 1px solid rgb(255 255 255 / .1);
          background: rgb(15 23 42);
          padding: .7rem .8rem;
          color: white;
        }
      `}</style>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`space-y-2 ${className}`}>
      <span className="block text-xs font-bold text-slate-400">
        {label}
      </span>

      {children}
    </label>
  )
}
