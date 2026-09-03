export function Loading({ text = 'در حال دریافت اطلاعات...' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
      {text}
    </div>
  )
}

export function ErrorBox({ message }) {
  return (
    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-200">
      {message}
    </div>
  )
}

export function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-400">
      نتیجه‌ای پیدا نشد.
    </div>
  )
}
