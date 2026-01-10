import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, User as UserIcon, LogOut, ShoppingBag } from 'lucide-react';
import { Product } from '../App';
import { User } from '../App';
import { products } from '../data/products';
import { ProductCard } from './ProductCard';
import { FilterPanel } from './FilterPanel';

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
  onLogin: (email: string, name: string) => void;
  onLogout: () => void;
};

export function ProductListing({ onViewProduct, onAddToCart, user, onLogin, onLogout }: ProductListingProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    capacities: [],
    categories: [],
    eggTypes: [],
    priceRange: [0, 20000000],
    automationLevels: [],
    availability: [],
    sortBy: 'popular',
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Capacity filter
    if (filters.capacities.length > 0) {
      filtered = filtered.filter(p => filters.capacities.includes(p.capacity));
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    // Egg types filter
    if (filters.eggTypes.length > 0) {
      filtered = filtered.filter(p =>
        filters.eggTypes.some(type => p.eggTypes.includes(type))
      );
    }

    // Price range filter
    filtered = filtered.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Automation level filter
    if (filters.automationLevels.length > 0) {
      filtered = filtered.filter(p =>
        filters.automationLevels.includes(p.automationLevel)
      );
    }

    // Availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(p => {
        if (filters.availability.includes('inStock') && p.inStock) return true;
        if (filters.availability.includes('preOrder') && p.preOrder) return true;
        return false;
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [searchQuery, filters]);

  const activeFiltersCount = 
    filters.capacities.length +
    filters.categories.length +
    filters.eggTypes.length +
    filters.automationLevels.length +
    filters.availability.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000000 ? 1 : 0);

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
              <option value="popular">Bán chạy nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao nhất</option>
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
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-gray-900">{filteredProducts.length}</span> sản phẩm
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm phù hợp</p>
            <button
              onClick={() => {
                setFilters({
                  capacities: [],
                  categories: [],
                  eggTypes: [],
                  priceRange: [0, 20000000],
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
            {filteredProducts.map(product => (
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