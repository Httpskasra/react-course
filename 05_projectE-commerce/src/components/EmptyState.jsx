import { PackageOpen } from 'lucide-react'

export default function EmptyState({ title = 'No data found', description = 'There is nothing to show here yet.' }) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
      <div className="rounded-full bg-slate-100 p-4 text-slate-500">
        <PackageOpen size={36} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  )
}
