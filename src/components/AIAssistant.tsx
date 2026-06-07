import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { tokenStorage } from '../services/api';
import { User } from '../App';

const CHAT_BASE = 'https://api-incusmart.io.vn';

const QUICK_PROMPTS = [
  'Nhiệt độ ấp trứng gà bao nhiêu?',
  'Đề xuất cấu hình cho 100 trứng gà',
  'Độ ẩm giai đoạn cuối nên thế nào?',
];

type ChatSource = { source: string; section: string };

type ConfigParameter = {
  config_code: string;
  config_name: string;
  target_value: number;
  min_value: number;
  max_value: number;
  unit: string;
};

type ConfigPhase = {
  phase_index: number;
  phase_name: string;
  day_start: number;
  day_end: number;
  parameters: ConfigParameter[];
};

type Message = {
  id: string;
  type: 'user' | 'bot' | 'loading' | 'error';
  content: string;
  sources?: ChatSource[];
  recommended_config?: ConfigPhase[] | null;
};

type AIAssistantProps = {
  user: User | null;
  onLogin: () => void;
};

export function AIAssistant({ user, onLogin }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Xin chào! Tôi là trợ lý AI IncuSmart. Hỏi tôi bất cứ điều gì về kỹ thuật ấp trứng nhé!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef(`session-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOpen = () => {
    if (!user) {
      onLogin();
      return;
    }
    setIsOpen(true);
  };

  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isLoading) return;

    setInput('');
    const userMsg: Message = { id: `u-${Date.now()}`, type: 'user', content: messageText };
    const loadingId = `l-${Date.now()}`;
    setMessages(prev => [...prev, userMsg, { id: loadingId, type: 'loading', content: '' }]);
    setIsLoading(true);

    try {
      const token = tokenStorage.get();
      const res = await fetch(`${CHAT_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: messageText, session_id: sessionIdRef.current }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages(prev =>
        prev
          .filter(m => m.id !== loadingId)
          .concat({
            id: `b-${Date.now()}`,
            type: 'bot',
            content: data.answer ?? 'Không có phản hồi.',
            sources: data.sources?.length ? data.sources : undefined,
            recommended_config: data.recommended_config ?? null,
          })
      );
    } catch {
      setMessages(prev =>
        prev
          .filter(m => m.id !== loadingId)
          .concat({ id: `e-${Date.now()}`, type: 'error', content: 'Lỗi kết nối. Vui lòng thử lại.' })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 group"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {user ? 'Trợ lý AI' : 'Đăng nhập để dùng trợ lý AI'}
          </span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <div className="font-semibold">Trợ lý AI IncuSmart</div>
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

          {/* Quick prompts */}
          <div className="px-4 pt-3 flex gap-2 flex-wrap">
            {QUICK_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                disabled={isLoading}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id}>
                {msg.type === 'loading' ? (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-3 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">Đang trả lời...</span>
                    </div>
                  </div>
                ) : msg.type === 'error' ? (
                  <div className="flex justify-start">
                    <div className="bg-red-50 text-red-600 rounded-2xl p-3 text-sm">{msg.content}</div>
                  </div>
                ) : (
                  <>
                    <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      </div>
                    </div>

                    {/* Recommended config */}
                    {msg.recommended_config && msg.recommended_config.length > 0 && (
                      <div className="mt-2 space-y-2 ml-2">
                        {msg.recommended_config.map(phase => (
                          <div key={phase.phase_index} className="border border-blue-100 rounded-xl bg-blue-50 p-3">
                            <div className="font-medium text-sm text-blue-800 mb-2">
                              {phase.phase_name} (Ngày {phase.day_start}–{phase.day_end})
                            </div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-gray-500">
                                  <th className="text-left py-0.5">Thông số</th>
                                  <th className="text-right py-0.5">Mục tiêu</th>
                                  <th className="text-right py-0.5">Min</th>
                                  <th className="text-right py-0.5">Max</th>
                                </tr>
                              </thead>
                              <tbody>
                                {phase.parameters.map(p => (
                                  <tr key={p.config_code} className="border-t border-blue-100">
                                    <td className="py-0.5 text-gray-700">{p.config_name}</td>
                                    <td className="py-0.5 text-right font-medium text-blue-700">
                                      {p.target_value}{p.unit}
                                    </td>
                                    <td className="py-0.5 text-right text-gray-500">{p.min_value}{p.unit}</td>
                                    <td className="py-0.5 text-right text-gray-500">{p.max_value}{p.unit}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Nhập câu hỏi của bạn..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
