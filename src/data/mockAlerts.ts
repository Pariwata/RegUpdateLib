import { RegulationAlert } from '../types/regulation';

export const mockAlerts: RegulationAlert[] = [
  {
    id: 'a1',
    regulationId: '16',
    title: 'แก้ไขมาตรการ LTV สินเชื่อที่อยู่อาศัย - ผ่อนคลายเพดานสัญญากู้ที่ 2',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    changeType: 'แก้ไข',
    changeDate: '2026-02-28',
    summary:
      'ปรับเพดาน LTV สำหรับสัญญากู้ที่ 2 จาก 80% เป็น 90% สำหรับที่อยู่อาศัยราคาไม่เกิน 10 ล้านบาท มีผลบังคับใช้ทันที',
    impactLevel: 'สูง',
    isRead: false,
    referenceNumber: 'ธปท.สกส. 1/2568',
  },
  {
    id: 'a2',
    regulationId: '10',
    title: 'เปิดรับฟังความคิดเห็นร่างหลักเกณฑ์ Digital Lending',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    changeType: 'ใหม่',
    changeDate: '2026-03-15',
    summary:
      'ธปท. เผยแพร่ร่างหลักเกณฑ์การประกอบธุรกิจสินเชื่อดิจิทัล เปิดรับฟังความคิดเห็นถึง 30 เมษายน 2569 มีประเด็นสำคัญเรื่องการใช้ AI ในการพิจารณาสินเชื่อ',
    impactLevel: 'สูง',
    isRead: false,
    referenceNumber: 'ธปท.สกส. 10/2569',
  },
  {
    id: 'a3',
    regulationId: '11',
    title: 'เปิดรับฟังความคิดเห็นร่างหลักเกณฑ์ Open Banking',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    changeType: 'ใหม่',
    changeDate: '2026-03-10',
    summary:
      'ธปท. เผยแพร่ร่างหลักเกณฑ์ Open Banking กำหนดมาตรฐาน API และกรอบการเปิดเผยข้อมูลลูกค้า เปิดรับฟังความคิดเห็นถึง 15 พฤษภาคม 2569',
    impactLevel: 'สูง',
    isRead: true,
    referenceNumber: 'ธปท.สนส. 22/2569',
  },
  {
    id: 'a4',
    regulationId: '8',
    title: 'แก้ไขหลักเกณฑ์การกันสำรอง TFRS 9 - ปรับเกณฑ์ Forward-looking',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    changeType: 'แก้ไข',
    changeDate: '2025-10-20',
    summary:
      'ปรับแก้วิธีการคำนวณ ECL โดยเพิ่มความยืดหยุ่นในการใช้ Macroeconomic Scenarios และปรับ Probability of Default สำหรับ SME',
    impactLevel: 'กลาง',
    isRead: true,
    referenceNumber: 'ธปท.สนส. 8/2567',
  },
  {
    id: 'a5',
    regulationId: '4',
    title: 'แก้ไขหลักเกณฑ์การออกและเสนอขายสินทรัพย์ดิจิทัล',
    agency: 'สำนักงาน ก.ล.ต.',
    changeType: 'แก้ไข',
    changeDate: '2026-01-05',
    summary:
      'ปรับปรุงเกณฑ์คุณสมบัติผู้ออกโทเคนดิจิทัลและเพิ่มข้อกำหนดด้าน Smart Contract Audit',
    impactLevel: 'กลาง',
    isRead: false,
    referenceNumber: 'กลต.นจ. 42/2567',
  },
  {
    id: 'a6',
    regulationId: '19',
    title: 'เปิดรับฟังความคิดเห็นแนวปฏิบัติด้าน Sustainable Finance',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    changeType: 'ใหม่',
    changeDate: '2026-03-20',
    summary:
      'ธปท. เปิดรับฟังความคิดเห็นร่างแนวปฏิบัติด้าน ESG สำหรับสถาบันการเงิน ครอบคลุมการประเมินความเสี่ยง Climate Risk และ Social Risk',
    impactLevel: 'กลาง',
    isRead: false,
    referenceNumber: 'ธปท.สนส. 25/2569',
  },
  {
    id: 'a7',
    regulationId: '18',
    title: 'ยกเลิกหลักเกณฑ์ AML ธุรกรรมข้ามแดนฉบับเดิม',
    agency: 'สำนักงาน ปปง.',
    changeType: 'ยกเลิก',
    changeDate: '2025-06-30',
    summary:
      'ยกเลิกหลักเกณฑ์ฉบับ พ.ศ. 2563 และแทนที่ด้วยหลักเกณฑ์ใหม่ที่ครอบคลุมธุรกรรม Digital Asset ข้ามแดน',
    impactLevel: 'ต่ำ',
    isRead: true,
    referenceNumber: 'ปปง. 3/2563',
  },
  {
    id: 'a8',
    regulationId: '15',
    title: 'ก.ล.ต. เสนอร่างหลักเกณฑ์กำกับ Stablecoin',
    agency: 'สำนักงาน ก.ล.ต.',
    changeType: 'ใหม่',
    changeDate: '2026-03-05',
    summary:
      'ร่างหลักเกณฑ์ใหม่สำหรับการกำกับ Stablecoin ที่อ้างอิงเงินบาท กำหนดสินทรัพย์สำรองและเงื่อนไขการออก',
    impactLevel: 'กลาง',
    isRead: false,
    referenceNumber: 'กลต.นจ. 18/2569',
  },
  {
    id: 'a9',
    regulationId: '20',
    title: 'ปรับปรุงมาตรฐานความปลอดภัยระบบชำระเงิน - เพิ่มเกณฑ์ Fraud Detection',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    changeType: 'ปรับปรุง',
    changeDate: '2026-02-05',
    summary:
      'เพิ่มข้อกำหนดเรื่อง Real-time Fraud Detection และ Transaction Monitoring สำหรับ Mobile Banking และ QR Payment',
    impactLevel: 'สูง',
    isRead: true,
    referenceNumber: 'ธปท.ฝชส. 12/2568',
  },
  {
    id: 'a10',
    regulationId: '3',
    title: 'ปรับปรุงหลักเกณฑ์ Responsible Lending - เพิ่มเกณฑ์ DSR',
    agency: 'ธนาคารแห่งประเทศไทย (ธปท.)',
    changeType: 'ปรับปรุง',
    changeDate: '2026-02-10',
    summary:
      'เพิ่มเกณฑ์ Debt Service Ratio (DSR) สำหรับสินเชื่อส่วนบุคคลและบัตรเครดิต เพื่อป้องกันการก่อหนี้เกินตัว',
    impactLevel: 'สูง',
    isRead: false,
    referenceNumber: 'ธปท.สกส. 3/2568',
  },
];

export const alertAgencies = Array.from(
  new Set(mockAlerts.map((a) => a.agency))
).sort();

export const changeTypes: Array<{ value: string; label: string }> = [
  { value: 'ใหม่', label: 'ใหม่' },
  { value: 'แก้ไข', label: 'แก้ไข' },
  { value: 'ยกเลิก', label: 'ยกเลิก' },
  { value: 'ปรับปรุง', label: 'ปรับปรุง' },
];

export const impactLevels: Array<{ value: string; label: string }> = [
  { value: 'สูง', label: 'สูง' },
  { value: 'กลาง', label: 'กลาง' },
  { value: 'ต่ำ', label: 'ต่ำ' },
];
