import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingCart,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Order, User as UserType } from '../App';
import { createOrderCustomer, createOrderGuest, CreateOrderResponse } from '../services/api';

type PurchaseFlowProps = {
  order: Order;
  onBack: () => void;
  user: UserType | null;
};

export function PurchaseFlow({ order, onBack, user }: PurchaseFlowProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'confirmation'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState<CreateOrderResponse | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    notes: '',
    verificationPass: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError('');
    try {
      const items = [{ incubatorModelId: order.product.id, quantity: order.quantity }];
      let res;

      if (user) {
        res = await createOrderCustomer(items);
      } else {
        if (!customerInfo.verificationPass || customerInfo.verificationPass.length < 6) {
          setError('Mã xác nhận phải có ít nhất 6 ký tự để tra cứu đơn hàng sau này.');
          setLoading(false);
          return;
        }
        res = await createOrderGuest({
          fullName: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email || undefined,
          address: customerInfo.address || undefined,
          description: customerInfo.notes || undefined,
          verificationPass: customerInfo.verificationPass,
          items,
        });
      }

      if (res.statusCode !== '200' && res.statusCode !== '201') {
        setError(res.message || 'Tạo đơn hàng thất bại. Vui lòng thử lại.');
        return;
      }

      setOrderResult(res.data ?? null);
      setStep('confirmation');
    } catch {
      setError('Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'info', label: 'Thông tin', icon: User },
    { id: 'payment', label: 'Xác nhận', icon: CreditCard },
    { id: 'confirmation', label: 'Hoàn tất', icon: Check },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const isDeposit = order.purchaseType === 'deposit';
  const paymentAmount = isDeposit ? order.deposit! : order.total;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = s.id === step;

              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className={`text-sm ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Step 1: Customer Info */}
            {step === 'info' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl">Thông tin giao hàng</h2>
                    <p className="text-sm text-gray-600">
                      {isDeposit ? 'Đặt cọc 30% - Thanh toán khi nhận hàng' : 'Thanh toán đủ'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmitInfo} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nguyễn Văn A"
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
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0912345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Địa chỉ giao hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                      <textarea
                        required
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Số nhà, đường, phường, quận, thành phố"
                      />
                    </div>
                  </div>

                  {!user && (
                    <div>
                      <label className="block text-sm mb-2">
                        Mã tra cứu đơn hàng <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Tạo mã bí mật (ít nhất 6 ký tự) để tra cứu đơn hàng của bạn sau này
                      </p>
                      <input
                        type="text"
                        required
                        minLength={6}
                        value={customerInfo.verificationPass}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, verificationPass: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tối thiểu 6 ký tự"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm mb-2">Ghi chú</label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tiếp tục
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl mb-6">Xác nhận đơn hàng</h2>

                {error && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Order Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold mb-3">Thông tin giao hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-medium">{customerInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-medium">{customerInfo.phone}</span>
                    </div>
                    {customerInfo.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{customerInfo.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Địa chỉ:</span>
                      <span className="font-medium text-right max-w-[60%]">{customerInfo.address}</span>
                    </div>
                  </div>
                </div>

                {isDeposit && (
                  <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="font-semibold mb-1 text-orange-900">Quy trình đặt cọc</div>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>1. Đặt cọc 30% ({formatPrice(paymentAmount)})</li>
                      <li>2. Sale xác nhận và chuẩn bị hàng</li>
                      <li>3. Giao hàng và thanh toán phần còn lại ({formatPrice(order.remaining!)})</li>
                      <li>4. Nhận QR code kích hoạt thiết bị</li>
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('info')}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 'confirmation' && (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h2 className="text-2xl mb-2">Đặt hàng thành công!</h2>
                {orderResult?.orderCode && (
                  <p className="text-gray-600 mb-2">
                    Mã đơn hàng:{' '}
                    <span className="font-semibold text-blue-600">{orderResult.orderCode}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500 mb-6">
                  {isDeposit
                    ? `Đặt cọc ${formatPrice(paymentAmount)} - Còn lại ${formatPrice(order.remaining!)}`
                    : `Tổng thanh toán ${formatPrice(paymentAmount)}`}
                </p>

                {/* PayOS payment */}
                {(orderResult?.qrCode || orderResult?.checkoutUrl) && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 mb-3 font-semibold">
                      Quét mã QR để thanh toán qua PayOS
                    </p>
                    {orderResult.qrCode && (
                      <img
                        src={orderResult.qrCode}
                        alt="QR thanh toán"
                        className="mx-auto mb-3 w-48 h-48 object-contain"
                      />
                    )}
                    {orderResult.checkoutUrl && (
                      <a
                        href={orderResult.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink size={18} />
                        <span>Hoặc thanh toán qua trình duyệt</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Next steps */}
                <div className="text-left mb-6">
                  <h3 className="mb-4">Quy trình tiếp theo</h3>
                  <div className="space-y-4">
                    {[
                      { num: 1, title: 'Sale xác nhận đơn hàng', sub: 'Trong vòng 2 giờ' },
                      { num: 2, title: 'Chuẩn bị và đóng gói', sub: '1-2 ngày làm việc' },
                      { num: 3, title: 'Giao hàng', sub: '2-5 ngày tùy khu vực' },
                      {
                        num: 4,
                        title: isDeposit ? 'Thanh toán & nhận QR code' : 'Nhận QR code',
                        sub: isDeposit
                          ? `Thanh toán ${formatPrice(order.remaining!)} và nhận mã kích hoạt`
                          : 'Nhận mã kích hoạt thiết bị ngay',
                      },
                    ].map((s) => (
                      <div key={s.num} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                            s.num === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-white'
                          }`}
                        >
                          {s.num}
                        </div>
                        <div>
                          <div className="font-semibold mb-1">{s.title}</div>
                          <div className="text-sm text-gray-600">{s.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onBack}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="mb-4">Tóm tắt đơn hàng</h3>

              {isDeposit ? (
                <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded-lg text-center">
                  <div className="text-sm text-orange-700 font-semibold">Đặt cọc 30%</div>
                </div>
              ) : (
                <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <div className="text-sm text-blue-700 font-semibold">Thanh toán đủ</div>
                </div>
              )}

              <div className="flex gap-3 mb-4 pb-4 border-b border-gray-200">
                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="font-semibold mb-1 text-sm">{order.product.name}</div>
                  <div className="text-sm text-gray-600">Số lượng: {order.quantity}</div>
                </div>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
              </div>

              {isDeposit ? (
                <div className="space-y-2 p-3 bg-orange-50 rounded-lg mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Đặt cọc (30%):</span>
                    <span className="font-semibold text-orange-600">{formatPrice(order.deposit!)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Còn lại:</span>
                    <span className="font-semibold">{formatPrice(order.remaining!)}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-blue-50 rounded-lg mb-4">
                  <div className="flex justify-between">
                    <span>Tổng thanh toán:</span>
                    <span className="text-xl font-semibold text-blue-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  <span>Bảo hành 2 năm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-green-600" />
                  <span>Giao hàng toàn quốc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
