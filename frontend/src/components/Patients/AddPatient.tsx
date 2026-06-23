import React from 'react';
import { X } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPatientModal = ({ isOpen, onClose, onSuccess }: Props) => {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const raw = Object.fromEntries(formData.entries());
    try {
      await apiClient.post('/patients', {
        fullName: raw.fullName,
        mrn: raw.citizenId,      // form field "citizenId" maps to mrn
        sex: 'Unknown',
        allergies: raw.allergy || null,
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Không thể thêm bệnh nhân';
      alert(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Thêm bệnh nhân mới</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
              <input 
                name="fullName" 
                type="text" 
                required 
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Vui lòng nhập họ và tên!')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm" 
                placeholder="Nhập họ tên" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mã HS</label>
              <input 
                name="citizenId" 
                type="text" 
                required 
                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Vui lòng nhập mã hồ sơ!')}
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm" 
                placeholder="BN-..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
              <input 
                name="status" 
                type="text" 
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm" 
                placeholder="Ví dụ: Ổn định" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Dị ứng</label>
            <input 
              name="allergy" 
              type="text" 
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm" 
              placeholder="Nhập thông tin dị ứng" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Xét nghiệm gần nhất</label>
            <input 
              name="latestTestName" 
              type="text" 
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm" 
              placeholder="Tên xét nghiệm & chỉ số" 
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg font-bold hover:bg-slate-200"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
            >
              Thêm bệnh nhân
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
