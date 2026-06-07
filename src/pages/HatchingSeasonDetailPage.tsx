import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Loader2, AlertCircle, Egg, Calendar, CheckCircle,
  XCircle, Pencil, Layers, Clock, X, Save,
} from 'lucide-react';
import {
  getHatchingSeasonById,
  updateHatchingSeason,
  updateHatchingSeasonStatus,
  eggTypeLabel,
  ApiHatchingSeasonDetail,
} from '../services/api';

const SEASON_STATUS: Record<string, { label: string; color: string; icon: any }> = {
  ACTIVE:    { label: 'Đang ấp',   color: 'bg-green-100 text-green-700 border-green-200',   icon: Egg },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-700 border-blue-200',     icon: CheckCircle },
  FAILED:    { label: 'Thất bại',   color: 'bg-red-100 text-red-700 border-red-200',         icon: XCircle },
  CANCELLED: { label: 'Đã hủy',    color: 'bg-gray-100 text-gray-600 border-gray-200',      icon: X },
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  ACTIVE:    ['COMPLETED', 'FAILED', 'CANCELLED'],
  COMPLETED: [],
  FAILED:    [],
  CANCELLED: [],
};

function fmt(d?: string) {
  if (!d) return '--';
  return new Date(d).toLocaleDateString('vi-VN');
}

function daysBetween(start: string) {
  const d = Math.floor((Date.now() - new Date(start).getTime()) / 86400000);
  return d < 0 ? 0 : d;
}

