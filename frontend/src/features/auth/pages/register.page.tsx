import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

// Đường dẫn 3 cấp đi ra src/components tương tự trang login
import { RoleTabs, RoleType } from '../../../components/role-tabs';
import { LoginInput } from '../../../components/login-input';

export function RegisterPage() {
  const [role, setRole] = useState<RoleType>('doctor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseId, setLicenseId] = useState(''); // Mã hành nghề cho Bác sĩ/Dược sĩ
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, licenseId, password, role }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Đăng ký tài khoản chuyên gia thành công!');
      } else {
        alert(result.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Lỗi kết nối API đăng ký:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full font-sans antialiased bg-slate-50 overflow-hidden">
      
      {/* BACKGROUND LỚP DƯỚI: Đồng bộ 100% với trang Login */}
      <div className="absolute inset-0 flex w-full h-full select-none pointer-events-none">
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-tr from-blue-50/40 to-white" />
        <div 
          className="w-full lg:w-1/2 bg-cover bg-center opacity-90 lg:opacity-100"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.15) 100%), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop')` 
          }}
        />
      </div>

      {/* LỚP TRÊN CÙNG: Căn giữa tuyệt đối biểu mẫu */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-6 my-auto">
        
        {/* Form Card trắng - Tối ưu max-w-2xl để làm form 2 cột rộng rãi */}
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100/80 p-6 sm:p-8 flex flex-col items-center backdrop-blur-sm">
          
          {/* Logo MedEval */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-2xl tracking-wide">
              <span className="border-2 border-blue-600 rounded p-0.5 text-xs font-black">✚</span>
              <span>MedEval</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-1">
              Hệ thống hỗ trợ lâm sàng thông minh
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-5">
            Đăng ký tài khoản chuyên gia
          </h2>

          {/* Chọn vai trò đăng ký */}
          <RoleTabs activeRole={role} onChange={setRole} />

          {/* Form Nhập liệu chia lưới Grid */}
          <form onSubmit={handleRegister} className="w-full space-y-4 mt-2">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* CỘT 1: Thông tin cá nhân */}
              <div className="space-y-4">
                <LoginInput
                  label="Họ và tên"
                  type="text"
                  required
                  placeholder="Bác sĩ Nguyễn Văn A"
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  icon={<User className="h-4 w-4" />}
                />

                <LoginInput
                  label="Địa chỉ Email"
                  type="email"
                  required
                  placeholder="doctor@medeval.vn"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                />

                <LoginInput
                  label="Số điện thoại"
                  type="tel"
                  required
                  placeholder="0901 234 567"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>

              {/* CỘT 2: Thông tin chứng chỉ & Bảo mật */}
              <div className="space-y-4">
                <LoginInput
                  label={role === 'patient' ? "Số CMND / Căn cước" : "Mã số hành nghề (CCHN)"}
                  type="text"
                  required
                  placeholder={role === 'patient' ? "079xxxxxxxxx" : "012345/BYT-CCHN"}
                  value={licenseId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLicenseId(e.target.value)}
                  icon={<ShieldCheck className="h-4 w-4" />}
                />

                <LoginInput
                  label="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                />

                <LoginInput
                  label="Xác nhận mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              </div>

            </div>

            {/* Checkbox điều khoản - Ép màu TRẮNG hoàn toàn theo yêu cầu cũ */}
            <div className="flex items-start pt-2">
              <input
                id="accept-terms"
                type="checkbox"
                required
                checked={acceptTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 bg-white border border-slate-300 rounded cursor-pointer transition-colors 
                           text-blue-600 focus:ring-slate-200 focus:ring-offset-0 hover:border-slate-400
                           checked:bg-white checked:border-slate-300"
              />
              <label htmlFor="accept-terms" className="ml-2 block text-xs text-slate-500 font-medium select-none cursor-pointer leading-normal">
                Tôi đồng ý với <a href="#terms" className="text-blue-600 hover:underline font-semibold">Điều khoản sử dụng</a> và cam kết bảo mật thông tin bệnh án.
              </label>
            </div>

            {/* Nút Đăng ký */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 group text-sm disabled:opacity-70"
            >
              <span>{loading ? 'Đang xử lý tạo tài khoản...' : 'Đăng ký tài khoản'}</span>
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          {/* Quay lại đăng nhập */}
          <div className="mt-6 text-xs text-slate-500 font-medium">
            Đã có tài khoản chuyên gia?{' '}
            <a href="/login" className="text-blue-600 font-bold hover:underline">
              Đăng nhập ngay
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}