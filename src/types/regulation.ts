export interface Regulation {
  id: string;
  title: string;
  agency: string;
  category: string;
  status: 'active' | 'proposed' | 'repealed' | 'amended';
  effectiveDate: string;
  lastUpdated: string;
  summary: string;
  jurisdiction: string;
  referenceNumber: string;
  tags: string[];
}

export interface SearchFilters {
  query: string;
  agency: string;
  category: string;
  status: string;
  jurisdiction: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'relevance' | 'date' | 'title';
  sortOrder: 'asc' | 'desc';
}

export const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  agency: '',
  category: '',
  status: '',
  jurisdiction: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'relevance',
  sortOrder: 'desc',
};
