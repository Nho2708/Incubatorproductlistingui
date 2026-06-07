import { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { CheckCircle, Loader2, X, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { getOrderPaymentStatus, recreateOrderPayment } from '../services/api';

export type PaymentModalProps = {
  orderId: string;
  orderCode?: string;
  qrCode?: string;
  amount: number;
  expiresAt?: string;
  onPaid: () => void;
  onClose: () => void;
};

export function PaymentModal({
  orderId,
  orderCode,
  qrCode: initialQrCode,
  amount: initialAmount,
  expiresAt: initialExpiresAt,
  onPaid,
  onClose,
}: PaymentModalProps) {
  const [pollStatus, setPollStatus] = useState<'waiting' | 'paid'>('waiting');
  // QR/amount/expiry giữ trong state để nút "Tạo lại mã QR" có thể cập nhật khi hết hạn
  const [qrCode, setQrCode] = useState(initialQrCode);
  const [amount, setAmount] = useState(initialAmount);
  const [expiresAt, setExpiresAt] = useState(initialExpiresAt);
  const [expired, setExpired] = useState(false);
  const [recreating, setRecreating] = useState(false);
  const [recreateError, setRecreateError] = useState('');
  const onPaidRef = useRef(onPaid);
  onPaidRef.current = onPaid;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  // Đánh dấu hết hạn khi qua mốc expiresAt
  useEffect(() => {
    if (!expiresAt) {
      setExpired(false);
      return;
    }
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) {
      setExpired(true);
      return;
    }
    setExpired(false);
    const timer = setTimeout(() => setExpired(true), ms);
    return () => clearTimeout(timer);
  }, [expiresAt]);

  // Gọi check 1 lần, trả về true nếu đã thanh toán (để dừng polling)
  const checkPaymentStatus = async () => {
    try {
      const res = await getOrderPaymentStatus(orderId);
      if (res.statusCode === '200' && res.data?.paymentStatus === 'PAID') {
        setPollStatus('paid');
        setTimeout(() => onPaidRef.current(), 1500);
        return true;
      }
    } catch {
      // bỏ qua lỗi mạng, lần poll sau thử lại
    }
    return false;
  };

  useEffect(() => {
    if (pollStatus === 'paid' || expired) return;
    let stopped = false;
    // Check ngay khi mở modal (hoặc sau khi tạo lại QR), không đợi 5s
    checkPaymentStatus();
    const interval = setInterval(async () => {
      if (stopped) return;
      const paid = await checkPaymentStatus();
      if (paid) clearInterval(interval);
    }, 5000);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, pollStatus, expired]);

  const handleRecreate = async () => {
    setRecreating(true);
    setRecreateError('');
    try {
      const res = await recreateOrderPayment(orderId);
      if ((res.statusCode === '200' || res.statusCode === '201') && res.data) {
        setQrCode(res.data.qrCode);
        setAmount(res.data.totalAmount || amount);
        setExpiresAt(res.data.paymentLinkExpiredAt);
        setExpired(false);
      } else {
        setRecreateError(res.message || 'Không thể tạo lại mã QR. Vui lòng thử lại.');
      }
    } catch {
      setRecreateError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setRecreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={pollStatus === 'waiting' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg">Thanh toán PayOS</p>
            {orderCode && <p className="text-blue-100 text-sm">Đơn #{orderCode}</p>}
          </div>
          {pollStatus === 'waiting' && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6">
          {pollStatus === 'paid' ? (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900 mb-1">Thanh toán thành công!</p>
              <p className="text-gray-500 text-sm">Đang cập nhật...</p>
            </div>
          ) : (
            /* QR / Waiting State */
            <>
              {/* Amount */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 mb-1">Số tiền cần thanh toán</p>
                <p className="text-3xl font-bold text-blue-600">{formatPrice(amount)}</p>
              </div>

              {/* QR Code */}
              {qrCode ? (
                <div className="flex justify-center mb-4">
                  <div className="relative p-4 border-2 border-blue-200 rounded-xl bg-white">
                    <QRCode
                      value={qrCode}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#1a1a1a"
                      className={expired ? 'opacity-20 blur-[2px]' : ''}
                    />
                    {expired && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-lg">
                          Đã hết hạn
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-52 mb-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">Không có QR code</p>
                </div>
              )}

              {/* Expiry */}
              {expiresAt && !expired && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-orange-600 mb-4">
                  <Clock size={13} />
                  <span>Hết hạn: {new Date(expiresAt).toLocaleTimeString('vi-VN')}</span>
                </div>
              )}

              {recreateError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 mb-3">
                  <AlertCircle size={13} />
                  <span>{recreateError}</span>
                </div>
              )}

              {expired ? (
                /* Hết hạn — cho tạo lại mã QR */
                <button
                  onClick={handleRecreate}
                  disabled={recreating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  <RefreshCw size={16} className={recreating ? 'animate-spin' : ''} />
                  <span className="text-sm font-medium">
                    {recreating ? 'Đang tạo mã mới...' : 'Tạo lại mã QR'}
                  </span>
                </button>
              ) : (
                /* Polling Indicator */
                <div className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 rounded-lg">
                  <Loader2 size={16} className="animate-spin text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Đang chờ thanh toán (tự động cập nhật mỗi 5 giây)
                  </p>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full mt-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Thanh toán sau
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
