import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { User as UserType } from '../App';
import { getMyProfile, updateMyProfile, ApiCustomerProfile } from '../services/api';

type ProfileProps = {
  user: UserType;
  onUpdateProfile: (data: { name: string; email: string }) => void;
};

export function Profile({ user, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profile, setProfile] = useState<ApiCustomerProfile | null>(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getMyProfile();
        if (res.statusCode === '200' && res.data) {
          setProfile(res.data);
          setAddress(res.data.address || '');
          onUpdateProfile({ name: res.data.fullName, email: res.data.email || '' });
        }
      } catch {
        setError('Không thể tải thông tin profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError('');
    try {
      const res = await updateMyProfile(address);
      if (res.statusCode === '200') {
        if (profile) setProfile({ ...profile, address });
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(res.message || 'Cập nhật thất bại. Vui lòng thử lại.');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.fullName || user.name || user.username;
  const displayEmail = profile?.email || user.email || '';
  const displayPhone = profile?.phone || '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Thông tin cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-500">Đang tải thông tin...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl mt-4 mb-1">{displayName}</h2>
                  <p className="text-sm text-gray-500">{user.username}</p>
                  {user.role && (
                    <span className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl">Thông tin chi tiết</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 size={18} />
                      <span>Chỉnh sửa địa chỉ</span>
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setAddress(profile?.address || '');
                          setIsEditing(false);
                          setError('');
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X size={18} />
                        <span>Hủy</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                      >
                        <Save size={18} />
                        <span>{saving ? 'Đang lưu...' : 'Lưu'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {saveSuccess && (
                  <div className="p-3 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Cập nhật thành công!
                  </div>
                )}

                <div className="space-y-6">
                  {/* Full Name - read only */}
                  <div>
                    <label className="block text-sm mb-2">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={displayName}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Username - read only */}
                  <div>
                    <label className="block text-sm mb-2">Tên đăng nhập</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={user.username}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Email - read only */}
                  {displayEmail && (
                    <div>
                      <label className="block text-sm mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={displayEmail}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* Phone - read only */}
                  {displayPhone && (
                    <div>
                      <label className="block text-sm mb-2">Số điện thoại</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={displayPhone}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* Address - editable */}
                  <div>
                    <label className="block text-sm mb-2">Địa chỉ giao hàng</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Nhập địa chỉ giao hàng..."
                        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? 'bg-gray-50 text-gray-600' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
