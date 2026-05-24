import { ShoppingCart, Eye } from 'lucide-react';
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
        {!product.inStock && !product.preOrder && (
          <div className="absolute top-3 left-3 bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
            Ngừng bán
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
        {/* Product Name */}
        <h3 className="text-lg mb-2 line-clamp-2">{product.name}</h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.capacity > 0 && (
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
              {product.capacity} trứng
            </span>
          )}
          {product.hatchRate > 0 && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
              Tỉ lệ nở: {product.hatchRate}%
            </span>
          )}
          {product.rating > 0 && (
            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">
              ★ {product.rating} ({product.reviews})
            </span>
          )}
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
              disabled={!product.inStock && !product.preOrder}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              <span>{product.preOrder ? 'Đặt trước' : 'Mua ngay'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
