import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Package,
  CreditCard,
  Truck,
  QrCode,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingCart,
} from 'lucide-react';
import { Order, User as UserType } from '../App';

type PurchaseFlowProps = {
  order: Order;
  onBack: () => void;
  user: UserType | null;
};

export function PurchaseFlow({ order, onBack, user }: PurchaseFlowProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'confirmation'>('info');
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    notes: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    setStep('confirmation');
  };

  const steps = [
    { id: 'info', label: 'Thông tin', icon: User },
    { id: 'payment', label: order.purchaseType === 'deposit' ? 'Đặt cọc' : 'Thanh toán', icon: CreditCard },
    { id: 'confirmation', label: 'Hoàn tất', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

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
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      className={`text-sm ${
                        isActive ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
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
                  {isDeposit ? (
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                      <CreditCard size={24} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={24} />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl">Thông tin giao hàng</h2>
                    <p className="text-sm text-gray-600">
                      {isDeposit ? 'Đặt cọc 30% - Thanh toán khi nhận hàng' : 'Thanh toán đủ - Ưu tiên giao hàng'}
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
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
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
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
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
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
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
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, address: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Số nhà, đường, phường, quận, thành phố"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Ghi chú</label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, notes: e.target.value })
                      }
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

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl mb-6">
                  {isDeposit ? 'Thanh toán đặt cọc' : 'Thanh toán đơn hàng'}
                </h2>

                {isDeposit && (
                  <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        i
                      </div>
                      <div>
                        <div className="font-semibold mb-1 text-orange-900">Quy trình đặt cọc</div>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>1. Đặt cọc 30% giá trị đơn hàng ({formatPrice(paymentAmount)})</li>
                          <li>2. Sale xác nhận và chuẩn bị hàng</li>
                          <li>3. Giao hàng và thanh toán phần còn lại ({formatPrice(order.remaining!)})</li>
                          <li>4. Nhận QR code kích hoạt thiết bị</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {!isDeposit && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                      <div>
                        <div className="font-semibold mb-1 text-blue-900">Ưu đãi thanh toán đủ</div>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>✓ Ưu tiên giao hàng nhanh nhất</li>
                          <li>✓ Giảm 5% phí vận chuyển</li>
                          <li>✓ Tặng voucher 500.000đ cho lần mua tiếp theo</li>
                          <li>✓ Nhận QR code ngay khi giao hàng</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                <div className="mb-6">
                  <h3 className="mb-3">Phương thức thanh toán</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-blue-600 rounded-lg cursor-pointer bg-blue-50">
                      <input
                        type="radio"
                        name="payment"
                        defaultChecked
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Chuyển khoản ngân hàng</div>
                        <div className="text-sm text-gray-600">
                          Xác nhận nhanh trong 5 phút
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                      <input
                        type="radio"
                        name="payment"
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Ví điện tử (MoMo, ZaloPay)</div>
                        <div className="text-sm text-gray-600">Thanh toán tức thì</div>
                      </div>
                    </label>

                    {isDeposit && (
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                        <input
                          type="radio"
                          name="payment"
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">Thanh toán khi nhận hàng</div>
                          <div className="text-sm text-gray-600">
                            Thanh toán cho shipper (chỉ áp dụng một số khu vực)
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Bank Transfer Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold mb-3">Thông tin chuyển khoản</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-semibold">Vietcombank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tài khoản:</span>
                      <span className="font-semibold">1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chủ tài khoản:</span>
                      <span className="font-semibold">CÔNG TY MÁY ẤP TRỨNG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-semibold text-blue-600">{formatPrice(paymentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nội dung:</span>
                      <span className="font-semibold text-blue-600">{order.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('info')}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xác nhận thanh toán
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
                <h2 className="text-2xl mb-2">
                  {isDeposit ? 'Đặt cọc thành công!' : 'Đặt hàng thành công!'}
                </h2>
                <p className="text-gray-600 mb-2">
                  Mã đơn hàng: <span className="font-semibold text-blue-600">{order.id}</span>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {isDeposit 
                    ? `Đã đặt cọc ${formatPrice(paymentAmount)} - Còn lại ${formatPrice(order.remaining!)}`
                    : `Đã thanh toán ${formatPrice(paymentAmount)}`
                  }
                </p>

                {/* Order Timeline */}
                <div className="text-left mb-6">
                  <h3 className="mb-4">Quy trình tiếp theo</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                        1
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Sale xác nhận đơn hàng</div>
                        <div className="text-sm text-gray-600">Trong vòng 2 giờ</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                        2
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Chuẩn bị và đóng gói</div>
                        <div className="text-sm text-gray-600">1-2 ngày làm việc</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                        3
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Giao hàng</div>
                        <div className="text-sm text-gray-600">
                          {!isDeposit ? 'Ưu tiên giao nhanh: ' : ''}2-5 ngày tùy khu vực
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                        4
                      </div>
                      <div>
                        <div className="font-semibold mb-1">
                          {isDeposit ? 'Thanh toán & nhận QR code' : 'Nhận QR code'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isDeposit 
                            ? `Thanh toán ${formatPrice(order.remaining!)} và nhận mã kích hoạt`
                            : 'Nhận mã kích hoạt thiết bị ngay'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="p-4 bg-blue-50 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">Thông tin liên hệ</h4>
                  <div className="text-sm space-y-1">
                    <p>Hotline: 1900-xxxx</p>
                    <p>Email: support@mayaptrung.vn</p>
                    <p>Làm việc: 8:00 - 20:00 hàng ngày</p>
                  </div>
                </div>

                <button
                  onClick={onBack}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Về trang chủ
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="mb-4">Tóm tắt đơn hàng</h3>

              {/* Purchase Type Badge */}
              {isDeposit ? (
                <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded-lg text-center">
                  <div className="text-sm text-orange-700 font-semibold">Đặt cọc 30%</div>
                </div>
              ) : (
                <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <div className="text-sm text-blue-700 font-semibold">Thanh toán đủ</div>
                </div>
              )}

              {/* Product Info */}
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

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className={!isDeposit ? 'text-green-600' : ''}>
                    {!isDeposit ? 'Giảm 5%' : 'Miễn phí'}
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              {isDeposit ? (
                <div className="space-y-2 p-3 bg-orange-50 rounded-lg mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Đặt cọc (30%):</span>
                    <span className="font-semibold text-orange-600">
                      {formatPrice(order.deposit!)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Còn lại:</span>
                    <span className="font-semibold">{formatPrice(order.remaining!)}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 p-3 bg-blue-50 rounded-lg mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tổng thanh toán:</span>
                    <span className="text-xl font-semibold text-blue-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              )}

              {/* Features */}
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
                  <Check size={16} className="text-green-600" />
                  <span>Hỗ trợ kỹ thuật 24/7</span>
                </div>
                {!isDeposit && (
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span>Ưu tiên giao hàng</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}