import { useEffect, useState } from 'react';
import { ArrowRight, Star, Shield, Zap, Thermometer, Droplets, Wifi, CheckCircle, ChevronDown, Loader2, AlertCircle, Tag } from 'lucide-react';
import { ApiIncubatorModel, getPublicIncubatorModels } from '../services/api';

type LandingPageProps = {
  onExplore: () => void;
  onLogin: () => void;
  onViewProduct?: (modelId: string) => void;
};

const features = [
  {
    icon: Thermometer,
    title: 'Kiểm soát nhiệt độ thông minh',
    desc: 'Duy trì nhiệt độ ổn định tự động, đảm bảo môi trường lý tưởng xuyên suốt chu kỳ ấp.',
  },
  {
    icon: Droplets,
    title: 'Điều chỉnh độ ẩm tự động',
    desc: 'Cảm biến độ ẩm chính xác cao, duy trì điều kiện tối ưu mà không cần can thiệp thủ công.',
  },
  {
    icon: Wifi,
    title: 'Giám sát từ xa qua App',
    desc: 'Theo dõi và điều chỉnh thông số ngay trên điện thoại bất kỳ lúc nào, bất kỳ nơi đâu.',
  },
  {
    icon: Zap,
    title: 'Tiết kiệm điện năng',
    desc: 'Công nghệ cách nhiệt tiên tiến giảm đáng kể điện năng tiêu thụ so với máy ấp truyền thống.',
  },
  {
    icon: Shield,
    title: 'Bảo hành chính hãng',
    desc: 'Bảo hành toàn diện, hỗ trợ kỹ thuật tận nơi, cam kết đồng hành cùng khách hàng lâu dài.',
  },
  {
    icon: Star,
    title: 'Tỷ lệ nở cao vượt trội',
    desc: 'Hàng nghìn khách hàng ghi nhận tỷ lệ nở vượt trội nhờ công nghệ kiểm soát môi trường của IncuSmart.',
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function ProductCard({ model, onExplore }: { model: ApiIncubatorModel; onExplore: () => void }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
      onClick={onExplore}
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1569944405467-f040d1c3c7b0?w=600&q=80"
          alt={model.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
        <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
          {model.modelCode}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
          {model.name}
        </h3>
        {model.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {model.description}
          </p>
        )}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 mb-0.5">Giá niêm yết</div>
            <div className="text-blue-600 font-bold text-lg">{formatPrice(model.unitPrice)}</div>
          </div>
          <span className="flex items-center gap-1 text-blue-600 text-sm font-medium">
            Chi tiết <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ onExplore, onLogin }: LandingPageProps) {
  const [products, setProducts] = useState<ApiIncubatorModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicIncubatorModels({ pageSize: 6 })
      .then((res) => {
        if (res.statusCode === '200' && res.data) {
          setProducts(res.data.items);
        } else {
          setError(res.message || 'Không thể tải danh sách sản phẩm.');
        }
      })
      .catch(() => setError('Không thể kết nối đến máy chủ.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-blue-500/30 border border-blue-400/40 rounded-full text-sm text-blue-200 mb-6">
              Giải pháp máy ấp trứng thông minh
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Máy Ấp Trứng{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                IncuSmart
              </span>
              <br />
              Nâng Tầm Chăn Nuôi
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
              Công nghệ kiểm soát nhiệt độ, độ ẩm tự động và giám sát từ xa — tin dùng bởi hàng
              nghìn hộ chăn nuôi trên toàn quốc.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onExplore}
                className="flex items-center gap-2 px-8 py-4 bg-white text-blue-900 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg text-lg"
              >
                Khám phá sản phẩm <ArrowRight size={20} />
              </button>
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors text-lg"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center pb-8">
          <ChevronDown size={32} className="text-white/40 animate-bounce" />
        </div>
      </section>

      {/* Real Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Danh mục máy ấp trứng IncuSmart — chất lượng được kiểm chứng thực tế.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-blue-600" />
              <span className="ml-3 text-gray-500">Đang tải sản phẩm...</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-10 text-gray-400">Chưa có sản phẩm nào được công bố.</div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((model) => (
                  <ProductCard key={model.id} model={model} onExplore={onExplore} />
                ))}
              </div>

              <div className="text-center mt-10">
                <button
                  onClick={onExplore}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg shadow-md"
                >
                  <Tag size={18} />
                  Xem tất cả sản phẩm
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn IncuSmart?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Thiết kế dựa trên nhu cầu thực tế của người chăn nuôi Việt Nam, kết hợp công nghệ
              tiên tiến và độ bền vượt trội.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <f.icon size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Được tin dùng trên toàn quốc
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  'Giao hàng tận nơi, lắp đặt hướng dẫn miễn phí',
                  'Bảo hành toàn diện, hỗ trợ kỹ thuật nhanh chóng',
                  'Đặt hàng trực tuyến dễ dàng, theo dõi đơn hàng realtime',
                  'Thanh toán linh hoạt — đặt cọc hoặc thanh toán toàn bộ',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Đăng ký ngay <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Anh Minh Tuấn', loc: 'Đồng Nai', text: 'Máy ổn định, tỷ lệ nở ổn định sau nhiều mùa vụ. Rất hài lòng.' },
                { name: 'Chị Hương', loc: 'Bình Dương', text: 'App theo dõi tiện lợi, đi vắng vẫn kiểm soát được máy qua điện thoại.' },
                { name: 'Anh Văn Lợi', loc: 'Cần Thơ', text: 'Nhân viên hỗ trợ nhiệt tình, hướng dẫn cài đặt rõ ràng từ đầu.' },
                { name: 'Chị Thu Ba', loc: 'Tiền Giang', text: 'Đã thử nhiều hãng khác, IncuSmart vẫn là lựa chọn tốt nhất của tôi.' },
              ].map((r) => (
                <div key={r.name} className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">"{r.text}"</p>
                  <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                  <div className="text-gray-400 text-xs">{r.loc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng đặt hàng?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Đăng ký tài khoản để xem đầy đủ thông số kỹ thuật, nhận tư vấn miễn phí và đặt hàng
            trực tuyến dễ dàng.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onLogin}
              className="px-10 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-lg shadow-md"
            >
              Đăng ký / Đăng nhập
            </button>
            <button
              onClick={onExplore}
              className="px-10 py-4 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors text-lg"
            >
              Xem sản phẩm
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
