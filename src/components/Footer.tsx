import { Phone, Mail, MapPin, Facebook, Youtube, MessageCircle, Instagram } from 'lucide-react';

type FooterProps = {
  onNavigate: (view: string) => void;
};

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="text-lg font-bold text-white">Máy Ấp Trứng</div>
            </div>
            <p className="text-sm mb-4 text-gray-400">
              Chuyên cung cấp máy ấp trứng công nghệ AI hàng đầu Việt Nam. 
              Cam kết chất lượng, hiệu suất cao, hỗ trợ 24/7.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <Youtube size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white mb-4">Sản phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">Máy ấp 50 trứng</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Máy ấp 100 trứng</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Máy ấp 200 trứng</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Máy ấp 500 trứng</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Máy ấp 1000 trứng</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Phụ kiện & linh kiện</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Chính sách bảo hành</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Vận chuyển & giao hàng</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Liên hệ hỗ trợ</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                <a href="tel:1900xxxx" className="hover:text-white transition-colors">
                  Hotline: 1900-xxxx
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <a href="mailto:support@mayaptrung.vn" className="hover:text-white transition-colors">
                  support@mayaptrung.vn
                </a>
              </li>
            </ul>

            {/* Business Hours */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <div className="text-sm font-semibold text-white mb-1">Giờ làm việc</div>
              <div className="text-xs text-gray-400">
                Thứ 2 - Chủ nhật: 8:00 - 20:00
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="text-center md:text-left">
              © 2026 Máy Ấp Trứng. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Đã đăng ký<br/>Bộ Công Thương</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Bảo hành<br/>chính hãng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
              <span>Giao hàng<br/>toàn quốc</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Hỗ trợ<br/>24/7</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}