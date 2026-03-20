import type {
  SearchFilters,
  SearchResult,
  MonitorRule,
  Alert,
  ExtractionRequest,
  ExtractionResult,
  DashboardStats,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

// ── Search ──────────────────────────────────────────────────
export function searchRegulations(filters: SearchFilters): Promise<SearchResult> {
  const params = new URLSearchParams();
  params.set('q', filters.query);
  if (filters.agency) params.set('agency', filters.agency);
  if (filters.category) params.set('category', filters.category);
  if (filters.status) params.set('status', filters.status);
  if (filters.dateFrom) params.set('date_from', filters.dateFrom);
  if (filters.dateTo) params.set('date_to', filters.dateTo);
  params.set('page', String(filters.page));
  params.set('page_size', String(filters.pageSize));
  return request<SearchResult>(`/regulations/search?${params}`);
}

export function getAgencies(): Promise<string[]> {
  return request<string[]>('/regulations/agencies');
}

export function getCategories(): Promise<string[]> {
  return request<string[]>('/regulations/categories');
}

// ── Monitoring ──────────────────────────────────────────────
export function getMonitorRules(): Promise<MonitorRule[]> {
  return request<MonitorRule[]>('/monitors');
}

export function createMonitorRule(rule: Omit<MonitorRule, 'id' | 'createdAt' | 'matchCount'>): Promise<MonitorRule> {
  return request<MonitorRule>('/monitors', {
    method: 'POST',
    body: JSON.stringify(rule),
  });
}

export function updateMonitorRule(id: string, rule: Partial<MonitorRule>): Promise<MonitorRule> {
  return request<MonitorRule>(`/monitors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(rule),
  });
}

export function deleteMonitorRule(id: string): Promise<void> {
  return request<void>(`/monitors/${id}`, { method: 'DELETE' });
}

export function getAlerts(unreadOnly?: boolean): Promise<Alert[]> {
  const params = unreadOnly ? '?unread=true' : '';
  return request<Alert[]>(`/alerts${params}`);
}

export function markAlertRead(id: string): Promise<void> {
  return request<void>(`/alerts/${id}/read`, { method: 'POST' });
}

export function markAllAlertsRead(): Promise<void> {
  return request<void>('/alerts/read-all', { method: 'POST' });
}

// ── Extraction ──────────────────────────────────────────────
export function extractFromDocument(req: ExtractionRequest): Promise<ExtractionResult> {
  return request<ExtractionResult>('/extractions', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export function getExtractionHistory(): Promise<ExtractionResult[]> {
  return request<ExtractionResult[]>('/extractions');
}

export function getExtraction(id: string): Promise<ExtractionResult> {
  return request<ExtractionResult>(`/extractions/${id}`);
}

// ── Dashboard ───────────────────────────────────────────────
export function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/dashboard/stats');
}
