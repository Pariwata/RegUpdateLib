import { HearingItem } from '../types/regulation';

export const mockHearings: HearingItem[] = [
  {
    id: 'h1',
    regulationId: '10',
    title: 'ร่างหลักเกณฑ์การประกอบธุรกิจสินเชื่อดิจิทัล (Digital Lending)',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    hearingStartDate: '2026-03-01',
    hearingEndDate: '2026-04-30',
    status: 'เปิดรับฟัง',
    participationUrl: '#',
    summary:
      'เปิดรับฟังความคิดเห็นร่างหลักเกณฑ์การประกอบธุรกิจ Digital Lending ประเด็นสำคัญ: เงื่อนไขใบอนุญาต การใช้ AI/ML ในการพิจารณาสินเชื่อ และการคุ้มครองผู้บริโภค',
    category: 'การกำกับดูแลธนาคาร',
  },
  {
    id: 'h2',
    regulationId: '11',
    title: 'ร่างหลักเกณฑ์การดำเนินงานด้าน Open Banking',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    hearingStartDate: '2026-03-10',
    hearingEndDate: '2026-05-15',
    status: 'เปิดรับฟัง',
    participationUrl: '#',
    summary:
      'เปิดรับฟังความคิดเห็นร่างมาตรฐาน Open Banking API กำหนดประเภทข้อมูลที่ต้องเปิดเผย บทบาทของ Third-Party Provider และมาตรการรักษาความปลอดภัย',
    category: 'เทคโนโลยีสารสนเทศ',
  },
  {
    id: 'h3',
    regulationId: '19',
    title: 'ร่างแนวปฏิบัติด้าน Sustainable Finance',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    hearingStartDate: '2026-03-15',
    hearingEndDate: '2026-05-30',
    status: 'เปิดรับฟัง',
    participationUrl: '#',
    summary:
      'เปิดรับฟังความคิดเห็นร่างแนวปฏิบัติด้าน ESG สำหรับสถาบันการเงิน ครอบคลุม Climate Risk Assessment, Green Taxonomy และ ESG Disclosure',
    category: 'การกำกับดูแลธนาคาร',
  },
  {
    id: 'h4',
    regulationId: '15',
    title: 'ร่างหลักเกณฑ์การกำกับ Stablecoin',
    agency: 'สำนักงาน ก.ล.ต.',
    hearingStartDate: '2026-02-01',
    hearingEndDate: '2026-03-31',
    status: 'เปิดรับฟัง',
    participationUrl: '#',
    summary:
      'ร่างหลักเกณฑ์การกำกับ Stablecoin ที่อ้างอิงเงินบาท ประเด็นสำคัญ: สินทรัพย์สำรอง การตรวจสอบ และการใช้งานในระบบชำระเงิน',
    category: 'หลักทรัพย์และสินทรัพย์ดิจิทัล',
  },
  {
    id: 'h5',
    regulationId: '7',
    title: 'ร่างประกาศภาษีธุรกรรมทางอิเล็กทรอนิกส์',
    agency: 'กระทรวงการคลัง',
    hearingStartDate: '2026-01-15',
    hearingEndDate: '2026-03-15',
    status: 'ปิดรับฟัง',
    participationUrl: '#',
    summary:
      'ปิดรับฟังความคิดเห็นแล้ว อยู่ระหว่างรวบรวมและสรุปผลความคิดเห็น มีผู้ส่งความคิดเห็น 245 ราย จาก 58 องค์กร',
    category: 'การเงินการคลัง',
  },
  {
    id: 'h6',
    regulationId: '3',
    title: 'ร่างแก้ไขหลักเกณฑ์ Responsible Lending (เพิ่มเกณฑ์ DSR)',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    hearingStartDate: '2025-11-01',
    hearingEndDate: '2025-12-31',
    status: 'สรุปผล',
    participationUrl: '#',
    summary:
      'สรุปผลการรับฟังความคิดเห็นเรียบร้อยแล้ว มีผู้ส่งความคิดเห็น 312 ราย ธปท. ได้ปรับปรุงร่างตามข้อเสนอแนะ และออกประกาศบังคับใช้แล้ว',
    category: 'การคุ้มครองผู้บริโภค',
  },
  {
    id: 'h7',
    regulationId: '9',
    title: 'ร่างแนวปฏิบัติ e-KYC (ก่อนประกาศบังคับใช้)',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    hearingStartDate: '2024-10-01',
    hearingEndDate: '2024-12-15',
    status: 'สรุปผล',
    participationUrl: '#',
    summary:
      'สรุปผลการรับฟังความคิดเห็นแล้ว มีผู้ส่งความคิดเห็น 189 ราย ปรับปรุงเกณฑ์ Biometric และมาตรฐานการเชื่อมต่อฐานข้อมูลภาครัฐ ออกประกาศบังคับใช้แล้ว',
    category: 'การป้องกันการฟอกเงิน',
  },
];

export const hearingAgencies = Array.from(
  new Set(mockHearings.map((h) => h.agency))
).sort();

export const hearingStatuses: Array<{ value: string; label: string }> = [
  { value: 'เปิดรับฟัง', label: 'เปิดรับฟัง' },
  { value: 'ปิดรับฟัง', label: 'ปิดรับฟัง' },
  { value: 'สรุปผล', label: 'สรุปผล' },
];
