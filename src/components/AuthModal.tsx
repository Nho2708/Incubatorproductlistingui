import { useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, register, tokenStorage, decodeJwt } from '../services/api';
import { User as UserType } from '../App';

type AuthModalProps = {
  onClose: () => void;
  onLogin: (user: UserType) => void;
};

export function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(formData.username, formData.password);
        if (res.statusCode !== '200' || !res.data) {
          setError(res.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
          return;
        }
        const token = res.data;
        tokenStorage.set(token);
        const claims = decodeJwt(token);
        const sub = claims['sub'];
        const uniqueName =
          claims['unique_name'] ||
          claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
          formData.username;
        const role =
          claims['role'] ||
          claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
          'CUSTOMER';
        onLogin({ id: sub, username: uniqueName, name: uniqueName, email: formData.email, role });
        onClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu xác nhận không khớp!');
          return;
        }
        const res = await register(
          formData.username,
          formData.password,
          formData.fullName,
          formData.phone,
          formData.email || undefined
        );
        if (res.statusCode !== '200' && res.statusCode !== '201') {
          setError(res.message || 'Đăng ký thất bại. Vui lòng thử lại.');
          return;
        }
        // If register returns a token, use it; otherwise switch to login
        if (res.data) {
          const token = res.data;
          tokenStorage.set(token);
          const claims = decodeJwt(token);
          const sub = claims['sub'];
          const uniqueName =
            claims['unique_name'] ||
            claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
            formData.username;
          const role =
            claims['role'] ||
            claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            'CUSTOMER';
          onLogin({ id: sub, username: uniqueName, name: formData.fullName, email: formData.email, role });
          onClose();
        } else {
          setMode('login');
          setError('');
          setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        }
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl mb-2">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </h2>
          <p className="text-blue-100 text-sm">
            {mode === 'login'
              ? 'Chào mừng bạn quay lại!'
              : 'Tạo tài khoản để trải nghiệm mua sắm tốt hơn'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm mb-2">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="username (8-15 ký tự)"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0912345678"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm mb-2">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Đang xử lý...'
              : mode === 'login'
              ? 'Đăng nhập'
              : 'Đăng ký'}
          </button>

          {/* Switch Mode */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
