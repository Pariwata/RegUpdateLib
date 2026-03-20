export interface Regulation {
  id: string;
  title: string;
  agency: string;
  category: string;
  status: 'proposed' | 'final' | 'effective' | 'withdrawn';
  publishDate: string;
  effectiveDate?: string;
  summary: string;
  documentUrl?: string;
  federalRegisterNumber?: string;
  docketId?: string;
}

export interface SearchFilters {
  query: string;
  agency?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
}

export interface SearchResult {
  items: Regulation[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MonitorRule {
  id: string;
  name: string;
  description?: string;
  query: string;
  agencies: string[];
  categories: string[];
  enabled: boolean;
  createdAt: string;
  lastTriggered?: string;
  matchCount: number;
}

export interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  regulation: Regulation;
  triggeredAt: string;
  read: boolean;
}

export interface ExtractionRequest {
  documentUrl?: string;
  documentText?: string;
  regulationId?: string;
  extractionTypes: ExtractionType[];
}

export type ExtractionType =
  | 'requirements'
  | 'deadlines'
  | 'affected_entities'
  | 'penalties'
  | 'definitions'
  | 'summary';

export interface ExtractionResult {
  id: string;
  regulationId?: string;
  regulationTitle?: string;
  extractedAt: string;
  sections: ExtractionSection[];
}

export interface ExtractionSection {
  type: ExtractionType;
  title: string;
  items: ExtractionItem[];
}

export interface ExtractionItem {
  text: string;
  reference?: string;
  confidence: number;
  metadata?: Record<string, string>;
}

export interface DashboardStats {
  totalRegulations: number;
  newThisWeek: number;
  activeMonitors: number;
  unresolvedAlerts: number;
  recentExtractions: number;
}
