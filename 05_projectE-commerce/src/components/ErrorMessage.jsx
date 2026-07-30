import { AlertTriangle } from 'lucide-react'

export default function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
      <div className="rounded-full bg-red-100 p-3 text-red-600">
        <AlertTriangle size={28} />
      </div>
      <div>
        <h3 className="font-semibold text-red-900">Error</h3>
        <p className="mt-1 text-sm text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary border-red-200 text-red-700 hover:bg-red-100">
          Try again
        </button>
      )}
    </div>
  )
}
