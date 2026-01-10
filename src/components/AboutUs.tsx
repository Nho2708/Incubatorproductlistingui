import { Award, Users, Target, TrendingUp, Shield, Heart, Clock, Globe } from 'lucide-react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl mb-4">Về chúng tôi</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Tiên phong trong công nghệ máy ấp trứng thông minh, mang đến giải pháp chăn nuôi hiện đại cho nông dân Việt Nam
            </p>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80"
              alt="Factory"
              className="rounded-2xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl mb-6">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Được thành lập vào năm 2020, chúng tôi bắt đầu từ niềm đam mê cải thiện năng suất chăn nuôi gia cầm 
                của nông dân Việt Nam. Với đội ngũ kỹ sư giàu kinh nghiệm và tâm huyết, chúng tôi đã phát triển 
                dòng máy ấp trứng tích hợp công nghệ AI tiên tiến nhất.
              </p>
              <p>
                Sau 5 năm phát triển, sản phẩm của chúng tôi đã có mặt tại hơn 50 tỉnh thành trên cả nước, 
                phục vụ hơn 10,000 hộ chăn nuôi từ quy mô nhỏ đến trang trại lớn. Chúng tôi tự hào là đối tác 
                tin cậy giúp nông dân tăng năng suất lên đến 30% và tiết kiệm chi phí vận hành đáng kể.
              </p>
              <p>
                Với phương châm "Công nghệ vì cộng đồng", chúng tôi không ngừng nghiên cứu và phát triển 
                để mang đến những sản phẩm chất lượng cao với mức giá hợp lý nhất.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-4xl text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Khách hàng</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-4xl text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Tỉnh thành</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-4xl text-purple-600 mb-2">98%</div>
            <div className="text-gray-600">Hài lòng</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-4xl text-orange-600 mb-2">5+</div>
            <div className="text-gray-600">Năm kinh nghiệm</div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4">
              <Target size={28} />
            </div>
            <h3 className="text-2xl mb-4">Sứ mệnh</h3>
            <p className="text-gray-700">
              Cung cấp giải pháp công nghệ ấp trứng thông minh, giúp nông dân Việt Nam nâng cao năng suất, 
              tiết kiệm chi phí và phát triển bền vững. Chúng tôi cam kết đồng hành cùng người chăn nuôi 
              trên con đường hiện đại hóa nông nghiệp.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
            <div className="w-14 h-14 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-2xl mb-4">Tầm nhìn</h3>
            <p className="text-gray-700">
              Trở thành thương hiệu máy ấp trứng số 1 Việt Nam, được công nhận về chất lượng và công nghệ. 
              Mở rộng ra thị trường quốc tế, góp phần nâng tầm nông nghiệp Việt trên bản đồ thế giới 
              với những sản phẩm mang giá trị công nghệ cao.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} />
              </div>
              <h4 className="text-lg mb-2">Chất lượng</h4>
              <p className="text-sm text-gray-600">
                Cam kết sản phẩm chất lượng cao, được kiểm định nghiêm ngặt
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} />
              </div>
              <h4 className="text-lg mb-2">Tận tâm</h4>
              <p className="text-sm text-gray-600">
                Đặt lợi ích khách hàng lên hàng đầu, hỗ trợ 24/7
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} />
              </div>
              <h4 className="text-lg mb-2">Uy tín</h4>
              <p className="text-sm text-gray-600">
                Minh bạch trong kinh doanh, đúng cam kết với khách hàng
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe size={32} />
              </div>
              <h4 className="text-lg mb-2">Đổi mới</h4>
              <p className="text-sm text-gray-600">
                Không ngừng nghiên cứu và ứng dụng công nghệ mới
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-16">
          <h2 className="text-3xl text-center mb-12">Đội ngũ lãnh đạo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                NVA
              </div>
              <h4 className="text-xl mb-1">Nguyễn Văn A</h4>
              <div className="text-blue-600 mb-2">CEO & Founder</div>
              <p className="text-sm text-gray-600">
                15 năm kinh nghiệm trong lĩnh vực công nghệ nông nghiệp
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                TTB
              </div>
              <h4 className="text-xl mb-1">Trần Thị B</h4>
              <div className="text-green-600 mb-2">CTO</div>
              <p className="text-sm text-gray-600">
                Chuyên gia về AI và IoT, 12 năm kinh nghiệm
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                LVC
              </div>
              <h4 className="text-xl mb-1">Lê Văn C</h4>
              <div className="text-purple-600 mb-2">COO</div>
              <p className="text-sm text-gray-600">
                Quản lý vận hành xuất sắc, 10 năm kinh nghiệm
              </p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl mb-6">Chứng nhận & Giải thưởng</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-5xl mb-2">🏆</div>
              <div className="font-semibold mb-1">Top 10</div>
              <div className="text-sm text-blue-100">Startup Nông nghiệp 2024</div>
            </div>
            <div>
              <div className="text-5xl mb-2">✓</div>
              <div className="font-semibold mb-1">ISO 9001:2015</div>
              <div className="text-sm text-blue-100">Chứng nhận chất lượng</div>
            </div>
            <div>
              <div className="text-5xl mb-2">⭐</div>
              <div className="font-semibold mb-1">4.9/5.0</div>
              <div className="text-sm text-blue-100">Đánh giá khách hàng</div>
            </div>
            <div>
              <div className="text-5xl mb-2">🌱</div>
              <div className="font-semibold mb-1">Green Tech</div>
              <div className="text-sm text-blue-100">Công nghệ xanh 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
