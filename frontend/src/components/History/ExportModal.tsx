import React, { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { apiClient } from "@/lib/api-client";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters?: {
    patientId?: string;
    drugId?: string;
    riskLevel?: string;
  };
}

export const ExportModal = ({ isOpen, onClose, filters }: ExportModalProps) => {
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.patientId) params.append('patientId', filters.patientId);
      if (filters?.drugId) params.append('drugId', filters.drugId);
      if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);

      const endpoint = format === 'pdf'
        ? `/ai/evaluations/export/pdf?${params}`
        : `/ai/evaluations/export/excel?${params}`;

      const response = await apiClient.get(endpoint, {
        responseType: 'blob',
      });

      // Create blob and download
      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `evaluation_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      onClose();
    } catch (err) {
      setError('Failed to export report. Please try again.');
      console.error('Export error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Xuất Báo Cáo</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-3 mb-6">
          <label className="text-sm font-bold text-slate-600">Chọn định dạng</label>
          <div className="space-y-2">
            <button
              onClick={() => setFormat('pdf')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                format === 'pdf'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                format === 'pdf' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
              }`}>
                {format === 'pdf' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div>
                <div className="font-semibold text-slate-800">PDF</div>
                <div className="text-xs text-slate-500">Phù hợp cho in ấn và chia sẻ</div>
              </div>
            </button>

            <button
              onClick={() => setFormat('excel')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                format === 'excel'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                format === 'excel' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
              }`}>
                {format === 'excel' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div>
                <div className="font-semibold text-slate-800">Excel</div>
                <div className="text-xs text-slate-500">Phù hợp cho phân tích dữ liệu</div>
              </div>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang xuất...
              </>
            ) : (
              <>
                <Download size={16} />
                Xuất báo cáo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
