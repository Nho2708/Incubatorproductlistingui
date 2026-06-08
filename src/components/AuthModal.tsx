import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { login, register, registerResend, registerVerify, tokenStorage, decodeJwt } from '../services/api';
import { User as UserType } from '../App';

type AuthModalProps = {
  onClose: () => void;
  onLogin: (user: UserType) => void;
};

type Mode = 'login' | 'register' | 'otp';

const RESEND_COOLDOWN = 60;

export function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Register form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    confirmPassword: '',
  });

  // OTP step
  const [sessionId, setSessionId] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (mode !== 'otp') return;
    setResendCountdown(RESEND_COOLDOWN);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, sessionId]);

  const switchToLogin = () => {
    setMode('login');
    setError('');
    setOtpDigits(['', '', '', '', '', '']);
  };

  const handleOtpChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[idx] = digit;
    setOtpDigits(next);
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...otpDigits];
    text.split('').forEach((d, i) => { if (i < 6) next[i] = d; });
    setOtpDigits(next);
    otpRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleResend = useCallback(async () => {
    if (resendCountdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      const res = await registerResend(sessionId);
      if ((res.statusCode === '200' || res.statusCode === '201') && res.data) {
        setSessionId(res.data);
        setOtpDigits(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else {
        setError(res.message || 'Không thể gửi lại mã. Vui lòng thử lại.');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setResending(false);
    }
  }, [sessionId, resendCountdown, resending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ── Đăng nhập ──────────────────────────────────────────────────────────
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
        return;
      }

      // ── Đăng ký (bước 1) ────────────────────────────────────────────────────
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu xác nhận không khớp!');
          return;
        }
        const res = await register({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        });
        if ((res.statusCode !== '200' && res.statusCode !== '201') || !res.data) {
          setError(res.message || 'Đăng ký thất bại. Vui lòng thử lại.');
          return;
        }
        setSessionId(res.data);
        setOtpDigits(['', '', '', '', '', '']);
        setMode('otp');
        return;
      }

      // ── Xác thực OTP (bước 2) ──────────────────────────────────────────────
      if (mode === 'otp') {
        const otp = otpDigits.join('');
        if (otp.length < 6) {
          setError('Vui lòng nhập đủ 6 chữ số mã OTP.');
          return;
        }
        const res = await registerVerify(sessionId, otp);
        if (res.statusCode !== '200' && res.statusCode !== '201') {
          setError(res.message || 'Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.');
          return;
        }
        // Đăng ký hoàn tất → chuyển sang đăng nhập
        setMode('login');
        setError('');
        setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const headerText = {
    login:    { title: 'Đăng nhập',           sub: 'Chào mừng bạn quay lại!' },
    register: { title: 'Đăng ký tài khoản',   sub: 'Tạo tài khoản để trải nghiệm mua sắm tốt hơn' },
    otp:      { title: 'Xác thực email',       sub: `Mã OTP đã được gửi đến ${formData.email}` },
  }[mode];

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
          <h2 className="text-2xl mb-1">{headerText.title}</h2>
          <p className="text-blue-100 text-sm">{headerText.sub}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Login & Register fields ── */}
          {mode !== 'otp' && (
            <>
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
                    <label className="block text-sm mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        required
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
            </>
          )}

          {/* ── OTP step ── */}
          {mode === 'otp' && (
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-1 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm">
                <CheckCircle size={15} className="flex-shrink-0" />
                <span>Đăng ký thành công! Kiểm tra email để lấy mã xác thực.</span>
              </div>

              {/* 6-digit boxes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Nhập mã OTP 6 chữ số
                </label>
                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-9 h-10 text-center text-base font-bold border-2 rounded-lg focus:outline-none transition-colors ${
                        digit
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Resend */}
              <div className="text-center">
                {resendCountdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Gửi lại mã sau{' '}
                    <span className="font-semibold text-blue-600">{resendCountdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-60"
                  >
                    <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                    {resending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || (mode === 'otp' && otpDigits.join('').length < 6)}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
          >
            {loading
              ? 'Đang xử lý...'
              : mode === 'login'
              ? 'Đăng nhập'
              : mode === 'register'
              ? 'Đăng ký'
              : 'Xác nhận'}
          </button>

          {/* Footer links */}
          <div className="text-center pt-4 border-t border-gray-200">
            {mode === 'otp' ? (
              <button
                type="button"
                onClick={switchToLogin}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Quay lại đăng nhập
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
