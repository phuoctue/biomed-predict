import { useState } from "react";
import { User, Activity, ChevronDown } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  summary: string;
}

interface PatientInfoProps {
  patients: Patient[]; // Danh sách bệnh nhân truyền vào
  selectedPatient: Patient;
  onSelect: (patient: Patient) => void;
}

export const PatientInfo = ({ patients, selectedPatient, onSelect }: PatientInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 relative">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Chọn bệnh nhân</h3>

      {/* Nút kích hoạt Dropdown */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-300 transition-all flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><User size={20} /></div>
          <div>
            <p className="font-bold text-slate-800">{selectedPatient.name}</p>
            <p className="text-xs text-slate-500 font-medium">ID: {selectedPatient.id}</p>
          </div>
        </div>
        <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Danh sách sổ xuống */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {patients.map((p) => (
            <div 
              key={p.id}
              onClick={() => { onSelect(p); setIsOpen(false); }}
              className="p-4 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0"
            >
              <p className="font-bold text-slate-800 text-sm">{p.name}</p>
              <p className="text-[10px] text-slate-400">ID: {p.id}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tóm tắt */}
      <div className="flex gap-2 items-start text-slate-600">
        <Activity size={16} className="mt-0.5 shrink-0" />
        <p className="text-sm font-medium">{selectedPatient.summary}</p>
      </div>
    </div>
  );
};