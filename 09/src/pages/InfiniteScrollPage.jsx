import ProductCard from '../components/ProductCard'
import { products } from '../data'

export default function InfiniteScrollPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-violet-400">
          Starter Template
        </p>

        <h2 className="text-3xl font-black">Infinite Scroll</h2>

        <p className="mt-2 text-slate-400">
          فعلاً فقط UI آماده است. بعداً useRef، useEffect،
          IntersectionObserver و loadMore را روی همین صفحه پیاده می‌کنیم.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <span className="rounded-lg bg-white/5 px-3 py-2">
          تعداد آیتم‌های دریافت‌شده:
          <strong className="mr-1 text-white">8</strong>
        </span>

        <span className="rounded-lg bg-white/5 px-3 py-2">
          صفحه‌ی بعدی:
          <strong className="mr-1 text-white">2</strong>
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="h-12 w-full rounded-xl border border-dashed border-white/10" />

      <p className="text-center text-sm text-slate-500">
        این قسمت بعداً sentinel مربوط به Infinite Scroll خواهد شد.
      </p>
    </section>
  )
}
