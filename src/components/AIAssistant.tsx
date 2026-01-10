import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Product } from '../App';
import { products } from '../data/products';

type AIAssistantProps = {
  onProductSelect: (product: Product) => void;
};

type Message = {
  id: string;
  type: 'user' | 'bot';
  content: string;
  suggestions?: string[];
  products?: Product[];
};

export function AIAssistant({ onProductSelect }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Xin chào! Tôi là trợ lý AI của Máy Ấp Trứng. Tôi có thể giúp bạn:',
      suggestions: [
        'Tìm máy phù hợp với nhu cầu',
        'So sánh các dòng máy',
        'Tư vấn công suất',
        'Hỗ trợ kỹ thuật',
      ],
    },
  ]);
  const [input, setInput] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const botMessage = generateBotResponse(messageText);
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const generateBotResponse = (userInput: string): Message => {
    const lower = userInput.toLowerCase();

    // Capacity recommendations
    if (lower.includes('gia đình') || lower.includes('nhỏ')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Với hộ gia đình, tôi khuyên bạn nên chọn máy 50-100 trứng. Dưới đây là các sản phẩm phù hợp:',
        products: products.filter(p => p.capacity <= 100),
      };
    }

    if (lower.includes('trang trại') || lower.includes('lớn') || lower.includes('500') || lower.includes('1000')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Với trang trại lớn, tôi khuyên bạn nên chọn máy 500-1000 trứng có AI monitoring:',
        products: products.filter(p => p.capacity >= 500),
      };
    }

    // AI features
    if (lower.includes('ai') || lower.includes('thông minh')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Các máy có AI sẽ tự động điều chỉnh nhiệt độ, độ ẩm và cảnh báo sớm các vấn đề. Đây là những sản phẩm có AI:',
        products: products.filter(p => p.specs.aiMonitoring),
      };
    }

    // Price comparison
    if (lower.includes('so sánh') || lower.includes('khác nhau')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Dưới đây là bảng so sánh các dòng máy phổ biến:\n\n' +
          '• Mini 50: ' + formatPrice(products[0].price) + ' - Phù hợp hộ gia đình\n' +
          '• Pro 200: ' + formatPrice(products[2].price) + ' - Trang trại nhỏ, có AI\n' +
          '• Smart 500: ' + formatPrice(products[3].price) + ' - Trang trại vừa, AI cao cấp\n\n' +
          'Bạn muốn xem chi tiết sản phẩm nào?',
        suggestions: ['Xem Mini 50', 'Xem Pro 200', 'Xem Smart 500'],
      };
    }

    // Price range
    if (lower.includes('giá') || lower.includes('rẻ') || lower.includes('tiết kiệm')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Tôi tìm thấy các sản phẩm theo mức giá:',
        products: products.sort((a, b) => a.price - b.price).slice(0, 3),
      };
    }

    // Technical support
    if (lower.includes('kỹ thuật') || lower.includes('hỗ trợ') || lower.includes('cài đặt')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Tôi có thể hỗ trợ bạn về:\n\n' +
          '✓ Hướng dẫn cài đặt và vận hành\n' +
          '✓ Điều chỉnh nhiệt độ và độ ẩm\n' +
          '✓ Kết nối app và thiết lập thông báo\n' +
          '✓ Xử lý sự cố thường gặp\n\n' +
          'Bạn cần hỗ trợ về vấn đề gì?',
        suggestions: [
          'Cách cài đặt nhiệt độ',
          'Kết nối app',
          'Xử lý sự cố',
        ],
      };
    }

    // Egg types
    if (lower.includes('trứng')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Các loại trứng khác nhau cần nhiệt độ và thời gian ấp khác nhau:\n\n' +
          '🐔 Trứng gà: 37.5°C, 21 ngày\n' +
          '🦆 Trứng vịt: 37.5°C, 28 ngày\n' +
          '🦢 Trứng ngỗng: 37.5°C, 30 ngày\n' +
          '🐦 Trứng chim: 37.5°C, 12-14 ngày\n\n' +
          'Bạn muốn ấp loại trứng nào?',
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: 'Tôi có thể giúp bạn tìm máy ấp trứng phù hợp. Bạn có thể cho tôi biết:\n\n' +
        '• Bạn cần máy cho hộ gia đình hay trang trại?\n' +
        '• Ngân sách của bạn là bao nhiêu?\n' +
        '• Bạn muốn máy có AI không?\n' +
        '• Bạn sẽ ấp loại trứng gì?',
      suggestions: [
        'Cho hộ gia đình',
        'Cho trang trại',
        'Máy có AI',
        'Giá rẻ nhất',
      ],
    };
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 group"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Trợ lý AI
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <div className="font-semibold">Trợ lý AI</div>
                <div className="text-xs text-blue-100">Luôn sẵn sàng hỗ trợ</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div key={message.id}>
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Cards */}
                {message.products && (
                  <div className="space-y-2 mt-2 ml-2">
                    {message.products.map(product => (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          onProductSelect(product);
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-sm mb-1">{product.name}</div>
                            <div className="text-xs text-gray-600 mb-1">
                              {product.capacity} trứng • {product.hatchRate}% tỉ lệ nở
                            </div>
                            <div className="text-blue-600 font-semibold">
                              {formatPrice(product.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim()}
                className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
