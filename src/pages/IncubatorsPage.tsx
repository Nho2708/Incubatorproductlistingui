import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Box, Egg, Thermometer, Hash } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import {
  getIncubators,
  getHatchingSeasons,
  eggTypeLabel,
  ApiIncubator,
  ApiHatchingSeason,
} from '../services/api';

const INCUBATOR_STATUS: Record<string, { label: string; color: string }> = {
  AVAILABLE:           { label: 'Sẵn sàng',       color: 'bg-gray-100 text-gray-600 border-gray-200' },
  RESERVED:            { label: 'Đã giữ chỗ',      color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  ACTIVE:              { label: 'Đang hoạt động',  color: 'bg-green-100 text-green-700 border-green-200' },
  REPLACEMENT_PENDING: { label: 'Chờ thay thế',    color: 'bg-orange-100 text-orange-700 border-orange-200' },
  IN_MAINTENANCE:      { label: 'Đang bảo trì',    color: 'bg-blue-100 text-blue-700 border-blue-200' },
  DAMAGED:             { label: 'Hư hỏng',         color: 'bg-red-100 text-red-700 border-red-200' },
  RETIRED:             { label: 'Ngừng dùng',      color: 'bg-gray-200 text-gray-500 border-gray-300' },
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1569944405467-f040d1c3c7b0?w=400&q=80';

function daysBetween(startDate: string) {
  const diff = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000);
  return diff < 0 ? 0 : diff;
}

export function IncubatorsPage() {
  const navigate = useNavigate();
  const [incubators, setIncubators] = useState<ApiIncubator[]>([]);
  const [activeSeasons, setActiveSeasons] = useState<Record<string, ApiHatchingSeason>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [onlyHatching, setOnlyHatching] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [incRes, seasonRes] = await Promise.all([
        getIncubators({ page: 1, pageSize: 100 }),
        getHatchingSeasons({ status: 'ACTIVE', page: 1, pageSize: 200 }),
      ]);
      if (incRes.statusCode !== '200' || !incRes.data) {
        setError(incRes.message || 'Không thể tải danh sách máy.');
        return;
      }
      setIncubators(incRes.data.items);
      const map: Record<string, ApiHatchingSeason> = {};
      if (seasonRes.statusCode === '200' && seasonRes.data) {
        for (const s of seasonRes.data.items) {
          if (!map[s.incubatorId]) map[s.incubatorId] = s;
        }
      }
      setActiveSeasons(map);
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const visible = onlyHatching ? incubators.filter((i) => activeSeasons[i.id]) : incubators;
  const hatchingCount = incubators.filter((i) => activeSeasons[i.id]).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <PageHeader
          title="Máy ấp trứng"
          description={`Tổng quan trạng thái máy · ${hatchingCount}/${incubators.length} máy đang trong mùa ấp`}
          icon={<Box size={20} />}
        />

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setOnlyHatching(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!onlyHatching ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Tất cả ({incubators.length})
          </button>
          <button
            onClick={() => setOnlyHatching(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${onlyHatching ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Đang ấp ({hatchingCount})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 text-center">
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <p className="text-gray-500 text-lg mb-4">{error}</p>
            <button onClick={fetchData} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Thử lại</button>
          </div>
        ) : visible.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Box size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl mb-2">{onlyHatching ? 'Không có máy nào đang ấp' : 'Chưa có máy nào'}</h3>
            <p className="text-gray-500">{onlyHatching ? 'Hiện không có máy nào đang trong mùa ấp.' : 'Chưa có máy ấp nào trong hệ thống.'}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((inc) => {
              const season = activeSeasons[inc.id];
              const statusInfo = INCUBATOR_STATUS[inc.status] || { label: inc.status, color: 'bg-gray-100 text-gray-600 border-gray-200' };
              return (
                <div
                  key={inc.id}
                  className={`bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3 border-2 ${season ? 'border-green-300' : 'border-transparent'}`}
                >
                  {/* Máy info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={inc.modelImageUrl || FALLBACK_IMG}
                      alt={inc.modelName || 'Máy ấp'}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{inc.modelName || 'Máy ấp trứng'}</div>
                      {inc.serialNumber && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Hash size={11} />{inc.serialNumber}
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Trạng thái mùa ấp */}
                  {season ? (
                    <button
                      onClick={() => navigate(`/seasons/${season.id}`)}
                      className="w-full text-left p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Đang ấp</span>
                      </div>
                      <div className="text-sm font-medium text-green-900 truncate mb-1">{season.name || season.seasonCode}</div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-green-700">
                        <span className="flex items-center gap-1"><Thermometer size={11} />Ngày {daysBetween(season.startDate)}</span>
                        {season.eggType && <span className="flex items-center gap-1"><Egg size={11} />{eggTypeLabel(season.eggType)}</span>}
                        {season.totalEggs != null && <span>{season.totalEggs} trứng</span>}
                      </div>
                      <div className="text-xs text-green-600 mt-1.5 font-medium">Xem chi tiết →</div>
                    </button>
                  ) : (
                    <div className="py-2 text-center text-xs text-gray-400">Chưa có mùa ấp</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
