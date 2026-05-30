import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Package, Clock, Truck, CheckCircle, X, QrCode } from 'lucide-react';
import { getOrderById, cancelOrder, shipOrder, completeOrder, ApiSalesOrder, ApiSalesOrderItem } from '../services/api';
import { PaymentModal } from '../components/PaymentModal';
import { User } from '../App';

type Props = {
  user: User;
};

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package },
  DELIVERING: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200', icon: X },
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  PARTIALLY_PAID: 'Đặt cọc',
  REFUNDED: 'Đã hoàn tiền',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export function OrderDetailPage({ user }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<ApiSalesOrder | null>(null);
  const [items, setItems] = useState<ApiSalesOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isStaff = user.role === 'ADMIN' || user.role === 'SALES_STAFF';

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const res = await getOrderById(id);
      if (res.statusCode === '200' && res.data) {
        setOrder(res.data.order);
        setItems(res.data.items);
      } else {
        setError(res.message || 'Không thể tải thông tin đơn hàng.');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePaymentDone = () => {
    setShowPaymentModal(false);
    setLoading(true);
    fetchOrder();
  };

  const handleAction = async (action: 'ship' | 'complete' | 'cancel') => {
    if (!id) return;
    const labels: Record<string, string> = {
      ship: 'Xác nhận giao hàng?',
      complete: 'Xác nhận đã nhận hàng?',
      cancel: 'Bạn có chắc muốn hủy đơn hàng này?',
    };
    if (!window.confirm(labels[action])) return;
    setActionLoading(action);
    try {
      const fn = action === 'ship' ? shipOrder : action === 'complete' ? completeOrder : cancelOrder;
      const res = await fn(id);
      if (res.statusCode === '200') {
        setLoading(true);
        fetchOrder();
      } else {
        alert(res.message || 'Thao tác thất bại.');
      }
    } catch {
      alert('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={48} className="text-red-400" />
        <p className="text-gray-500 text-lg">{error || 'Không tìm thấy đơn hàng.'}</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[order.status] || {
    label: order.status,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Package,
  };
  const StatusIcon = statusInfo.icon;

  const canPay =
    order.paymentStatus !== 'PAID' &&
    order.status !== 'CANCELLED';

  return (
    <>
      {showPaymentModal && order && (
        <PaymentModal
          orderId={order.id}
          orderCode={order.orderCode}
          qrCode={order.qrCode}
          amount={order.totalAmount}
          expiresAt={order.paymentLinkExpiredAt}
          onPaid={handlePaymentDone}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Quay lại đơn hàng
          </button>

          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>

            <div className="flex items-center gap-2 flex-wrap">
              {/* QR Payment - unpaid orders */}
              {canPay && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <QrCode size={16} />
                  Mở QR thanh toán
                </button>
              )}

              {/* Ship - CONFIRMED → DELIVERING (ADMIN/SALES_STAFF) */}
              {isStaff && order.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleAction('ship')}
                  disabled={!!actionLoading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium text-sm disabled:opacity-60"
                >
                  <Truck size={16} />
                  {actionLoading === 'ship' ? 'Đang xử lý...' : 'Xác nhận giao hàng'}
                </button>
              )}

              {/* Complete - DELIVERING → COMPLETED (CUSTOMER + STAFF) */}
              {order.status === 'DELIVERING' && (
                <button
                  onClick={() => handleAction('complete')}
                  disabled={!!actionLoading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-60"
                >
                  <CheckCircle size={16} />
                  {actionLoading === 'complete' ? 'Đang xử lý...' : 'Xác nhận đã nhận hàng'}
                </button>
              )}

              {/* Cancel - PENDING or CONFIRMED */}
              {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                <button
                  onClick={() => handleAction('cancel')}
                  disabled={!!actionLoading}
                  className="flex items-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium text-sm disabled:opacity-60"
                >
                  <X size={16} />
                  {actionLoading === 'cancel' ? 'Đang hủy...' : 'Hủy đơn'}
                </button>
              )}
            </div>
          </div>

          {/* Order Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Mã đơn hàng</div>
                <div className="text-xl font-semibold text-blue-600">
                  {order.orderCode || order.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Payment badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-orange-100 text-orange-700 border-orange-200'
                  }`}
                >
                  {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                </span>
                {/* Order status badge */}
                <div
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border ${statusInfo.color} flex items-center gap-2`}
                >
                  <StatusIcon size={15} />
                  {statusInfo.label}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Ngày đặt</div>
                <div className="font-medium">{formatDate(order.orderDate || order.createdAt)}</div>
              </div>
              {order.paidAt && (
                <div>
                  <div className="text-gray-500 mb-1">Ngày thanh toán</div>
                  <div className="font-medium">{formatDate(order.paidAt)}</div>
                </div>
              )}
              {order.paymentLinkExpiredAt && order.paymentStatus !== 'PAID' && (
                <div>
                  <div className="text-gray-500 mb-1">QR hết hạn</div>
                  <div className="font-medium text-orange-600">
                    {new Date(order.paymentLinkExpiredAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              )}
              <div className="col-span-2 md:col-span-3">
                <div className="text-gray-500 mb-1">Địa chỉ giao hàng</div>
                <div className="font-medium">{order.shippingAddress || '--'}</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h2 className="font-semibold text-gray-900 mb-4">Sản phẩm ({items.length})</h2>
            {items.length === 0 ? (
              <p className="text-gray-500 text-sm">Không có thông tin sản phẩm.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Model: {item.incubatorModelId.slice(0, 8)}...
                        </div>
                        {item.incubatorId && (
                          <div className="text-xs text-gray-500">
                            Máy: {item.incubatorId.slice(0, 8)}...
                          </div>
                        )}
                        <div
                          className={`text-xs mt-0.5 ${
                            item.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {item.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">{formatPrice(item.unitPrice)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Tổng tiền</span>
              <span className="text-2xl font-bold text-blue-600">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
