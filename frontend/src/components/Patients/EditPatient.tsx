
import { X } from 'lucide-react';

interface Patient {
  id: number;
  citizenId: string;
  status?: string;
  allergy?: string;
  latestTestName?: string;
}

interface EditPatientProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSuccess: () => void; // Thêm prop này để làm mới danh sách sau khi lưu
}

export const EditPatientModal = ({ isOpen, onClose, patient, onSuccess }: EditPatientProps) => {
  // Bạn có thể dùng state để lưu giá trị input nếu muốn kiểm soát form chặt chẽ hơn
  
  if (!isOpen) return null;

  const handleSave = async () => {
    // 1. Thực hiện gọi API cập nhật tại đây:
    // await apiClient.put(`/patients/${patient.id}`, data);
    
    // 2. Sau khi thành công:
    onSuccess();
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
          <input className={inputStyle} defaultValue={patient.citizenId ?? ""} />
          
          <label className={labelStyle}>Trạng thái</label>
          <input className={inputStyle} defaultValue={patient.status ?? ""} />
          
          <label className={labelStyle}>Dị ứng</label>
          <input className={inputStyle} defaultValue={patient.allergy ?? ""} />
          
          <label className={labelStyle}>Xét nghiệm gần nhất</label>
          <input className={inputStyle} defaultValue={patient.latestTestName ?? ""} />
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