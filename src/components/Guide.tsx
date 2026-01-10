import { BookOpen, PlayCircle, FileText, Download, AlertCircle, CheckCircle2, Thermometer, Droplets, Clock } from 'lucide-react';
import { useState } from 'react';

export function Guide() {
  const [activeGuide, setActiveGuide] = useState<'setup' | 'operation' | 'maintenance' | 'troubleshooting'>('setup');

  const guides = [
    {
      id: 'setup',
      title: 'Hướng dẫn lắp đặt',
      icon: BookOpen,
      color: 'blue',
    },
    {
      id: 'operation',
      title: 'Vận hành máy',
      icon: PlayCircle,
      color: 'green',
    },
    {
      id: 'maintenance',
      title: 'Bảo trì & vệ sinh',
      icon: FileText,
      color: 'purple',
    },
    {
      id: 'troubleshooting',
      title: 'Xử lý sự cố',
      icon: AlertCircle,
      color: 'orange',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl mb-4">Hướng dẫn sử dụng</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Tài liệu chi tiết giúp bạn sử dụng máy ấp trứng hiệu quả và đạt tỷ lệ nở cao nhất
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Access */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon;
            const isActive = activeGuide === guide.id;
            return (
              <button
                key={guide.id}
                onClick={() => setActiveGuide(guide.id as any)}
                className={`p-6 rounded-xl text-left transition-all ${
                  isActive
                    ? `bg-${guide.color}-600 text-white shadow-lg scale-105`
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <Icon size={32} className={`mb-3 ${isActive ? 'text-white' : `text-${guide.color}-600`}`} />
                <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {guide.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Setup Guide */}
        {activeGuide === 'setup' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <h2 className="text-3xl">Hướng dẫn lắp đặt máy ấp trứng</h2>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-3">Chuẩn bị vị trí lắp đặt</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Chọn vị trí phẳng, khô ráo, thoáng mát, tránh ánh nắng trực tiếp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Nhiệt độ phòng từ 20-28°C, độ ẩm không quá 80%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Khoảng cách tối thiểu 30cm xung quanh máy để thông gió</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Nguồn điện ổn định 220V, có chống sét lan truyền</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-3">Lắp đặt phụ kiện</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Lắp khay đựng trứng vào vị trí đã định sẵn trong máy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Kết nối cảm biến nhiệt độ và độ ẩm với mainboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Đổ nước vào khay chứa nước, kiểm tra mức nước</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Kiểm tra motor đảo trứng hoạt động trơn tru</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-3">Khởi động và cài đặt</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Cắm điện và bật công tắc nguồn chính</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Chờ 2-3 phút để hệ thống khởi động hoàn toàn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Kết nối WiFi và tải App điều khiển trên điện thoại</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Chạy thử máy 24 giờ không có trứng để kiểm tra</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Video Tutorial */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg mb-4">Video hướng dẫn chi tiết</h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <PlayCircle size={64} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operation Guide */}
        {activeGuide === 'operation' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <PlayCircle size={24} />
              </div>
              <h2 className="text-3xl">Vận hành máy ấp trứng</h2>
            </div>

            <div className="space-y-8">
              {/* Temperature Settings */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Thermometer size={24} className="text-red-600" />
                  <h3 className="text-xl">Cài đặt nhiệt độ</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="font-semibold mb-2">Trứng gà</div>
                    <div className="text-2xl text-red-600 mb-1">37.5-38°C</div>
                    <div className="text-sm text-gray-600">Thời gian: 21 ngày</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="font-semibold mb-2">Trứng vịt</div>
                    <div className="text-2xl text-red-600 mb-1">37.2-37.8°C</div>
                    <div className="text-sm text-gray-600">Thời gian: 28 ngày</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="font-semibold mb-2">Trứng cút</div>
                    <div className="text-2xl text-red-600 mb-1">37.5-38°C</div>
                    <div className="text-sm text-gray-600">Thời gian: 17 ngày</div>
                  </div>
                </div>
              </div>

              {/* Humidity Settings */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Droplets size={24} className="text-blue-600" />
                  <h3 className="text-xl">Cài đặt độ ẩm</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-semibold mb-1">Giai đoạn 1-18 ngày</div>
                      <div className="text-sm text-gray-600">Giai đoạn phát triển phôi</div>
                    </div>
                    <div className="text-2xl text-blue-600">55-60%</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-semibold mb-1">Giai đoạn 19-21 ngày</div>
                      <div className="text-sm text-gray-600">Giai đoạn nở</div>
                    </div>
                    <div className="text-2xl text-blue-600">65-75%</div>
                  </div>
                </div>
              </div>

              {/* Daily Checklist */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={24} className="text-purple-600" />
                  <h3 className="text-xl">Kiểm tra hàng ngày</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    <span>Kiểm tra nhiệt độ và độ ẩm trên màn hình</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    <span>Kiểm tra mức nước trong khay</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    <span>Quan sát motor đảo trứng hoạt động</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    <span>Soi trứng vào ngày 7 và 14 để loại trứng hỏng</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Guide */}
        {activeGuide === 'maintenance' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <FileText size={24} />
              </div>
              <h2 className="text-3xl">Bảo trì & Vệ sinh</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-lg mb-4">Sau mỗi lứa ấp</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Vệ sinh toàn bộ khay đựng trứng bằng nước sạch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Lau sạch bên trong máy, không để nước vào bo mạch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Khử trùng bằng dung dịch khử trùng chuyên dụng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Để máy khô hoàn toàn trước khi sử dụng lại</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg mb-4">Bảo trì định kỳ 3 tháng</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Kiểm tra và vệ sinh quạt thông gió</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Kiểm tra độ chính xác của cảm biến nhiệt độ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Tra dầu bôi trơn cho motor đảo trứng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Kiểm tra dây điện và các kết nối</span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-lg mb-4">Lưu ý quan trọng</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <AlertCircle size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Không được rửa trực tiếp bằng vòi nước áp lực cao</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Không sử dụng hóa chất tẩy rửa mạnh</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Cắt nguồn điện trước khi vệ sinh</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Troubleshooting Guide */}
        {activeGuide === 'troubleshooting' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-3xl">Xử lý sự cố thường gặp</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  problem: 'Máy không lên nhiệt',
                  solutions: [
                    'Kiểm tra nguồn điện có cắm chắc chắn không',
                    'Kiểm tra cầu chì và công tắc nguồn',
                    'Kiểm tra thanh nhiệt có bị hỏng không',
                    'Liên hệ bộ phận kỹ thuật nếu vấn đề vẫn còn',
                  ],
                },
                {
                  problem: 'Nhiệt độ không ổn định',
                  solutions: [
                    'Kiểm tra vị trí đặt máy có bị gió thổi trực tiếp không',
                    'Kiểm tra cảm biến nhiệt độ có bị lỏng không',
                    'Đảm bảo cửa máy đóng kín',
                    'Hiệu chuẩn lại cảm biến qua App',
                  ],
                },
                {
                  problem: 'Motor đảo trứng không hoạt động',
                  solutions: [
                    'Kiểm tra kết nối dây motor với mainboard',
                    'Kiểm tra khay trứng có bị kẹt không',
                    'Reset máy và khởi động lại',
                    'Thay motor nếu cần thiết',
                  ],
                },
                {
                  problem: 'Độ ẩm thấp hơn quy định',
                  solutions: [
                    'Thêm nước vào khay đựng nước',
                    'Kiểm tra khay nước có bị rò rỉ không',
                    'Đặt thêm khăn ẩm trong máy',
                    'Kiểm tra hệ thống phun sương',
                  ],
                },
                {
                  problem: 'Không kết nối được WiFi/App',
                  solutions: [
                    'Kiểm tra WiFi 2.4GHz có hoạt động không',
                    'Reset kết nối WiFi trên máy',
                    'Cập nhật phiên bản App mới nhất',
                    'Khởi động lại router WiFi',
                  ],
                },
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg mb-3 text-orange-600">❗ {item.problem}</h3>
                  <div className="pl-4">
                    <div className="font-semibold mb-2">Cách xử lý:</div>
                    <ul className="space-y-2">
                      {item.solutions.map((solution, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <span className="font-semibold">{i + 1}.</span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg mb-3">Liên hệ hỗ trợ kỹ thuật</h3>
              <div className="space-y-2 text-gray-700">
                <p>📞 Hotline: 1900-xxxx (8:00 - 20:00 hàng ngày)</p>
                <p>📧 Email: support@mayaptrung.vn</p>
                <p>💬 Zalo/Viber: 0912345678</p>
                <p>🏢 Địa chỉ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</p>
              </div>
            </div>
          </div>
        )}

        {/* Download Resources */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mt-12">
          <h2 className="text-2xl mb-6 text-center">Tải tài liệu hướng dẫn</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <Download size={24} />
              <div className="text-left">
                <div className="font-semibold">Sổ tay sử dụng</div>
                <div className="text-sm text-blue-100">PDF - 5.2MB</div>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <Download size={24} />
              <div className="text-left">
                <div className="font-semibold">Video hướng dẫn</div>
                <div className="text-sm text-blue-100">MP4 - 125MB</div>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <Download size={24} />
              <div className="text-left">
                <div className="font-semibold">Phiếu bảo hành</div>
                <div className="text-sm text-blue-100">PDF - 1.2MB</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
