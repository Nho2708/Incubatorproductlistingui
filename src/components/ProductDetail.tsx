import { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Thermometer,
  Droplets,
  Zap,
  RotateCw,
  Smartphone,
  Brain,
  Check,
  Users,
  TrendingUp,
  Shield,
  Minus,
  Plus,
  CreditCard,
  ShoppingCart,
  Home,
} from 'lucide-react';
import { Product, User } from '../App';

type ProductDetailProps = {
  product: Product;
  onBack: () => void;
  onPurchase: (product: Product, quantity: number, type: 'deposit' | 'full') => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  user: User | null;
  onLogin: () => void;
};

export function ProductDetail({ product, onBack, onPurchase, onAddToCart, user, onLogin }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePurchaseClick = (type: 'deposit' | 'full') => {
    if (!user) {
      onLogin();
      return;
    }
    onPurchase(product, quantity, type);
  };

  const reviews = [
    {
      id: 1,
      author: 'Nguyễn Văn A',
      rating: 5,
      date: '15/12/2025',
      comment: 'Máy rất tốt, tỉ lệ nở cao, dễ sử dụng. Đã mua lần 2 rồi!',
      image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=200&q=80',
    },
    {
      id: 2,
      author: 'Trần Thị B',
      rating: 4,
      date: '10/12/2025',
      comment: 'Chất lượng ổn, nhiệt độ ổn định. Hơi tốn điện một chút.',
      image: null,
    },
    {
      id: 3,
      author: 'Lê Văn C',
      rating: 5,
      date: '05/12/2025',
      comment: 'Tuyệt vời! App theo dõi rất tiện, không cần ra trang trại cũng biết tình trạng.',
      image: 'https://images.unsplash.com/photo-1569944405467-f040d1c3c7b0?w=200&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.specs.aiMonitoring && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Brain size={20} />
                  <span>AI Monitoring</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span>{product.rating}</span>
                <span className="text-gray-500">({product.reviews} đánh giá)</span>
                <span className="text-gray-400">• {product.soldCount} đã bán</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl text-blue-600 mb-1">{formatPrice(product.price)}</div>
                {!product.inStock && product.preOrder && (
                  <div className="text-orange-600">Đặt trước - Giao hàng trong 2 tuần</div>
                )}
                {product.inStock && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check size={18} />
                    <span>Còn hàng - Giao hàng ngay</span>
                  </div>
                )}
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Users className="text-blue-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Sức chứa</div>
                    <div className="font-semibold">{product.capacity} trứng</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="text-green-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Tỉ lệ nở</div>
                    <div className="font-semibold">{product.hatchRate}%</div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm mb-2">Số lượng</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="mb-6 space-y-3">
                {/* Full Payment Option */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="text-blue-600" size={20} />
                      <span className="font-semibold text-blue-900">Mua ngay - Thanh toán đủ</span>
                    </div>
                  </div>
                  <div className="text-2xl text-blue-600 mb-1">
                    {formatPrice(product.price * quantity)}
                  </div>
                  <div className="text-sm text-blue-700">
                    ✓ Ưu tiên giao hàng • ✓ Giảm 5% phí vận chuyển
                  </div>
                </div>

                {/* Deposit Option */}
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="text-gray-600" size={20} />
                      <span className="font-semibold text-gray-900">Đặt cọc 30%</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl text-gray-900">
                      {formatPrice(product.price * quantity * 0.3)}
                    </span>
                    <span className="text-sm text-gray-500">
                      (Còn lại: {formatPrice(product.price * quantity * 0.7)})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Thanh toán phần còn lại khi nhận hàng
                  </div>
                </div>
              </div>

              {/* Purchase Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePurchaseClick('deposit')}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <CreditCard size={20} />
                  <span>Đặt cọc 30%</span>
                </button>
                <button
                  onClick={() => handlePurchaseClick('full')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <ShoppingCart size={20} />
                  <span>Mua ngay</span>
                </button>
              </div>

              {!user && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Vui lòng đăng nhập để mua hàng
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex-1 px-6 py-4 ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Thông số kỹ thuật
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 px-6 py-4 ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Đánh giá ({product.reviews})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Specs Tab */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Thermometer className="text-red-600 mt-1" size={24} />
                    <div>
                      <div className="font-semibold mb-1">Dải nhiệt độ</div>
                      <div className="text-gray-600">{product.specs.tempRange}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Droplets className="text-blue-600 mt-1" size={24} />
                    <div>
                      <div className="font-semibold mb-1">Dải độ ẩm</div>
                      <div className="text-gray-600">{product.specs.humidityRange}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Zap className="text-yellow-600 mt-1" size={24} />
                    <div>
                      <div className="font-semibold mb-1">Công suất điện</div>
                      <div className="text-gray-600">{product.specs.powerConsumption}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <RotateCw className="text-purple-600 mt-1" size={24} />
                    <div>
                      <div className="font-semibold mb-1">Motor đảo trứng</div>
                      <div className="text-gray-600">{product.specs.eggTurning}</div>
                    </div>
                  </div>

                  {product.specs.appConnection && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Smartphone className="text-green-600 mt-1" size={24} />
                      <div>
                        <div className="font-semibold mb-1">Kết nối App</div>
                        <div className="text-gray-600">Hỗ trợ iOS & Android</div>
                      </div>
                    </div>
                  )}

                  {product.specs.aiMonitoring && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                      <Brain className="text-blue-600 mt-1" size={24} />
                      <div>
                        <div className="font-semibold mb-1">AI Monitoring</div>
                        <div className="text-gray-600">Tối ưu hóa tự động</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Egg Types */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="mb-3">Loại trứng hỗ trợ</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.eggTypes.map(type => (
                      <span
                        key={type}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="mb-3">Lợi ích sử dụng</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="text-green-600 mt-0.5" size={20} />
                      <span>Tiết kiệm 70% công sức so với ấp thủ công</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-600 mt-0.5" size={20} />
                      <span>Tỉ lệ nở cao hơn 20% so với phương pháp truyền thống</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-600 mt-0.5" size={20} />
                      <span>Giám sát từ xa 24/7 qua ứng dụng di động</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-green-600 mt-0.5" size={20} />
                      <span>Bảo hành 2 năm, hỗ trợ kỹ thuật miễn phí</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-5xl mb-2">{product.rating}</div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{product.reviews} đánh giá</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map(stars => {
                      const percentage = stars === 5 ? 65 : stars === 4 ? 25 : 10;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm w-12">{stars} sao</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                          {review.author[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{review.author}</span>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          {review.image && (
                            <img
                              src={review.image}
                              alt="Review"
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Warranty Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield size={40} />
            <div>
              <div className="text-xl mb-1">Bảo hành 2 năm chính hãng</div>
              <div className="text-blue-100">Hỗ trợ kỹ thuật 24/7 - Đổi mới trong 7 ngày</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}