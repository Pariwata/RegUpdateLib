import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Bell,
  FileText,
  TrendingUp,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { getDashboardStats } from '../services/api'
import type { DashboardStats } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = () => {
    setLoading(true)
    setError(null)
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchStats() }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Regulatory intelligence overview</p>
      </div>

      {loading && <LoadingSpinner message="Loading dashboard..." />}
      {error && <ErrorMessage message={error} onRetry={fetchStats} />}

      {stats && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
              label="Total Regulations"
              value={stats.totalRegulations}
              bg="bg-blue-50"
            />
            <StatCard
              icon={<Clock className="w-5 h-5 text-green-600" />}
              label="New This Week"
              value={stats.newThisWeek}
              bg="bg-green-50"
            />
            <StatCard
              icon={<Bell className="w-5 h-5 text-purple-600" />}
              label="Active Monitors"
              value={stats.activeMonitors}
              bg="bg-purple-50"
            />
            <StatCard
              icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
              label="Unresolved Alerts"
              value={stats.unresolvedAlerts}
              bg="bg-orange-50"
            />
          </div>

          {/* Quick actions */}
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction
              to="/search"
              icon={<Search className="w-6 h-6" />}
              title="Search Regulations"
              description="Full-text search across regulatory documents with advanced filters"
            />
            <QuickAction
              to="/monitoring"
              icon={<Bell className="w-6 h-6" />}
              title="Monitoring & Alerts"
              description="Set up watches on topics and receive notifications on changes"
            />
            <QuickAction
              to="/extraction"
              icon={<FileText className="w-6 h-6" />}
              title="Extract Information"
              description="Extract requirements, deadlines, and key entities from documents"
            />
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: number
  bg: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-3xl font-semibold text-gray-900">{value.toLocaleString()}</p>
    </div>
  )
}

function QuickAction({
  to,
  icon,
  title,
  description,
}: {
  to: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      to={to}
      className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <div className="text-blue-600 mb-3 group-hover:text-blue-700">{icon}</div>
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  )
}
