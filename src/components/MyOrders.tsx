import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Loader2, AlertCircle, X, Eye, CreditCard, PackageCheck, ShoppingBag } from 'lucide-react';
import { getMyOrders, cancelOrder, claimGuestOrder, ApiSalesOrder } from '../services/api';
import { PaymentModal } from './PaymentModal';
import { PageHeader } from './PageHeader';
import { User } from '../App';

type MyOrdersProps = {
  user: User;
};

type TabStatus = 'all' | 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200', icon: X },
};

const TABS: { id: TabStatus; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'PENDING', label: 'Chờ xác nhận' },
  { id: 'PROCESSING', label: 'Đang xử lý' },
  { id: 'SHIPPING', label: 'Đang giao' },
  { id: 'COMPLETED', label: 'Hoàn thành' },
  { id: 'CANCELLED', label: 'Đã hủy' },
];

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  PARTIALLY_PAID: 'Đặt cọc',
  REFUNDED: 'Đã hoàn tiền',
};

export function MyOrders({ user: _user }: MyOrdersProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabStatus>('all');
  const [orders, setOrders] = useState<ApiSalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingOrder, setPayingOrder] = useState<ApiSalesOrder | null>(null);
  // Claim (nhận) đơn guest về tài khoản
  const [showClaim, setShowClaim] = useState(false);
  const [claimForm, setClaimForm] = useState({ orderCode: '', verificationPass: '' });
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const fetchOrders = async (status?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyOrders({
        status: status && status !== 'all' ? status : undefined,
        page: 1,
        pageSize: 50,
      });
      if (res.statusCode !== '200' || !res.data) {
        setError(res.message || 'Không thể tải đơn hàng.');
        return;
      }
      setOrders(res.data.items);
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab !== 'all' ? activeTab : undefined);
  }, [activeTab]);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    setCancellingId(orderId);
    try {
      const res = await cancelOrder(orderId);
      if (res.statusCode === '200') {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
        );
      } else {
        alert(res.message || 'Không thể hủy đơn hàng.');
      }
    } catch {
      alert('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaiming(true);
    setClaimError('');
    try {
      const res = await claimGuestOrder(
        claimForm.orderCode.trim(),
        claimForm.verificationPass
      );
      if (res.statusCode === '200' && res.data) {
        setClaimSuccess(true);
        setClaimForm({ orderCode: '', verificationPass: '' });
        fetchOrders(activeTab !== 'all' ? activeTab : undefined);
        setTimeout(() => {
          setShowClaim(false);
          setClaimSuccess(false);
        }, 1500);
      } else {
        setClaimError(res.message || 'Không thể nhận đơn. Kiểm tra lại mã đơn và mã tra cứu.');
      }
    } catch {
      setClaimError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setClaiming(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const getStatusInfo = (status: string) => {
    return STATUS_MAP[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Package };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {payingOrder && (
        <PaymentModal
          orderId={payingOrder.id}
          orderCode={payingOrder.orderCode}
          qrCode={payingOrder.qrCode}
          amount={payingOrder.totalAmount}
          expiresAt={payingOrder.paymentLinkExpiredAt}
          onPaid={() => {
            setPayingOrder(null);
            fetchOrders(activeTab !== 'all' ? activeTab : undefined);
          }}
          onClose={() => setPayingOrder(null)}
        />
      )}

      {/* Modal nhận đơn guest */}
      {showClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !claiming && setShowClaim(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackageCheck size={20} />
                <p className="font-semibold text-lg">Nhận đơn hàng khách</p>
              </div>
              {!claiming && (
                <button
                  onClick={() => setShowClaim(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="p-6">
              {claimSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Nhận đơn thành công!</p>
                  <p className="text-sm text-gray-500">Đơn đã được thêm vào tài khoản của bạn.</p>
                </div>
              ) : (
                <form onSubmit={handleClaim} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Nhập mã đơn hàng và mã tra cứu bạn đã tạo khi đặt đơn không đăng nhập để
                    chuyển đơn về tài khoản này.
                  </p>

                  {claimError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{claimError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm mb-1.5">
                      Mã đơn hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={claimForm.orderCode}
                      onChange={(e) => setClaimForm({ ...claimForm, orderCode: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: ORD-XXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1.5">
                      Mã tra cứu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      minLength={6}
                      value={claimForm.verificationPass}
                      onChange={(e) =>
                        setClaimForm({ ...claimForm, verificationPass: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mã bí mật (tối thiểu 6 ký tự)"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={claiming}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {claiming ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Đang nhận đơn...
                      </>
                    ) : (
                      'Nhận đơn'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <PageHeader
          title="Đơn hàng của tôi"
          description="Quản lý và theo dõi đơn hàng của bạn"
          icon={<ShoppingBag size={20} />}
          action={
            <button
              onClick={() => {
                setClaimError('');
                setClaimSuccess(false);
                setShowClaim(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors font-medium shadow-sm text-sm"
            >
              <PackageCheck size={16} />
              Nhận đơn khách
            </button>
          }
        />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] px-4 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-500 text-lg">Đang tải đơn hàng...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 text-center">
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <p className="text-gray-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => fetchOrders(activeTab !== 'all' ? activeTab : undefined)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-500">
              {activeTab === 'all' ? 'Bạn chưa có đơn hàng nào' : `Không có đơn hàng ${getStatusInfo(activeTab).label.toLowerCase()}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const isCancelling = cancellingId === order.id;
              const canCancel = order.status === 'PENDING' || order.status === 'PROCESSING';
              const canPay =
                order.status !== 'CANCELLED' &&
                order.paymentStatus !== 'PAID' &&
                order.paymentStatus !== 'REFUNDED';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Mã đơn hàng</div>
                        <div className="font-semibold text-blue-600">
                          {order.orderCode || order.id.slice(0, 8).toUpperCase()}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color} flex items-center gap-1.5`}
                      >
                        <StatusIcon size={16} />
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Eye size={15} />
                        Chi tiết
                      </button>
                      {canPay && (
                        <button
                          onClick={() => setPayingOrder(order)}
                          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <CreditCard size={15} />
                          Thanh toán
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={isCancelling}
                          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-60"
                        >
                          {isCancelling ? (
                            <span className="flex items-center gap-1.5">
                              <Loader2 size={14} className="animate-spin" />
                              Đang hủy...
                            </span>
                          ) : 'Hủy đơn'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Ngày đặt</div>
                        <div className="font-medium">{formatDate(order.orderDate || order.createdAt)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Địa chỉ giao</div>
                        <div className="font-medium line-clamp-1">{order.shippingAddress || '--'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Thanh toán</div>
                        <div className="font-medium">
                          {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Tổng tiền</div>
                        <div className="text-xl font-semibold text-blue-600">
                          {formatPrice(order.totalAmount)}
                        </div>
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
