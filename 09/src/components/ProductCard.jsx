export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:bg-white/[0.07]">
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-6xl">
        {product.emoji}
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-black text-white">{product.title}</h2>
            <p className="mt-1 text-xs text-slate-400">{product.category}</p>
          </div>

          <span className="rounded-lg bg-amber-400/10 px-2 py-1 text-xs font-bold text-amber-300">
            ★ {product.rating}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-400">
          {product.description}
        </p>

        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <strong>${product.price}</strong>

          <span
            className={`text-xs font-bold ${
              product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {product.stock > 0 ? `${product.stock} موجود` : 'ناموجود'}
          </span>
        </div>
      </div>
    </article>
  )
}