export function HatchingSeasonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ApiHatchingSeasonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inline edit kết quả
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ successCount: 0, failCount: 0, totalEggs: 0, endDate: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Đổi status
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [statusError, setStatusError] = useState('');

  const fetch = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await getHatchingSeasonById(id);
      if (res.statusCode === '200' && res.data) {
        setDetail(res.data);
        const s = res.data.season;
        setEditForm({
          successCount: s.successCount,
          failCount: s.failCount,
          totalEggs: s.totalEggs ?? 0,
          endDate: s.endDate ?? '',
          notes: s.notes ?? '',
        });
      } else {
        setError(res.message || 'Không tải được chi tiết mùa ấp.');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await updateHatchingSeason(id, {
        successCount: editForm.successCount,
        failCount: editForm.failCount,
        totalEggs: editForm.totalEggs || undefined,
        endDate: editForm.endDate || undefined,
        notes: editForm.notes || undefined,
      });
      if (res.statusCode === '200') {
        setEditing(false);
        fetch();
      } else {
        setSaveError(res.message || 'Lưu thất bại.');
      }
    } catch {
      setSaveError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    setUpdatingStatus(newStatus);
    setStatusError('');
    try {
      const res = await updateHatchingSeasonStatus(id, newStatus);
      if (res.statusCode === '200') {
        fetch();
      } else {
        setStatusError(res.message || 'Không thể cập nhật trạng thái.');
      }
    } catch {
      setStatusError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={48} className="text-red-400" />
        <p className="text-gray-500 text-lg">{error || 'Không tìm thấy mùa ấp.'}</p>
        <button onClick={() => navigate('/machines')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Quay lại máy ấp
        </button>
      </div>
    );
  }

  const { season, template, batches } = detail;
  const statusInfo = SEASON_STATUS[season.status] || { label: season.status, color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Clock };
  const StatusIcon = statusInfo.icon;
  const nextStatuses = STATUS_TRANSITIONS[season.status] ?? [];
  const hatchRate = season.totalEggs
    ? Math.round((season.successCount / season.totalEggs) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate('/machines')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Quay lại máy ấp
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{season.name || season.seasonCode}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1.5 ${statusInfo.color}`}>
                  <StatusIcon size={14} />
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-sm text-gray-500">Mã: {season.seasonCode}</p>
            </div>

            {season.status === 'ACTIVE' && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Pencil size={15} />
                Cập nhật kết quả
              </button>
            )}
          </div>

          {/* Thống kê tổng */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{season.totalEggs ?? '--'}</div>
              <div className="text-xs text-gray-500 mt-0.5">Tổng trứng</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{season.successCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Nở thành công</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{season.failCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Thất bại</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {hatchRate != null ? `${hatchRate}%` : '--'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Tỉ lệ nở</div>
            </div>
          </div>
        </div>

        {/* Thông tin */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              Thông tin mùa ấp
            </h2>
            <dl className="space-y-3 text-sm">
              {season.eggType && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Loại trứng</dt>
                  <dd className="font-medium flex items-center gap-1"><Egg size={14} />{eggTypeLabel(season.eggType)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Ngày bắt đầu</dt>
                <dd className="font-medium">{fmt(season.startDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Ngày kết thúc</dt>
                <dd className="font-medium">{fmt(season.endDate)}</dd>
              </div>
              {season.status === 'ACTIVE' && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Ngày ấp thứ</dt>
                  <dd className="font-medium text-green-700">{daysBetween(season.startDate)}</dd>
                </div>
              )}
              {season.notes && (
                <div className="pt-2 border-t border-gray-100">
                  <dt className="text-gray-500 mb-1">Ghi chú</dt>
                  <dd className="text-gray-700">{season.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Template */}
          {template && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers size={18} className="text-purple-600" />
                Mẫu áp dụng
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tên mẫu</dt>
                  <dd className="font-medium">{template.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tổng số ngày</dt>
                  <dd className="font-medium">{template.totalDays} ngày</dd>
                </div>
                {template.eggType && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Loại trứng mẫu</dt>
                    <dd className="font-medium">{eggTypeLabel(template.eggType)}</dd>
                  </div>
                )}
                {template.description && (
                  <div className="pt-2 border-t border-gray-100">
                    <dt className="text-gray-500 mb-1">Mô tả</dt>
                    <dd className="text-gray-700">{template.description}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* Batches */}
        {batches.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h2 className="font-semibold text-gray-900 mb-4">Các giai đoạn</h2>
            <div className="space-y-3">
              {batches.map((b, idx) => {
                const isCurrentDay =
                  season.status === 'ACTIVE' &&
                  daysBetween(season.startDate) >= b.batch.dayStart &&
                  daysBetween(season.startDate) <= b.batch.dayEnd;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-3 rounded-lg border ${
                      isCurrentDay
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isCurrentDay ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {b.batch.batchIndex}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {b.batch.name || `Giai đoạn ${b.batch.batchIndex}`}
                        {isCurrentDay && (
                          <span className="ml-2 text-xs text-green-700 font-normal">● Đang ở giai đoạn này</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Ngày {b.batch.dayStart} – {b.batch.dayEnd}
                      </div>
                      {b.batch.notes && <div className="text-xs text-gray-400 mt-0.5">{b.batch.notes}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Đổi trạng thái */}
        {nextStatuses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Kết thúc mùa ấp</h2>
            {statusError && (
              <div className="flex items-center gap-2 p-3 mb-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle size={15} />
                {statusError}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((s) => {
                const info = SEASON_STATUS[s];
                const Icon = info.icon;
                const isUpdating = updatingStatus === s;
                const colorBtn =
                  s === 'COMPLETED' ? 'bg-green-600 hover:bg-green-700' :
                  s === 'FAILED'    ? 'bg-red-600 hover:bg-red-700' :
                                      'bg-gray-500 hover:bg-gray-600';
                return (
                  <button
                    key={s}
                    onClick={() => {
                      if (confirm(`Chuyển trạng thái mùa ấp sang "${info.label}"?`)) handleStatusChange(s);
                    }}
                    disabled={!!updatingStatus}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${colorBtn}`}
                  >
                    {isUpdating ? <Loader2 size={15} className="animate-spin" /> : <Icon size={15} />}
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal cập nhật kết quả */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !saving && setEditing(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-4 flex items-center justify-between">
              <p className="font-semibold text-lg">Cập nhật kết quả ấp</p>
              {!saving && (
                <button onClick={() => setEditing(false)} className="p-1 hover:bg-white/20 rounded-lg">
                  <X size={20} />
                </button>
              )}
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {saveError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={15} />
                  {saveError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1.5">Tổng trứng</label>
                  <input
                    type="number" min={0}
                    value={editForm.totalEggs || ''}
                    onChange={(e) => setEditForm({ ...editForm, totalEggs: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-green-700">Nở thành công</label>
                  <input
                    type="number" min={0}
                    value={editForm.successCount}
                    onChange={(e) => setEditForm({ ...editForm, successCount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-red-600">Thất bại</label>
                  <input
                    type="number" min={0}
                    value={editForm.failCount}
                    onChange={(e) => setEditForm({ ...editForm, failCount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1.5">Ghi chú</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditing(false)} disabled={saving}
                  className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60">
                  Hủy
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
                  {saving ? <><Loader2 size={18} className="animate-spin" />Đang lưu...</> : <><Save size={18} />Lưu</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
