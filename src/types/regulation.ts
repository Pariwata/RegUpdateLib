export interface Regulation {
  id: string;
  title: string;
  agency: string;
  category: string;
  status: 'บังคับใช้' | 'เสนอร่าง' | 'ยกเลิก' | 'แก้ไข' | 'รับฟังความคิดเห็น';
  effectiveDate: string;
  lastUpdated: string;
  summary: string;
  scope: string;
  referenceNumber: string;
  tags: string[];
}

export interface RegulationAlert {
  id: string;
  regulationId: string;
  title: string;
  agency: string;
  changeType: 'ใหม่' | 'แก้ไข' | 'ยกเลิก' | 'ปรับปรุง';
  changeDate: string;
  summary: string;
  impactLevel: 'สูง' | 'กลาง' | 'ต่ำ';
  isRead: boolean;
  referenceNumber: string;
}

export interface HearingItem {
  id: string;
  regulationId: string;
  title: string;
  agency: string;
  hearingStartDate: string;
  hearingEndDate: string;
  status: 'เปิดรับฟัง' | 'ปิดรับฟัง' | 'สรุปผล';
  participationUrl: string;
  summary: string;
  category: string;
}

export interface SearchFilters {
  query: string;
  agency: string;
  category: string;
  status: string;
  scope: string;
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
  scope: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'relevance',
  sortOrder: 'desc',
};
