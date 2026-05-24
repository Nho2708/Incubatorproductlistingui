import { useState } from 'react';
import { ShoppingCart, User as UserIcon, LogOut, ShoppingBag, Phone, Mail, Menu, X } from 'lucide-react';
import { User } from '../App';

type HeaderProps = {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  cartCount?: number;
  onCartClick?: () => void;
};

export function Header({ user, onLogin, onLogout, onNavigate, cartCount = 0, onCartClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:1900xxxx" className="flex items-center gap-1 hover:text-blue-100">
                <Phone size={14} />
                <span className="hidden sm:inline">Hotline: 1900-xxxx</span>
              </a>
              <a href="mailto:support@mayaptrung.vn" className="flex items-center gap-1 hover:text-blue-100">
                <Mail size={14} />
                <span className="hidden sm:inline">support@mayaptrung.vn</span>
              </a>
            </div>
            <div className="text-xs sm:text-sm">
              Miễn phí vận chuyển toàn quốc • Bảo hành 2 năm
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Máy Ấp Trứng
              </div>
              <div className="text-xs text-gray-500">Công nghệ AI tiên tiến</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('landing')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </button>
            <button
              onClick={() => onNavigate('listing')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sản phẩm
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Giới thiệu
            </button>
            <button
              onClick={() => onNavigate('guide')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Hướng dẫn
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Liên hệ
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart size={22} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <UserIcon size={18} />
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('orders');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3"
                      >
                        <ShoppingBag size={18} className="text-gray-600" />
                        <span>Đơn hàng của tôi</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3"
                      >
                        <UserIcon size={18} className="text-gray-600" />
                        <span>Thông tin cá nhân</span>
                      </button>
                      <div className="border-t border-gray-100 mt-2"></div>
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                      >
                        <LogOut size={18} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <UserIcon size={18} />
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('landing');
                  setShowMobileMenu(false);
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Trang chủ
              </button>
              <button
                onClick={() => {
                  onNavigate('listing');
                  setShowMobileMenu(false);
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Sản phẩm
              </button>
              <button
                onClick={() => {
                  onNavigate('about');
                  setShowMobileMenu(false);
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Giới thiệu
              </button>
              <button
                onClick={() => {
                  onNavigate('guide');
                  setShowMobileMenu(false);
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Hướng dẫn
              </button>
              <button
                onClick={() => {
                  onNavigate('contact');
                  setShowMobileMenu(false);
                }}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Liên hệ
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}