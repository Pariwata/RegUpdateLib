const statusColors: Record<string, string> = {
  proposed: 'bg-yellow-100 text-yellow-800',
  final: 'bg-blue-100 text-blue-800',
  effective: 'bg-green-100 text-green-800',
  withdrawn: 'bg-gray-100 text-gray-600',
}

export default function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
      {status}
    </span>
  )
}
