import { useState, useEffect } from 'react'
import {
  Bell,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CheckCheck,
  Clock,
  X,
} from 'lucide-react'
import {
  getMonitorRules,
  createMonitorRule,
  updateMonitorRule,
  deleteMonitorRule,
  getAlerts,
  markAlertRead,
  markAllAlertsRead,
} from '../services/api'
import type { MonitorRule, Alert } from '../types'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Monitoring() {
  const [tab, setTab] = useState<'rules' | 'alerts'>('rules')
  const [rules, setRules] = useState<MonitorRule[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    Promise.all([getMonitorRules(), getAlerts()])
      .then(([r, a]) => { setRules(r); setAlerts(a) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleToggle = async (rule: MonitorRule) => {
    try {
      const updated = await updateMonitorRule(rule.id, { enabled: !rule.enabled })
      setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    } catch { /* swallow */ }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMonitorRule(id)
      setRules((prev) => prev.filter((r) => r.id !== id))
    } catch { /* swallow */ }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await markAlertRead(id)
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
    } catch { /* swallow */ }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAlertsRead()
      setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
    } catch { /* swallow */ }
  }

  const unreadCount = alerts.filter((a) => !a.read).length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Monitoring</h1>
          <p className="text-sm text-gray-500 mt-1">Track regulatory changes and receive alerts</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Monitor
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setTab('rules')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'rules' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Monitor Rules ({rules.length})
        </button>
        <button
          onClick={() => setTab('alerts')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            tab === 'alerts' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Alerts
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      {!loading && !error && tab === 'rules' && (
        <div className="space-y-3">
          {rules.length === 0 ? (
            <EmptyState
              icon={<Bell className="w-12 h-12" />}
              title="No monitoring rules"
              description="Create a monitor to track regulatory changes automatically"
            />
          ) : (
            rules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                onToggle={() => handleToggle(rule)}
                onDelete={() => handleDelete(rule.id)}
              />
            ))
          )}
        </div>
      )}

      {!loading && !error && tab === 'alerts' && (
        <>
          {unreadCount > 0 && (
            <div className="flex justify-end mb-3">
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            </div>
          )}
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <EmptyState
                icon={<Bell className="w-12 h-12" />}
                title="No alerts"
                description="Alerts will appear here when your monitors detect changes"
              />
            ) : (
              alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onMarkRead={() => handleMarkRead(alert.id)} />
              ))
            )}
          </div>
        </>
      )}

      {/* Create rule modal */}
      {showCreate && (
        <CreateRuleModal
          onClose={() => setShowCreate(false)}
          onCreate={async (data) => {
            const rule = await createMonitorRule(data)
            setRules((prev) => [rule, ...prev])
            setShowCreate(false)
          }}
        />
      )}
    </div>
  )
}

function RuleCard({
  rule,
  onToggle,
  onDelete,
}: {
  rule: MonitorRule
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <div className={`bg-white border rounded-lg p-5 ${rule.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900">{rule.name}</h3>
            {rule.matchCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {rule.matchCount} matches
              </span>
            )}
          </div>
          {rule.description && <p className="text-sm text-gray-500 mb-2">{rule.description}</p>}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>Query: "{rule.query}"</span>
            {rule.agencies.length > 0 && <span>Agencies: {rule.agencies.join(', ')}</span>}
            {rule.lastTriggered && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last: {new Date(rule.lastTriggered).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggle} className="p-1.5 text-gray-400 hover:text-gray-600">
            {rule.enabled ? <ToggleRight className="w-6 h-6 text-blue-600" /> : <ToggleLeft className="w-6 h-6" />}
          </button>
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AlertCard({ alert, onMarkRead }: { alert: Alert; onMarkRead: () => void }) {
  return (
    <div className={`bg-white border rounded-lg p-5 ${alert.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {!alert.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
            <span className="text-xs text-gray-400">{alert.ruleName}</span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-400">{new Date(alert.triggeredAt).toLocaleString()}</span>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">{alert.regulation.title}</h3>
          <div className="flex items-center gap-2">
            <StatusBadge status={alert.regulation.status} />
            <span className="text-xs text-gray-400">{alert.regulation.agency}</span>
          </div>
        </div>
        {!alert.read && (
          <button onClick={onMarkRead} className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap">
            Mark read
          </button>
        )}
      </div>
    </div>
  )
}

function CreateRuleModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (data: Omit<MonitorRule, 'id' | 'createdAt' | 'matchCount'>) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [query, setQuery] = useState('')
  const [agenciesInput, setAgenciesInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !query.trim()) return
    setSubmitting(true)
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim() || undefined,
        query: query.trim(),
        agencies: agenciesInput.split(',').map((s) => s.trim()).filter(Boolean),
        categories: [],
        enabled: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create Monitor Rule</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., FDA Drug Approvals"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Query *</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Keywords to monitor for"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agencies (comma-separated)</label>
            <input
              type="text"
              value={agenciesInput}
              onChange={(e) => setAgenciesInput(e.target.value)}
              placeholder="e.g., FDA, SEC, EPA"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim() || !query.trim()}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Monitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="mx-auto mb-4">{icon}</div>
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm mt-1">{description}</p>
    </div>
  )
}
