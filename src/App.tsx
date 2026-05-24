import { useState, useEffect } from 'react';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
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
  return {
    id: sub,
    username: uniqueName,
    name: uniqueName,
    email: '',
    role,
  };
}

function App() {
  const [view, setView] = useState<
    'landing' | 'listing' | 'detail' | 'purchase' | 'orders' | 'profile' | 'about' | 'guide' | 'contact' | 'cart'
  >('landing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) {
      const parsed = parseUserFromToken(token);
      if (parsed) setUser(parsed);
    }
  }, []);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('detail');
  };

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
    setView('cart');
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
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    if (cartItems.length > 0) {
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
      setCurrentOrder(order);
      setCartItems([]);
      setView('purchase');
    }
  };

  const handlePurchase = (product: Product, quantity: number, type: 'deposit' | 'full') => {
    const total = product.price * quantity;
    const order: Order = {
      id: `ORD-${Date.now()}`,
      product,
      quantity,
      total,
      status: 'pending',
      purchaseType: type,
    };
    if (type === 'deposit') {
      order.deposit = total * 0.3;
      order.remaining = total - order.deposit;
    }
    setCurrentOrder(order);
    setView('purchase');
  };

  const handleBackToListing = () => {
    setView('listing');
    setSelectedProduct(null);
    setCurrentOrder(null);
  };

  const handleLogin = (user: User) => {
    setUser(user);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    tokenStorage.remove();
    setUser(null);
    setView('landing');
  };

  const handleNavigate = (newView: string) => {
    setView(newView as any);
  };

  const handleUpdateProfile = (data: { name: string; email: string }) => {
    if (user) {
      setUser({ ...user, name: data.name, email: data.email });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        cartCount={cartItems.length}
        onCartClick={() => setView('cart')}
      />

      <main className="flex-1">
        {view === 'landing' && (
          <LandingPage
            onExplore={() => setView('listing')}
            onLogin={() => setShowAuthModal(true)}
          />
        )}
        {view === 'listing' && (
          <ProductListing
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            user={user}
            onLogin={() => setShowAuthModal(true)}
            onLogout={handleLogout}
          />
        )}
        {view === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToListing}
            onPurchase={handlePurchase}
            onAddToCart={handleAddToCart}
            user={user}
            onLogin={() => setShowAuthModal(true)}
          />
        )}
        {view === 'purchase' && currentOrder && (
          <PurchaseFlow
            order={currentOrder}
            onBack={handleBackToListing}
            user={user}
          />
        )}
        {view === 'orders' && user && <MyOrders user={user} />}
        {view === 'profile' && user && (
          <Profile user={user} onUpdateProfile={handleUpdateProfile} />
        )}
        {view === 'about' && <AboutUs />}
        {view === 'guide' && <Guide />}
        {view === 'contact' && <Contact />}
        {view === 'cart' && (
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCartCheckout}
            onViewProduct={handleViewProduct}
            onContinueShopping={() => setView('listing')}
          />
        )}
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
