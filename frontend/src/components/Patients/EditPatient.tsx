import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

interface Patient {
  id: string;  // UUID
  fullName?: string;
  citizenId?: string;
  status?: string;
  allergy?: string;
  latestTestName?: string;
}

interface EditPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSuccess: () => void;
}

export const EditPatientModal = ({ isOpen, onClose, patient, onSuccess }: EditPatientProps) => {
  const citizenIdRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);
  const allergyRef = useRef<HTMLInputElement>(null);
  const latestTestNameRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await apiClient.put(`/patients/${patient.id}`, {
        mrn: citizenIdRef.current?.value,
        allergies: allergyRef.current?.value,
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Không thể cập nhật';
      alert(msg);
    }
  };

  // Style chung cho input để đồng bộ
  const inputStyle = "w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelStyle = "block text-xs font-bold text-slate-500 mt-3 mb-1";

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Sửa thông tin bệnh nhân</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-1">
          <label className={labelStyle}>Mã HS</label>
          <input ref={citizenIdRef} className={inputStyle} defaultValue={patient.citizenId ?? ""} />
          
          <label className={labelStyle}>Trạng thái</label>
          <input ref={statusRef} className={inputStyle} defaultValue={patient.status ?? ""} />
          
          <label className={labelStyle}>Dị ứng</label>
          <input ref={allergyRef} className={inputStyle} defaultValue={patient.allergy ?? ""} />
          
          <label className={labelStyle}>Xét nghiệm gần nhất</label>
          <input ref={latestTestNameRef} className={inputStyle} defaultValue={patient.latestTestName ?? ""} />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            Lưu thông tin
          </button>
        </div>
      </div>
    </div>
  );
};
