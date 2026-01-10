import { useState } from 'react';
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
  email: string;
  name: string;
};

function App() {
  const [view, setView] = useState<'listing' | 'detail' | 'purchase' | 'orders' | 'profile' | 'about' | 'guide' | 'contact' | 'cart'>('listing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('detail');
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
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

    // Create order from cart items
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    // For now, just create order with first item (in real app, would handle multiple items)
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
      order.deposit = total * 0.3; // 30% deposit
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

  const handleLogin = (email: string, name: string) => {
    setUser({ email, name });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setView('listing');
  };

  const handleNavigate = (newView: string) => {
    setView(newView as any);
  };

  const handleUpdateProfile = (data: any) => {
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
        {view === 'listing' && (
          <ProductListing 
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
            user={user}
            onLogin={handleLogin}
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
            onLogin={handleLogin}
          />
        )}
        {view === 'purchase' && currentOrder && (
          <PurchaseFlow
            order={currentOrder}
            onBack={handleBackToListing}
            user={user}
          />
        )}
        {view === 'orders' && user && (
          <MyOrders user={user} />
        )}
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