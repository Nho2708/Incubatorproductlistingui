import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Facebook, Youtube } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl mb-4">Liên hệ với chúng tôi</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ ngay để được tư vấn miễn phí!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Phone size={28} />
            </div>
            <h3 className="text-xl mb-3">Điện thoại</h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <span className="font-semibold">Hotline:</span>
                <a href="tel:1900xxxx" className="text-blue-600 hover:underline">1900-xxxx</a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">Zalo:</span>
                <a href="tel:0912345678" className="text-blue-600 hover:underline">0912345678</a>
              </p>
              <p className="text-sm text-gray-500 mt-3">
                <Clock size={16} className="inline mr-1" />
                8:00 - 20:00 hàng ngày
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <Mail size={28} />
            </div>
            <h3 className="text-xl mb-3">Email</h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Tư vấn:</span><br />
                <a href="mailto:sales@mayaptrung.vn" className="text-blue-600 hover:underline">
                  sales@mayaptrung.vn
                </a>
              </p>
              <p>
                <span className="font-semibold">Hỗ trợ:</span><br />
                <a href="mailto:support@mayaptrung.vn" className="text-blue-600 hover:underline">
                  support@mayaptrung.vn
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-3">
                Phản hồi trong vòng 2 giờ
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl mb-3">Địa chỉ</h3>
            <div className="space-y-2 text-gray-700">
              <p className="mb-3">
                <span className="font-semibold">Văn phòng & Showroom:</span><br />
                123 Đường ABC, Phường XYZ<br />
                Quận 1, TP. Hồ Chí Minh
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 hover:underline text-sm"
              >
                Xem trên bản đồ →
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl mb-6">Gửi tin nhắn cho chúng tôi</h2>
            
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={32} />
                </div>
                <h3 className="text-xl mb-2">Gửi thành công!</h3>
                <p className="text-gray-600">
                  Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0912345678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Chủ đề <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">Tư vấn chung</option>
                    <option value="product">Hỏi về sản phẩm</option>
                    <option value="price">Báo giá</option>
                    <option value="warranty">Bảo hành</option>
                    <option value="technical">Hỗ trợ kỹ thuật</option>
                    <option value="partnership">Hợp tác kinh doanh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập nội dung cần tư vấn..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  <span>Gửi tin nhắn</span>
                </button>
              </form>
            )}
          </div>

          {/* Map & Additional Info */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <MapPin size={64} className="text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-lg mb-2">Ghé thăm showroom</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Đến trực tiếp showroom để xem sản phẩm thực tế và được tư vấn chi tiết bởi đội ngũ chuyên gia.
                </p>
                <button className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                  Chỉ đường
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={24} className="text-blue-600" />
                <h3 className="text-lg">Giờ làm việc</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 2 - Thứ 6:</span>
                  <span className="font-semibold">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thứ 7:</span>
                  <span className="font-semibold">8:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chủ nhật:</span>
                  <span className="font-semibold">8:00 - 12:00</span>
                </div>
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Đang mở cửa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
              <h3 className="text-lg mb-4">Kết nối với chúng tôi</h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Facebook size={20} />
                  <span>Facebook</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Youtube size={20} />
                  <span>YouTube</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <MessageCircle size={20} />
                  <span>Zalo</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl mb-6 text-center">Câu hỏi thường gặp</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Thời gian giao hàng là bao lâu?</h4>
              <p className="text-gray-600 text-sm">
                Giao hàng trong vòng 2-5 ngày tùy khu vực. Nội thành TP.HCM và Hà Nội trong 1-2 ngày.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Có hỗ trợ lắp đặt tận nơi không?</h4>
              <p className="text-gray-600 text-sm">
                Có, chúng tôi hỗ trợ lắp đặt và hướng dẫn sử dụng miễn phí tại nhà.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Chính sách bảo hành như thế nào?</h4>
              <p className="text-gray-600 text-sm">
                Bảo hành 2 năm chính hãng, đổi mới trong 7 ngày nếu có lỗi từ nhà sản xuất.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Có thể đặt cọc trước không?</h4>
              <p className="text-gray-600 text-sm">
                Có, bạn có thể đặt cọc 30% và thanh toán phần còn lại khi nhận hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
