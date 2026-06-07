import React, { useState, useEffect, useRef } from 'react';
import {
  Loader2, AlertCircle, Plus, Pencil, Trash2, X,
  CalendarDays, Layers, CheckCircle, Search, User as UserIcon,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import {
  getHatchingSeasonTemplates,
  createHatchingSeasonTemplate,
  updateHatchingSeasonTemplate,
  deleteHatchingSeasonTemplate,
  getHatchingSeasonTemplateById,
  listCustomers,
  EGG_TYPES,
  eggTypeLabel,
  normalizeEggType,
  ApiHatchingSeasonTemplate,
  ApiTemplateBatch,
  ApiCustomerSummary,
} from '../services/api';
import { User } from '../App';

type Props = {
  user: User;
};

type BatchForm = {
  batchIndex: number;
  name: string;
  numberOfDays: number;
  notes: string;
};

type TemplateForm = {
  name: string;
  description: string;
  eggType: string;
  isActive: boolean;
  batches: BatchForm[];
};

const emptyForm: TemplateForm = {
  name: '',
  description: '',
  eggType: '',
  isActive: true,
  batches: [],
};

export function TemplatesPage({ user }: Props) {
  const [templates, setTemplates] = useState<ApiHatchingSeasonTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal tạo/sửa
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Customer picker (chỉ dùng khi role là staff/admin)
  const isStaff = ['ADMIN', 'TECHNICIAN', 'SALES_STAFF'].includes(user.role);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState<ApiCustomerSummary[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<ApiCustomerSummary | null>(null);
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchCustomers = (q: string) => {
    setCustomerSearch(q);
    if (!q.trim()) { setCustomerResults([]); setCustomerPickerOpen(false); return; }
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setSearchingCustomer(true);
      try {
        const res = await listCustomers({ search: q, pageSize: 10 });
        if (res.statusCode === '200' && res.data) {
          setCustomerResults(res.data.items);
          setCustomerPickerOpen(true);
        }
      } catch { /* ignore */ } finally {
        setSearchingCustomer(false);
      }
    }, 300);
  };

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getHatchingSeasonTemplates({ page: 1, pageSize: 50 });
      if (res.statusCode === '200' && res.data) {
        setTemplates(res.data.items);
      } else {
        setError(res.message || 'Không thể tải danh sách mẫu.');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setSelectedCustomer(null);
    setCustomerSearch('');
    setCustomerResults([]);
    setShowForm(true);
  };

  const openEdit = async (id: string) => {
    setEditingId(id);
    setFormError('');
    setForm(emptyForm);
    setShowForm(true);
    setLoadingDetail(true);
    try {
      const res = await getHatchingSeasonTemplateById(id);
      if (res.statusCode === '200' && res.data?.template) {
        const t = res.data.template;
        setForm({
          name: t.name,
          description: t.description || '',
          eggType: normalizeEggType(t.eggType),
          isActive: t.isActive,
          batches: (res.data.batches || []).map((b) => ({
            batchIndex: b.batch.batchIndex,
            name: b.batch.name || '',
            numberOfDays: b.batch.numberOfDays,
            notes: b.batch.notes || '',
          })),
        });
      } else {
        setFormError(res.message || 'Không tải được chi tiết mẫu.');
      }
    } catch {
      setFormError('Lỗi kết nối khi tải chi tiết mẫu.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const addBatch = () => {
    setForm((f) => ({
      ...f,
      batches: [
        ...f.batches,
        {
          batchIndex: f.batches.length + 1,
          name: '',
          numberOfDays: 1,
          notes: '',
        },
      ],
    }));
  };

  const updateBatch = (idx: number, patch: Partial<BatchForm>) => {
    setForm((f) => ({
      ...f,
      batches: f.batches.map((b, i) => (i === idx ? { ...b, ...patch } : b)),
    }));
  };

  const removeBatch = (idx: number) => {
    setForm((f) => ({
      ...f,
      batches: f.batches
        .filter((_, i) => i !== idx)
        .map((b, i) => ({ ...b, batchIndex: i + 1 })),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validate batches
    for (const b of form.batches) {
      if (b.numberOfDays < 1) {
        setFormError(`Giai đoạn ${b.batchIndex}: số ngày phải ≥ 1.`);
        return;
      }
    }

    setSaving(true);
    try {
      const batches: ApiTemplateBatch[] = form.batches.map((b) => ({
        batchIndex: b.batchIndex,
        name: b.name || undefined,
        numberOfDays: b.numberOfDays,
        notes: b.notes || undefined,
        configs: [],
      }));

      let res;
      if (editingId) {
        res = await updateHatchingSeasonTemplate(editingId, {
          name: form.name,
          description: form.description || undefined,
          eggType: form.eggType || undefined,
          isActive: form.isActive,
          batches,
        });
      } else {
        res = await createHatchingSeasonTemplate({
          name: form.name,
          description: form.description || undefined,
          eggType: form.eggType || undefined,
          customerId: isStaff ? (selectedCustomer?.id || undefined) : undefined,
          createdByType: isStaff
            ? (selectedCustomer ? 'CUSTOMER' : 'TECHNICIAN')
            : 'CUSTOMER',
          batches,
        });
      }

      if (res.statusCode === '200' || res.statusCode === '201') {
        setShowForm(false);
        fetchTemplates();
      } else {
        setFormError(res.message || 'Lưu mẫu thất bại. Vui lòng thử lại.');
      }
    } catch {
      setFormError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa mẫu mùa ấp này?')) return;
    setDeletingId(id);
    try {
      const res = await deleteHatchingSeasonTemplate(id);
      if (res.statusCode === '200') {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(res.message || 'Không thể xóa mẫu.');
      }
    } catch {
      alert('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setDeletingId(null);
    }
  };

  const eggChipClass = (eggType?: string) => {
    if (!eggType) return 'bg-gray-100 text-gray-400 border-gray-200';
    if (eggType === 'CHICKEN') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (eggType === 'DUCK')    return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    if (eggType === 'QUAIL')   return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (eggType === 'PIGEON')  return 'bg-violet-50 text-violet-700 border-violet-200';
    return 'bg-gray-100 text-gray-400 border-gray-200';
  };

  const cardBarStyle = (eggType?: string): React.CSSProperties => {
    if (eggType === 'CHICKEN') return { background: 'linear-gradient(to right, #fbbf24, #f97316)' };
    if (eggType === 'DUCK')    return { background: 'linear-gradient(to right, #22d3ee, #14b8a6)' };
    if (eggType === 'QUAIL')   return { background: 'linear-gradient(to right, #34d399, #22c55e)' };
    if (eggType === 'PIGEON')  return { background: 'linear-gradient(to right, #a78bfa, #7c3aed)' };
    return { background: 'linear-gradient(to right, #3b82f6, #a855f7)' };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <PageHeader
          title="Mẫu mùa ấp"
          description="Quy trình ấp trứng lưu sẵn, áp dụng nhanh cho máy"
          icon={<Layers size={20} />}
          action={
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm shadow-sm"
            >
              <Plus size={16} />
              Tạo mẫu mới
            </button>
          }
        />
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex flex-col items-center">
            <Loader2 size={36} className="animate-spin text-blue-500 mb-3" />
            <p className="text-gray-400 text-sm">Đang tải danh sách mẫu...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <p className="font-medium text-gray-700 mb-1">Không thể tải dữ liệu</p>
            <p className="text-sm text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchTemplates}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Thử lại
            </button>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mb-5">
              <Layers size={36} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa có mẫu nào</h3>
            <p className="text-sm text-gray-400 mb-7 max-w-xs leading-relaxed">
              Tạo mẫu quy trình ấp trứng để áp dụng nhanh cho các mùa ấp sau.
            </p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm"
            >
              <Plus size={16} />
              Tạo mẫu đầu tiên
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{templates.length} mẫu</span>
              <span className="text-gray-300">·</span>
              <span>{templates.filter((t) => t.isActive).length} đang dùng</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-gray-300 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white"
                >
                  {/* Top color bar */}
                  <div className="h-2" style={cardBarStyle(t.eggType)} />

                  <div className="flex flex-col flex-1 gap-3" style={{ padding: '20px' }}>
                    {/* Title + status */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 flex-1">
                        {t.name}
                      </h3>
                      <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        t.isActive
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {t.isActive ? 'Đang dùng' : 'Tạm tắt'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                      {t.description || 'Không có mô tả'}
                    </p>

                    {/* Info fields */}
                    <div className="flex flex-wrap gap-2 py-3 border-t border-b border-gray-100">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                        <CalendarDays size={13} className="text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-blue-700">{t.totalDays}</span>
                        <span className="text-xs text-blue-400">ngày</span>
                      </div>

                      {t.eggType ? (
                        <div className={`flex items-center px-3 py-1.5 border rounded-lg ${eggChipClass(t.eggType)}`}>
                          <span className="text-xs font-medium">{eggTypeLabel(t.eggType)}</span>
                        </div>
                      ) : null}

                      <div className="flex items-center px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="text-xs text-gray-500">
                          {t.createdByType === 'TECHNICIAN' ? 'Hệ thống' : 'Của bạn'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => openEdit(t.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        <Pencil size={13} />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                        className="flex items-center justify-center px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {deletingId === t.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Trash2 size={14} />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal tạo/sửa */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !saving && setShowForm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Layers size={16} className="text-white" />
                </div>
                <p className="font-semibold text-white">{editingId ? 'Chỉnh sửa mẫu' : 'Tạo mẫu mới'}</p>
              </div>
              {!saving && (
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18} className="text-white" />
                </button>
              )}
            </div>

            {loadingDetail ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-blue-500 mb-3" />
                <p className="text-sm text-gray-400">Đang tải thông tin mẫu...</p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="overflow-y-auto flex-1">
                <div className="space-y-5" style={{ padding: '24px' }}>
                  {formError && (
                    <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Thông tin cơ bản */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Thông tin cơ bản</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Tên mẫu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                          placeholder="VD: Quy trình ấp trứng gà 21 ngày"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          rows={2}
                          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors resize-none"
                          placeholder="Mô tả ngắn về quy trình..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại trứng</label>
                          <select
                            value={form.eggType}
                            onChange={(e) => setForm({ ...form, eggType: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                          >
                            <option value="">-- Chọn loại trứng --</option>
                            {EGG_TYPES.map((e) => (
                              <option key={e.value} value={e.value}>{e.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tổng số ngày</label>
                          <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 flex items-center gap-1.5">
                            <CalendarDays size={14} className="text-blue-400" />
                            <span className="font-semibold text-gray-800">
                              {form.batches.reduce((s, b) => s + b.numberOfDays, 0)}
                            </span>
                            <span className="text-gray-400">ngày</span>
                          </div>
                        </div>
                      </div>

                      {editingId && (
                        <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                          <div
                            onClick={() => setForm({ ...form, isActive: !form.isActive })}
                            className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
                              form.isActive ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            style={{ height: '22px' }}
                          >
                            <span
                              className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
                                form.isActive ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                              style={{ width: '18px', height: '18px' }}
                            />
                          </div>
                          <span className="text-gray-700">
                            {form.isActive ? 'Đang sử dụng' : 'Tạm tắt'}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Customer picker — chỉ hiện khi staff tạo mới */}
                  {isStaff && !editingId && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Gán cho khách hàng</p>
                      {selectedCustomer ? (
                        <div className="flex items-center gap-3 px-3.5 py-2.5 border border-blue-200 bg-blue-50 rounded-xl">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon size={14} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-blue-900 truncate">{selectedCustomer.fullName}</div>
                            <div className="text-xs text-blue-500 truncate">
                              {selectedCustomer.phone}{selectedCustomer.email ? ` · ${selectedCustomer.email}` : ''}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setSelectedCustomer(null); setCustomerSearch(''); setCustomerResults([]); }}
                            className="p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="relative">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={customerSearch}
                              onChange={(e) => searchCustomers(e.target.value)}
                              onFocus={() => customerResults.length > 0 && setCustomerPickerOpen(true)}
                              onBlur={() => setTimeout(() => setCustomerPickerOpen(false), 150)}
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                              placeholder="Tìm theo tên, SĐT, email... (để trống = mẫu hệ thống)"
                            />
                            {searchingCustomer && (
                              <Loader2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                            )}
                          </div>
                          {customerPickerOpen && customerResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                              {customerResults.map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onMouseDown={() => {
                                    setSelectedCustomer(c);
                                    setCustomerPickerOpen(false);
                                    setCustomerSearch('');
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-0 transition-colors"
                                >
                                  <div className="font-medium text-gray-900">{c.fullName}</div>
                                  <div className="text-xs text-gray-400">{c.phone}{c.email ? ` · ${c.email}` : ''}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Giai đoạn */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Các giai đoạn
                        {form.batches.length > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-md normal-case font-medium text-xs">
                            {form.batches.length}
                          </span>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={addBatch}
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 px-2.5 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus size={13} />
                        Thêm giai đoạn
                      </button>
                    </div>

                    {form.batches.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <p className="text-sm text-gray-400">
                          Chưa có giai đoạn nào.{' '}
                          <button type="button" onClick={addBatch} className="text-blue-500 hover:text-blue-600 font-medium">
                            Thêm giai đoạn đầu tiên
                          </button>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {form.batches.map((b, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5"
                          >
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {b.batchIndex}
                            </span>
                            <input
                              type="text"
                              value={b.name}
                              onChange={(e) => updateBatch(idx, { name: e.target.value })}
                              placeholder="Tên giai đoạn"
                              className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-0"
                            />
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <input
                                type="number"
                                value={b.numberOfDays}
                                min={1}
                                max={365}
                                onChange={(e) => updateBatch(idx, { numberOfDays: Number(e.target.value) })}
                                className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <span className="text-xs text-gray-400">ngày</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBatch(idx)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={saving}
                    className="flex-1 px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-60 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 transition-all shadow-sm"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        {editingId ? 'Lưu thay đổi' : 'Tạo mẫu'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
