import { useState, useEffect, type ReactNode } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ProductListing } from './components/ProductListing';
import { PurchaseFlow } from './components/PurchaseFlow';
import { AIAssistant } from './components/AIAssistant';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MyOrders } from './components/MyOrders';
import { Profile } from './components/Profile';
import { AuthModal } from './components/AuthModal';
import { AboutUs } from './components/AboutUs';
import { Guide } from './components/Guide';
import { Contact } from './components/Contact';
import { Cart, CartItem } from './components/Cart';
import { LandingPage } from './components/LandingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PurchaseFlowPage } from './pages/PurchaseFlowPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { tokenStorage, decodeJwt } from './services/api';

export type Product = {
  id: string;
  name: string;
  capacity: number;
  power: number;
  price: number;
  image: string;
  category: 'household' | 'small-farm' | 'medium-farm' | 'large-farm';
  hatchRate: number;
  description: string;
  specs: {
    maxCapacity: number;
    tempRange: string;
    humidityRange: string;
    powerConsumption: string;
    eggTurning: string;
    aiMonitoring: boolean;
    appConnection: boolean;
  };
  eggTypes: string[];
  automationLevel: 'semi-auto' | 'full-auto' | 'ai-assisted';
  inStock: boolean;
  preOrder: boolean;
  rating: number;
  reviews: number;
  soldCount: number;
};

export type Order = {
  id: string;
  product: Product;
  quantity: number;
  total: number;
  deposit?: number;
  remaining?: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'completed';
  purchaseType: 'deposit' | 'full';
};

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
};

function parseUserFromToken(token: string): User | null {
  const claims = decodeJwt(token);
  const sub = claims['sub'];
  const uniqueName =
    claims['unique_name'] ||
    claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
    '';
  const role =
    claims['role'] ||
    claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    'CUSTOMER';
  if (!sub) return null;
  return { id: sub, username: uniqueName, name: uniqueName, email: '', role };
}

const VIEW_TO_PATH: Record<string, string> = {
  landing: '/',
  listing: '/products',
  orders: '/orders',
  profile: '/profile',
  about: '/about',
  guide: '/guide',
  contact: '/contact',
  cart: '/cart',
};

function AuthGuard({ user, authLoading, children }: { user: User | null; authLoading: boolean; children: ReactNode }) {
  if (authLoading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) {
      const parsed = parseUserFromToken(token);
      if (parsed) setUser(parsed);
    }
    setAuthLoading(false);
  }, []);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    navigate('/cart');
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCartCheckout = (type: 'deposit' | 'full') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (cartItems.length === 0) return;
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const order: Order = {
      id: `ORD-${Date.now()}`,
      product: cartItems[0].product,
      quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      total,
      status: 'pending',
      purchaseType: type,
    };
    if (type === 'deposit') {
      order.deposit = total * 0.3;
      order.remaining = total - order.deposit;
    }
    setCartItems([]);
    navigate('/purchase', { state: { order } });
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    tokenStorage.remove();
    setUser(null);
    navigate('/');
  };

  const handleNavigate = (view: string) => {
    navigate(VIEW_TO_PATH[view] ?? '/');
  };

  const handleUpdateProfile = (data: { name: string; email: string }) => {
    if (user) setUser({ ...user, name: data.name, email: data.email });
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/products/${product.id}`, { state: { product } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        cartCount={cartItems.length}
        onCartClick={() => navigate('/cart')}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                onExplore={() => navigate('/products')}
                onLogin={() => setShowAuthModal(true)}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductListing
                onViewProduct={handleViewProduct}
                onAddToCart={handleAddToCart}
                user={user}
                onLogin={() => setShowAuthModal(true)}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductDetailPage
                user={user}
                onAddToCart={handleAddToCart}
                onLogin={() => setShowAuthModal(true)}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={handleCartCheckout}
                onViewProduct={handleViewProduct}
                onContinueShopping={() => navigate('/products')}
              />
            }
          />
          <Route path="/purchase" element={<PurchaseFlowPage user={user} />} />
          <Route
            path="/orders"
            element={
              <AuthGuard user={user} authLoading={authLoading}>
                <MyOrders user={user!} />
              </AuthGuard>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <AuthGuard user={user} authLoading={authLoading}>
                <OrderDetailPage user={user!} />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard user={user} authLoading={authLoading}>
                <Profile user={user!} onUpdateProfile={handleUpdateProfile} />
              </AuthGuard>
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onNavigate={handleNavigate} />
      <AIAssistant onProductSelect={handleViewProduct} />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
