import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, BookOpen, Calendar, Egg, User, Shield } from 'lucide-react';
import { getHatchingSeasonTemplates, ApiHatchingSeasonTemplate } from '../services/api';

const EGG_TYPE_LABELS: Record<string, string> = {
  CHICKEN: 'Gà',
  DUCK: 'Vịt',
  GOOSE: 'Ngỗng',
  QUAIL: 'Chim cút',
  TURKEY: 'Gà tây',
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export function HatchingTemplatesPage() {
  const [templates, setTemplates] = useState<ApiHatchingSeasonTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'CUSTOMER' | 'TECHNICIAN'>('ALL');

  useEffect(() => {
    setLoading(true);
    getHatchingSeasonTemplates({
      createdByType: filter === 'ALL' ? undefined : filter,
      pageSize: 50,
    })
      .then((res) => {
        if (res.statusCode === '200' && res.data) {
          setTemplates(res.data.items);
        } else {
          setError(res.message || 'Không thể tải danh sách template.');
        }
      })
      .catch(() => setError('Lỗi kết nối. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [filter]);

  const myCount = templates.filter((t) => t.createdByType === 'CUSTOMER').length;
  const publicCount = templates.filter((t) => t.createdByType === 'TECHNICIAN').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Template ấp trứng</h1>
          <p className="text-gray-500 text-sm">
            Danh sách mẫu lịch ấp — cá nhân và công khai từ kỹ thuật viên
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'CUSTOMER', label: `Của tôi (${myCount})` },
            { id: 'TECHNICIAN', label: `Từ kỹ thuật viên (${publicCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-500">Đang tải...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <AlertCircle size={40} className="text-red-400" />
            <p className="text-gray-500">{error}</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <BookOpen size={56} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">Chưa có template nào</h3>
            <p className="text-gray-400 text-sm">Tạo template để lưu lịch ấp của bạn.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((tpl) => {
              const isPublic = tpl.createdByType === 'TECHNICIAN';
              const eggLabel = tpl.eggType ? (EGG_TYPE_LABELS[tpl.eggType] ?? tpl.eggType) : null;

              return (
                <div
                  key={tpl.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Source badge */}
                  <div className={`px-4 py-2 flex items-center gap-1.5 text-xs font-medium ${
                    isPublic
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {isPublic ? <Shield size={12} /> : <User size={12} />}
                    {isPublic ? 'Kỹ thuật viên' : 'Của tôi'}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Egg size={22} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-snug">{tpl.name}</p>
                        {tpl.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{tpl.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{tpl.totalDays} ngày</span>
                      </div>
                      {eggLabel && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Egg size={13} className="text-gray-400" />
                          <span>{eggLabel}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tpl.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {tpl.isActive ? 'Đang dùng' : 'Không dùng'}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(tpl.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
