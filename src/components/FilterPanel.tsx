import { X } from 'lucide-react';
import { FilterState } from './ProductListing';

type FilterPanelProps = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose: () => void;
};

export function FilterPanel({ filters, onFiltersChange, onClose }: FilterPanelProps) {
  const capacityOptions = [50, 100, 200, 500, 1000];
  
  const categoryOptions = [
    { value: 'household', label: 'Hộ gia đình' },
    { value: 'small-farm', label: 'Trang trại nhỏ' },
    { value: 'medium-farm', label: 'Trang trại vừa' },
    { value: 'large-farm', label: 'Trang trại lớn' },
  ];

  const eggTypeOptions = [
    'Trứng gà',
    'Trứng vịt',
    'Trứng ngỗng',
    'Trứng chim',
    'Trứng đà điểu',
  ];

  const automationOptions = [
    { value: 'semi-auto', label: 'Bán tự động' },
    { value: 'full-auto', label: 'Tự động hoàn toàn' },
    { value: 'ai-assisted', label: 'Có AI hỗ trợ' },
  ];

  const availabilityOptions = [
    { value: 'inStock', label: 'Còn hàng' },
    { value: 'preOrder', label: 'Đặt trước' },
  ];

  const toggleArrayFilter = (array: any[], value: any) => {
    return array.includes(value)
      ? array.filter(v => v !== value)
      : [...array, value];
  };

  const resetFilters = () => {
    onFiltersChange({
      capacities: [],
      categories: [],
      eggTypes: [],
      priceRange: [0, 20000000],
      automationLevels: [],
      availability: [],
      sortBy: filters.sortBy,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl">Bộ lọc sản phẩm</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Capacity Filter */}
          <div>
            <h3 className="mb-3">Sức chứa</h3>
            <div className="space-y-2">
              {capacityOptions.map(capacity => (
                <label key={capacity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.capacities.includes(capacity)}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        capacities: toggleArrayFilter(filters.capacities, capacity),
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span>{capacity} trứng</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-3">Đối tượng sử dụng</h3>
            <div className="space-y-2">
              {categoryOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(option.value)}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        categories: toggleArrayFilter(filters.categories, option.value),
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Egg Types Filter */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-3">Loại trứng hỗ trợ</h3>
            <div className="space-y-2">
              {eggTypeOptions.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.eggTypes.includes(type)}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        eggTypes: toggleArrayFilter(filters.eggTypes, type),
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-3">Khoảng giá</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="20000000"
                step="500000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Automation Level Filter */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-3">Mức độ tự động</h3>
            <div className="space-y-2">
              {automationOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.automationLevels.includes(option.value)}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        automationLevels: toggleArrayFilter(filters.automationLevels, option.value),
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-3">Tình trạng</h3>
            <div className="space-y-2">
              {availabilityOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(option.value)}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        availability: toggleArrayFilter(filters.availability, option.value),
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={resetFilters}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Xóa bộ lọc
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
