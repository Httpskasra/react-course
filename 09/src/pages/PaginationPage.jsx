import ProductCard from '../components/ProductCard'
import { products } from '../data'

export default function PaginationPage() {
  return (
    <section className="space-y-6">
      <PageHeading
        title="Pagination"
        description="فعلاً همه چیز استاتیک است. قرار است بعداً pagination واقعی، state و API را روی همین قالب اضافه کنیم."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row">
        <p className="text-sm text-slate-400">
          صفحه 1 از 5 — مجموع 40 محصول
        </p>

        <div className="flex gap-2">
          <button className="rounded-xl bg-white/10 px-4 py-2 opacity-40">
            قبلی
          </button>

          {[1, 2, 3, 4, 5].map((number) => (
            <button
              key={number}
              className={`h-10 w-10 rounded-xl ${
                number === 1
                  ? 'bg-white font-black text-slate-950'
                  : 'bg-white/10'
              }`}
            >
              {number}
            </button>
          ))}

          <button className="rounded-xl bg-white/10 px-4 py-2">
            بعدی
          </button>
        </div>
      </div>
    </section>
  )
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
  )
}
