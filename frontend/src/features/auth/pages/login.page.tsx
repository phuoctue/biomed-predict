import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Đường dẫn chính xác 3 cấp thư mục để từ auth/pages đi ra src/components
import { RoleTabs, RoleType } from '../../../components/layout/role-tabs';
import { LoginInput } from '../../../components/layout/login-input';

export function LoginPage() {
  const [role, setRole] = useState<RoleType>('doctor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Login success:', result.data);
      } else {
        alert(result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full font-sans antialiased bg-slate-50 overflow-hidden">
      
      {/* BACKGROUND LỚP DƯỚI: Chia đôi màn hình chuẩn thẩm mỹ */}
      <div className="absolute inset-0 flex w-full h-full select-none pointer-events-none">
        {/* Nửa trái: Màu sáng mượt */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-tr from-blue-50/40 to-white" />
        
        {/* Nửa phải: Ảnh nền y khoa làm mờ chỉn chu */}
        <div 
          className="w-full lg:w-1/2 bg-cover bg-center opacity-90 lg:opacity-100"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.15) 100%), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop')` 
          }}
        />
      </div>

      {/* LỚP TRÊN CÙNG: Căn giữa tuyệt đối (items-center justify-center) cho Form */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
        
        {/* Form Card chính - Nổi bật ở chính giữa */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100/80 p-8 flex flex-col items-center backdrop-blur-sm">
          
          {/* Logo & Tiêu đề thương hiệu */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-1.5 text-blue-600 font-bold text-2xl tracking-wide">
              <span className="border-2 border-blue-600 rounded p-0.5 text-xs font-black">✚</span>
              <span>MedEval</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-1">
              Hệ thống hỗ trợ lâm sàng thông minh
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
            Chào mừng quay trở lại
          </h2>

          {/* Tabs chọn vai trò */}
          <RoleTabs activeRole={role} onChange={setRole} />

          {/* Form Nhập liệu */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            
            {/* Input Tên đăng nhập */}
            <LoginInput
              label="Tên đăng nhập / Số hồ sơ"
              type="text"
              required
              placeholder="username@medeval.vn"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
            />

            {/* Input Mật khẩu */}
            <div className="relative">
              <div className="absolute right-0 top-0 z-10">
                <a href="#forgot" className="text-xs font-semibold text-blue-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <LoginInput
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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

            {/* Checkbox duy trì trạng thái */}
            <div className="flex items-center pt-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-500 font-medium select-none cursor-pointer">
                Duy trì trạng thái đăng nhập
              </label>
            </div>

            {/* Nút Đăng nhập */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 group text-sm disabled:opacity-70"
            >
              <span>{loading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          {/* Đăng ký */}
          <div className="mt-8 text-xs text-slate-500 font-medium">
            Chưa có tài khoản chuyên gia?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}