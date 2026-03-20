import { useState, useEffect, useCallback } from 'react'
import { Search as SearchIcon, Filter, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { searchRegulations, getAgencies, getCategories } from '../services/api'
import type { SearchFilters, SearchResult, Regulation } from '../types'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const STATUSES = ['proposed', 'final', 'effective', 'withdrawn']

export default function Search() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    page: 1,
    pageSize: 20,
  })
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agencies, setAgencies] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    getAgencies().then(setAgencies).catch(() => {})
    getCategories().then(setCategories).catch(() => {})
  }, [])

  const doSearch = useCallback((f: SearchFilters) => {
    if (!f.query.trim()) return
    setLoading(true)
    setError(null)
    searchRegulations(f)
      .then(setResult)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch({ ...filters, page: 1 })
  }

  const goToPage = (page: number) => {
    const updated = { ...filters, page }
    setFilters(updated)
    doSearch(updated)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Regulatory Search</h1>
        <p className="text-sm text-gray-500 mt-1">Search across regulatory documents and filings</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
              placeholder="Search regulations, rules, notices..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Agency</label>
            <select
              value={filters.agency || ''}
              onChange={(e) => setFilters((f) => ({ ...f, agency: e.target.value || undefined }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All agencies</option>
              {agencies.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value || undefined }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">From</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value || undefined }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">To</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value || undefined }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading && <LoadingSpinner message="Searching regulations..." />}
      {error && <ErrorMessage message={error} onRetry={() => doSearch(filters)} />}

      {result && !loading && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {result.total.toLocaleString()} result{result.total !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="space-y-3">
            {result.items.map((reg) => (
              <RegulationCard key={reg.id} regulation={reg} />
            ))}
          </div>

          {result.totalPages > 1 && (
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}

      {!result && !loading && !error && (
        <div className="text-center py-16 text-gray-400">
          <SearchIcon className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Search regulatory documents</p>
          <p className="text-sm mt-1">Enter a query above to get started</p>
        </div>
      )}
    </div>
  )
}

function RegulationCard({ regulation }: { regulation: Regulation }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <StatusBadge status={regulation.status} />
            <span className="text-xs text-gray-400">{regulation.agency}</span>
            {regulation.federalRegisterNumber && (
              <span className="text-xs text-gray-400">| {regulation.federalRegisterNumber}</span>
            )}
          </div>
          <h3 className="font-medium text-gray-900 mb-1 leading-snug">{regulation.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{regulation.summary}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>Published: {new Date(regulation.publishDate).toLocaleDateString()}</span>
            {regulation.effectiveDate && (
              <span>Effective: {new Date(regulation.effectiveDate).toLocaleDateString()}</span>
            )}
            {regulation.category && <span>{regulation.category}</span>}
          </div>
        </div>
        {regulation.documentUrl && (
          <a
            href={regulation.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Open document"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm text-gray-600 px-3">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
