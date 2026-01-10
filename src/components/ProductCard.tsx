import { ShoppingCart, Eye, Star, TrendingUp } from 'lucide-react';
import { Product } from '../App';

type ProductCardProps = {
  product: Product;
  onViewProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
};

export function ProductCard({ product, onViewProduct, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'household': 'Hộ gia đình',
      'small-farm': 'Trang trại nhỏ',
      'medium-farm': 'Trang trại vừa',
      'large-farm': 'Trang trại lớn',
    };
    return labels[category] || category;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && product.preOrder && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
            Đặt trước
          </div>
        )}
        {product.specs.aiMonitoring && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm">
            AI
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded mb-2">
          {getCategoryLabel(product.category)}
        </div>

        {/* Product Name */}
        <h3 className="text-lg mb-2 line-clamp-1">{product.name}</h3>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Sức chứa: {product.capacity}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Công suất: {product.power}W</span>
          </div>
        </div>

        {/* Hatch Rate */}
        <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg">
          <TrendingUp size={16} className="text-green-600" />
          <span className="text-sm text-green-700">
            Tỉ lệ ấp nở: <strong>{product.hatchRate}%</strong>
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews} đánh giá)</span>
          <span className="text-sm text-gray-400">• {product.soldCount} đã bán</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl text-blue-600">{formatPrice(product.price)}</div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewProduct(product)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Eye size={18} />
            <span>Chi tiết</span>
          </button>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart size={18} />
              <span>Mua ngay</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}