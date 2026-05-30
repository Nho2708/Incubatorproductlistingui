import { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { CheckCircle, Loader2, X, Clock } from 'lucide-react';
import { getOrderPaymentStatus } from '../services/api';

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
  qrCode,
  amount,
  expiresAt,
  onPaid,
  onClose,
}: PaymentModalProps) {
  const [pollStatus, setPollStatus] = useState<'waiting' | 'paid'>('waiting');
  const onPaidRef = useRef(onPaid);
  onPaidRef.current = onPaid;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await getOrderPaymentStatus(orderId);
        if (res.statusCode === '200' && res.data?.paymentStatus === 'PAID') {
          clearInterval(interval);
          setPollStatus('paid');
          setTimeout(() => onPaidRef.current(), 1500);
        }
      } catch {
        // keep polling silently on network errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

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
                  <div className="p-4 border-2 border-blue-200 rounded-xl bg-white">
                    <QRCode
                      value={qrCode}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#1a1a1a"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-52 mb-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">Không có QR code</p>
                </div>
              )}

              {/* Expiry */}
              {expiresAt && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-orange-600 mb-4">
                  <Clock size={13} />
                  <span>Hết hạn: {new Date(expiresAt).toLocaleTimeString('vi-VN')}</span>
                </div>
              )}

              {/* Polling Indicator */}
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 rounded-lg">
                <Loader2 size={16} className="animate-spin text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Đang chờ thanh toán (tự động cập nhật mỗi 5 giây)
                </p>
              </div>

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
