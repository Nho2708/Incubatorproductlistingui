import { Trash2, Plus, Minus, ShoppingCart as CartIcon, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../App';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartProps = {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (type: 'deposit' | 'full') => void;
  onViewProduct: (product: Product) => void;
  onContinueShopping: () => void;
};

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout, onViewProduct, onContinueShopping }: CartProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  const depositAmount = total * 0.3;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Giỏ hàng của bạn</h1>
          <p className="text-gray-600">
            {items.length > 0 ? `Bạn có ${items.length} sản phẩm trong giỏ hàng` : 'Giỏ hàng trống'}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CartIcon size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-500 mb-6">
              Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <button
              onClick={onContinueShopping}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <button
                      onClick={() => onViewProduct(item.product)}
                      className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => onViewProduct(item.product)}
                        className="text-left text-xl mb-2 hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </button>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <span>Sức chứa: {item.product.capacity} trứng</span>
                        <span>•</span>
                        <span>Công suất: {item.product.power}W</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {item.product.specs.aiMonitoring && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            AI Monitoring
                          </span>
                        )}
                        {item.product.inStock && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Còn hàng
                          </span>
                        )}
                      </div>

                      <div className="text-2xl text-blue-600 mb-4">
                        {formatPrice(item.product.price)}
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Số lượng:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-gray-600">Tổng tiền sản phẩm:</span>
                    <span className="text-xl text-blue-600">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <button
                onClick={onContinueShopping}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Tiếp tục mua sắm
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl mb-6">Tóm tắt đơn hàng</h2>

                {/* Price Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({items.length} sản phẩm):</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600 font-semibold">Miễn phí</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold">Tổng cộng:</span>
                    <span className="text-2xl font-semibold text-blue-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-900">Thanh toán đủ</span>
                      <span className="text-xl text-blue-600 font-semibold">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>✓ Ưu tiên giao hàng</li>
                      <li>✓ Giảm 5% phí vận chuyển</li>
                      <li>✓ Tích điểm thưởng x2</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Đặt cọc 30%</span>
                      <span className="text-xl font-semibold">
                        {formatPrice(depositAmount)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      Còn lại: {formatPrice(total - depositAmount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Thanh toán phần còn lại khi nhận hàng
                    </div>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => onCheckout('full')}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-semibold"
                  >
                    <ShoppingBag size={20} />
                    <span>Mua ngay - Thanh toán đủ</span>
                    <ArrowRight size={20} />
                  </button>
                  
                  <button
                    onClick={() => onCheckout('deposit')}
                    className="w-full px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                  >
                    Đặt cọc 30%
                  </button>
                </div>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <span>Miễn phí vận chuyển toàn quốc</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Bảo hành 2 năm chính hãng</span>
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