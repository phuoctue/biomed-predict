import React from "react";

interface ClinicalProps {
  eGFR: number;
  bloodPressure: string;
}

export const ClinicalIndicators = ({ eGFR, bloodPressure }: ClinicalProps) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
    <h3 className="text-sm font-bold text-slate-900 mb-3">Chỉ số lâm sàng</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 bg-slate-50 rounded-xl">
        <p className="text-[10px] text-slate-500 uppercase">eGFR</p>
        <p className="text-lg font-black text-slate-800">{eGFR} <span className="text-xs">mL/phút</span></p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl">
        <p className="text-[10px] text-slate-500 uppercase">Huyết áp</p>
        <p className="text-lg font-black text-slate-800">{bloodPressure} <span className="text-xs">mmHg</span></p>
      </div>
    </div>
  </div>
);