import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Cpu, CheckCircle, Wrench, Package, Clock, XCircle } from 'lucide-react';
import { getMyIncubators, ApiIncubatorItem } from '../services/api';

const STATUS_MAP: Record<string, { label: string; color: string; icon: any; hatching: boolean }> = {
  ACTIVE:               { label: 'Đang ấp',        color: 'bg-green-100 text-green-700 border-green-200',   icon: CheckCircle, hatching: true  },
  AVAILABLE:            { label: 'Sẵn sàng',        color: 'bg-blue-100 text-blue-700 border-blue-200',      icon: Cpu,         hatching: false },
  RESERVED:             { label: 'Đã đặt trước',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock,       hatching: false },
  REPLACEMENT_PENDING:  { label: 'Chờ thay thế',    color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Package,     hatching: false },
  IN_MAINTENANCE:       { label: 'Đang bảo trì',    color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Wrench,      hatching: false },
  DAMAGED:              { label: 'Hư hỏng',         color: 'bg-red-100 text-red-700 border-red-200',         icon: XCircle,     hatching: false },
  RETIRED:              { label: 'Ngừng sử dụng',   color: 'bg-gray-100 text-gray-500 border-gray-200',      icon: XCircle,     hatching: false },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export function MyIncubatorsPage() {
  const [incubators, setIncubators] = useState<ApiIncubatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyIncubators({ pageSize: 50 })
      .then((res) => {
        if (res.statusCode === '200' && res.data) {
          setIncubators(res.data.items);
        } else {
          setError(res.message || 'Không thể tải danh sách máy ấp.');
        }
      })
      .catch(() => setError('Lỗi kết nối. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  const hatchingCount = incubators.filter((i) => i.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Máy ấp của tôi</h1>
          <p className="text-gray-500 text-sm">
            {!loading && !error && (
              <>
                {incubators.length} máy ·{' '}
                <span className="text-green-600 font-medium">{hatchingCount} đang ấp</span>
              </>
            )}
          </p>
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
        ) : incubators.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <Cpu size={56} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">Chưa có máy ấp nào</h3>
            <p className="text-gray-400 text-sm">Mua máy ấp để bắt đầu.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {incubators.map((item) => {
              const info = STATUS_MAP[item.status] ?? {
                label: item.status,
                color: 'bg-gray-100 text-gray-600 border-gray-200',
                icon: Cpu,
                hatching: false,
              };
              const Icon = info.icon;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-shadow hover:shadow-md ${
                    info.hatching ? 'border-green-200' : 'border-transparent'
                  }`}
                >
                  {/* Hatching banner */}
                  {info.hatching && (
                    <div className="bg-green-500 text-white text-xs text-center py-1.5 font-medium flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Đang ấp trứng
                    </div>
                  )}

                  <div className="p-5">
                    {/* Image / icon */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.modelImageUrl ? (
                          <img src={item.modelImageUrl} alt={item.modelName} className="w-full h-full object-cover" />
                        ) : (
                          <Cpu size={28} className="text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.modelName || 'Máy ấp'}</p>
                        {item.serialNumber && (
                          <p className="text-xs text-gray-400 mt-0.5">SN: {item.serialNumber}</p>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${info.color} mb-3`}>
                      <Icon size={13} />
                      {info.label}
                    </div>

                    {/* Info */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {item.activatedAt && (
                        <div className="flex justify-between">
                          <span>Kích hoạt</span>
                          <span className="font-medium text-gray-700">{formatDate(item.activatedAt)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Nhận</span>
                        <span className="font-medium text-gray-700">{formatDate(item.createdAt)}</span>
                      </div>
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
