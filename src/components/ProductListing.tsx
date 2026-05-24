import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, AlertCircle, Loader2 } from 'lucide-react';
import { Product } from '../App';
import { User } from '../App';
import { ProductCard } from './ProductCard';
import { FilterPanel } from './FilterPanel';
import { getIncubatorModels, ApiIncubatorModel } from '../services/api';

export type FilterState = {
  capacities: number[];
  categories: string[];
  eggTypes: string[];
  priceRange: [number, number];
  automationLevels: string[];
  availability: string[];
  sortBy: string;
};

type ProductListingProps = {
  onViewProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
};

function mapApiModelToProduct(model: ApiIncubatorModel): Product {
  return {
    id: model.id,
    name: model.name,
    capacity: 0,
    power: 0,
    price: model.unitPrice,
    image: 'https://images.unsplash.com/photo-1569944405467-f040d1c3c7b0?w=800&q=80',
    category: 'household',
    hatchRate: 0,
    description: model.description || '',
    specs: {
      maxCapacity: 0,
      tempRange: '',
      humidityRange: '',
      powerConsumption: '',
      eggTurning: '',
      aiMonitoring: false,
      appConnection: false,
    },
    eggTypes: [],
    automationLevel: 'semi-auto',
    inStock: model.status === 'ACTIVE',
    preOrder: model.status !== 'ACTIVE',
    rating: 0,
    reviews: 0,
    soldCount: 0,
  };
}

export function ProductListing({ onViewProduct, onAddToCart }: ProductListingProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    capacities: [],
    categories: [],
    eggTypes: [],
    priceRange: [0, 100000000],
    automationLevels: [],
    availability: [],
    sortBy: 'popular',
  });

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getIncubatorModels({
          search: searchQuery || undefined,
          page: 1,
          pageSize: 100,
        });
        if (cancelled) return;
        if (res.statusCode !== '200' || !res.data) {
          setError(res.message || 'Không thể tải danh sách sản phẩm.');
          return;
        }
        setProducts(res.data.items.map(mapApiModelToProduct));
      } catch {
        if (!cancelled) setError('Lỗi kết nối. Vui lòng thử lại.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.availability.length > 0) {
      filtered = filtered.filter((p) => {
        if (filters.availability.includes('inStock') && p.inStock) return true;
        if (filters.availability.includes('preOrder') && p.preOrder) return true;
        return false;
      });
    }

    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [products, filters]);

  const activeFiltersCount =
    filters.availability.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl mb-4">Sản phẩm</h1>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm máy ấp trứng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter & Sort Bar */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors relative"
            >
              <SlidersHorizontal size={18} />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Results Info */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {!loading && !error && (
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{filteredProducts.length}</span> sản phẩm
          </p>
        )}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={40} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-500 text-lg">Đang tải sản phẩm...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 text-center">
            <AlertCircle size={48} className="text-red-400 mb-4" />
            <p className="text-gray-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm phù hợp</p>
            <button
              onClick={() => {
                setFilters({
                  capacities: [],
                  categories: [],
                  eggTypes: [],
                  priceRange: [0, 100000000],
                  automationLevels: [],
                  availability: [],
                  sortBy: 'popular',
                });
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onViewProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
