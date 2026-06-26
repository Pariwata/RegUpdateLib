import React from 'react';

export const PageSignature: React.FC = () => {
  return (
    <footer className="page-signature">
      <div className="signature-content">
        <div className="signature-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="signature-icon">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9v.01" />
            <path d="M9 12v.01" />
            <path d="M9 15v.01" />
            <path d="M9 18v.01" />
          </svg>
          <span className="signature-title">ระบบค้นหากฎเกณฑ์ธนาคาร</span>
        </div>
        <div className="signature-info">
          <span>ฝ่ายกำกับดูแลการปฏิบัติงาน (Compliance Department)</span>
          <span className="signature-separator">|</span>
          <span>ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="signature-disclaimer">
          ข้อมูลในระบบนี้จัดทำขึ้นเพื่อใช้อ้างอิงภายในองค์กรเท่านั้น กรุณาตรวจสอบกับประกาศต้นฉบับจากหน่วยงานกำกับดูแลก่อนนำไปใช้งาน
        </div>
      </div>
    </footer>
  );
};
