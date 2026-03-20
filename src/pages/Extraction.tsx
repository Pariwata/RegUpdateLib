import { useState, useEffect } from 'react'
import {
  FileText,
  Upload,
  Link as LinkIcon,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { extractFromDocument, getExtractionHistory } from '../services/api'
import type { ExtractionType, ExtractionResult, ExtractionSection } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const EXTRACTION_TYPES: { value: ExtractionType; label: string; description: string }[] = [
  { value: 'summary', label: 'Summary', description: 'High-level summary of the regulation' },
  { value: 'requirements', label: 'Requirements', description: 'Key compliance requirements' },
  { value: 'deadlines', label: 'Deadlines', description: 'Important dates and deadlines' },
  { value: 'affected_entities', label: 'Affected Entities', description: 'Organizations and entities impacted' },
  { value: 'penalties', label: 'Penalties', description: 'Penalties for non-compliance' },
  { value: 'definitions', label: 'Definitions', description: 'Key terms and definitions' },
]

export default function Extraction() {
  const [tab, setTab] = useState<'extract' | 'history'>('extract')
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url')
  const [documentUrl, setDocumentUrl] = useState('')
  const [documentText, setDocumentText] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<ExtractionType[]>(['summary', 'requirements', 'deadlines'])
  const [result, setResult] = useState<ExtractionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<ExtractionResult[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    setHistoryLoading(true)
    getExtractionHistory()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setHistoryLoading(false))
  }, [])

  const toggleType = (type: ExtractionType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTypes.length === 0) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await extractFromDocument({
        documentUrl: inputMode === 'url' ? documentUrl : undefined,
        documentText: inputMode === 'text' ? documentText : undefined,
        extractionTypes: selectedTypes,
      })
      setResult(res)
      setHistory((prev) => [res, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Document Extraction</h1>
        <p className="text-sm text-gray-500 mt-1">Extract structured information from regulatory documents</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setTab('extract')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'extract' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Extract
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          History ({history.length})
        </button>
      </div>

      {tab === 'extract' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input form */}
          <div>
            <form onSubmit={handleExtract} className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Document Source</h2>

              {/* Input mode toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                    inputMode === 'url' ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                    inputMode === 'text' ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Paste Text
                </button>
              </div>

              {inputMode === 'url' ? (
                <input
                  type="url"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  placeholder="https://example.gov/regulation-document.pdf"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste the regulatory document text here..."
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-5 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                />
              )}

              <h2 className="text-sm font-semibold text-gray-900 mb-3">Extract</h2>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {EXTRACTION_TYPES.map(({ value, label, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleType(value)}
                    className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                      selectedTypes.includes(value)
                        ? 'border-blue-300 bg-blue-50 text-blue-800'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium block">{label}</span>
                    <span className="text-xs opacity-70">{description}</span>
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || selectedTypes.length === 0 || (!documentUrl && !documentText)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Extracting...' : 'Extract Information'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div>
            {loading && <LoadingSpinner message="Extracting information..." />}
            {error && <ErrorMessage message={error} />}
            {result && !loading && <ExtractionResultView result={result} />}
            {!result && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FileText className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Extraction results</p>
                <p className="text-sm mt-1">Results will appear here after extraction</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-4">
          {historyLoading && <LoadingSpinner />}
          {history.length === 0 && !historyLoading && (
            <div className="text-center py-16 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No extraction history</p>
              <p className="text-sm mt-1">Previous extractions will appear here</p>
            </div>
          )}
          {history.map((h) => (
            <HistoryCard key={h.id} result={h} />
          ))}
        </div>
      )}
    </div>
  )
}

function ExtractionResultView({ result }: { result: ExtractionResult }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900">Extraction Complete</span>
        </div>
        {result.regulationTitle && (
          <p className="text-sm text-gray-500">{result.regulationTitle}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {new Date(result.extractedAt).toLocaleString()} | {result.sections.length} sections
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {result.sections.map((section, i) => (
          <SectionView key={i} section={section} />
        ))}
      </div>
    </div>
  )
}

function SectionView({ section }: { section: ExtractionSection }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        <span className="text-sm font-medium text-gray-900 capitalize">{section.title}</span>
        <span className="text-xs text-gray-400 ml-auto">{section.items.length} items</span>
      </button>
      {expanded && (
        <div className="px-5 pb-4 space-y-2">
          {section.items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-800">{item.text}</p>
                {item.reference && (
                  <p className="text-xs text-gray-400 mt-1">Ref: {item.reference}</p>
                )}
              </div>
              <span
                className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                  item.confidence >= 0.8
                    ? 'bg-green-100 text-green-700'
                    : item.confidence >= 0.5
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {Math.round(item.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function HistoryCard({ result }: { result: ExtractionResult }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <FileText className="w-5 h-5 text-gray-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {result.regulationTitle || `Extraction ${result.id}`}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(result.extractedAt).toLocaleString()} | {result.sections.length} sections
          </p>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && (
        <div className="border-t border-gray-100">
          <ExtractionResultView result={result} />
        </div>
      )}
    </div>
  )
}
