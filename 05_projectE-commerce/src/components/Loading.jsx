export default function Loading({ text = 'Loading data...' }) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  )
}
