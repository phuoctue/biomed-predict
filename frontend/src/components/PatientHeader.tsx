import { User, AlertTriangle } from "lucide-react";

// Định nghĩa interface dựa trên cấu trúc dữ liệu của bạn
interface PatientProps {
  patient: {
    name: string;
    diagnosis: string;
    allergy: string;
  };
}

export const PatientHeader = ({ patient }: PatientProps) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl border border-slate-200">
        <User className="h-6 w-6 text-slate-500" />
      </div>
      <div>
        <h2 className="text-lg font-black text-slate-900">{patient.name}</h2>
        <div className="mt-2 text-xs font-semibold">
          <p className="text-slate-400">CHẨN ĐOÁN: <span className="text-slate-800">{patient.diagnosis}</span></p>
        </div>
      </div>
    </div>
    <div className="bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
      <AlertTriangle className="h-3.5 w-3.5" /> DỊ ỨNG: {patient.allergy}
    </div>
  </div>
);