import { AlertTriangle } from 'lucide-react'

interface Props {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-red-600">
      <AlertTriangle className="w-8 h-8 mb-3" />
      <p className="text-sm font-medium mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
