import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, Download, MessageSquare } from 'lucide-react';
import { Order } from '../App';

type MyOrdersProps = {
  user: any;
};

export function MyOrders({ user }: MyOrdersProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'delivered' | 'completed'>('all');

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ORD-2026010001',
      product: {
        id: 'inc-200',
        name: 'Máy Ấp Trứng Pro 200',
        capacity: 200,
        power: 180,
        price: 4500000,
        image: 'https://images.unsplash.com/photo-1598901394090-8f6e4b2e0b6a?w=800&q=80',
        category: 'small-farm',
        hatchRate: 90,
        description: '',
        specs: {
          maxCapacity: 200,
          tempRange: '34-41°C',
          humidityRange: '35-80%',
          powerConsumption: '180W',
          eggTurning: 'Tự động 1 giờ/lần',
          aiMonitoring: true,
          appConnection: true,
        },
        eggTypes: [],
        automationLevel: 'ai-assisted',
        inStock: true,
        preOrder: false,
        rating: 4.8,
        reviews: 189,
        soldCount: 320,
      },
      quantity: 2,
      total: 9000000,
      deposit: 2700000,
      remaining: 6300000,
      status: 'delivered',
      purchaseType: 'deposit',
    },
    {
      id: 'ORD-2026010002',
      product: {
        id: 'inc-100',
        name: 'Máy Ấp Trứng Gia Đình 100',
        capacity: 100,
        power: 120,
        price: 2800000,
        image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80',
        category: 'household',
        hatchRate: 88,
        description: '',
        specs: {
          maxCapacity: 100,
          tempRange: '35-40°C',
          humidityRange: '40-75%',
          powerConsumption: '120W',
          eggTurning: 'Tự động 2 giờ/lần',
          aiMonitoring: false,
          appConnection: true,
        },
        eggTypes: [],
        automationLevel: 'full-auto',
        inStock: true,
        preOrder: false,
        rating: 4.7,
        reviews: 256,
        soldCount: 680,
      },
      quantity: 1,
      total: 2800000,
      status: 'confirmed',
      purchaseType: 'full',
    },
    {
      id: 'ORD-2025123001',
      product: {
        id: 'inc-500',
        name: 'Máy Ấp Trứng Smart 500',
        capacity: 500,
        power: 300,
        price: 8900000,
        image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80',
        category: 'medium-farm',
        hatchRate: 92,
        description: '',
        specs: {
          maxCapacity: 500,
          tempRange: '34-42°C',
          humidityRange: '30-85%',
          powerConsumption: '300W',
          eggTurning: 'Tự động 45 phút/lần',
          aiMonitoring: true,
          appConnection: true,
        },
        eggTypes: [],
        automationLevel: 'ai-assisted',
        inStock: true,
        preOrder: false,
        rating: 4.9,
        reviews: 145,
        soldCount: 210,
      },
      quantity: 1,
      total: 8900000,
      status: 'completed',
      purchaseType: 'full',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
      confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package },
      delivered: { label: 'Đã giao hàng', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    };
    return statusMap[status] || statusMap.pending;
  };

  const filteredOrders = activeTab === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeTab);

  const orderCounts = {
    all: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'pending').length,
    confirmed: mockOrders.filter(o => o.status === 'confirmed').length,
    delivered: mockOrders.filter(o => o.status === 'delivered').length,
    completed: mockOrders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2">Đơn hàng của tôi</h1>
          <p className="text-gray-600">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tất cả ({orderCounts.all})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Chờ xác nhận ({orderCounts.pending})
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'confirmed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Đã xác nhận ({orderCounts.confirmed})
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'delivered'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Đã giao hàng ({orderCounts.delivered})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hoàn thành ({orderCounts.completed})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'all' 
                ? 'Bạn chưa có đơn hàng nào' 
                : `Không có đơn hàng ${getStatusInfo(activeTab).label.toLowerCase()}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Mã đơn hàng</div>
                        <div className="font-semibold text-blue-600">{order.id}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color} flex items-center gap-1.5`}>
                        <StatusIcon size={16} />
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                        <Eye size={16} />
                        <span>Chi tiết</span>
                      </button>
                      <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2">
                        <MessageSquare size={16} />
                        <span>Liên hệ</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{order.product.name}</h3>
                        <div className="text-sm text-gray-600 mb-2">
                          Số lượng: {order.quantity}
                        </div>
                        
                        {/* Purchase Type */}
                        {order.purchaseType === 'deposit' ? (
                          <div className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full border border-orange-200">
                            Đặt cọc 30%
                          </div>
                        ) : (
                          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                            Thanh toán đủ
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Tổng tiền</div>
                        <div className="text-2xl text-blue-600">{formatPrice(order.total)}</div>
                        {order.purchaseType === 'deposit' && order.remaining && (
                          <div className="text-sm text-orange-600 mt-1">
                            Còn lại: {formatPrice(order.remaining)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-8">
                        <div className={`flex items-center gap-2 ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'delivered' || order.status === 'completed' ? 'text-blue-600' : 'text-gray-400'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'delivered' || order.status === 'completed' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <CheckCircle size={18} />
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Đặt hàng</div>
                            <div className="text-xs text-gray-500">09/01/2026</div>
                          </div>
                        </div>

                        <div className={`flex-1 h-0.5 ${order.status === 'confirmed' || order.status === 'delivered' || order.status === 'completed' ? 'bg-blue-600' : 'bg-gray-200'}`} />

                        <div className={`flex items-center gap-2 ${order.status === 'confirmed' || order.status === 'delivered' || order.status === 'completed' ? 'text-blue-600' : 'text-gray-400'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'confirmed' || order.status === 'delivered' || order.status === 'completed' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <Package size={18} />
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Xác nhận</div>
                            {(order.status === 'confirmed' || order.status === 'delivered' || order.status === 'completed') && (
                              <div className="text-xs text-gray-500">09/01/2026</div>
                            )}
                          </div>
                        </div>

                        <div className={`flex-1 h-0.5 ${order.status === 'delivered' || order.status === 'completed' ? 'bg-blue-600' : 'bg-gray-200'}`} />

                        <div className={`flex items-center gap-2 ${order.status === 'delivered' || order.status === 'completed' ? 'text-blue-600' : 'text-gray-400'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'delivered' || order.status === 'completed' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <Truck size={18} />
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Giao hàng</div>
                            {(order.status === 'delivered' || order.status === 'completed') && (
                              <div className="text-xs text-gray-500">10/01/2026</div>
                            )}
                          </div>
                        </div>

                        <div className={`flex-1 h-0.5 ${order.status === 'completed' ? 'bg-green-600' : 'bg-gray-200'}`} />

                        <div className={`flex items-center gap-2 ${order.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <CheckCircle size={18} />
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">Hoàn thành</div>
                            {order.status === 'completed' && (
                              <div className="text-xs text-gray-500">15/01/2026</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {order.status === 'completed' && (
                      <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                          <Download size={18} />
                          <span>Tải QR Code</span>
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Mua lại
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Đánh giá
                        </button>
                      </div>
                    )}

                    {order.status === 'delivered' && order.purchaseType === 'deposit' && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-3">
                          <div className="font-semibold text-orange-900 mb-1">
                            Thanh toán phần còn lại
                          </div>
                          <div className="text-sm text-orange-700">
                            Vui lòng thanh toán {formatPrice(order.remaining!)} để hoàn tất đơn hàng và nhận QR code kích hoạt
                          </div>
                        </div>
                        <button className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          Thanh toán ngay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
