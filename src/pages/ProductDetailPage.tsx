import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ProductDetail } from '../components/ProductDetail';
import { Product, Order, User } from '../App';
import { getIncubatorModelById, ApiIncubatorModel } from '../services/api';

function mapApiModel(model: ApiIncubatorModel): Product {
  return {
    id: model.id,
    name: model.name,
    capacity: 0,
    power: 0,
    price: model.unitPrice,
    image: model.imageUrl || 'https://images.unsplash.com/photo-1569944405467-f040d1c3c7b0?w=800&q=80',
    category: 'household',
    hatchRate: 0,
    description: model.description || '',
    specs: {
      maxCapacity: 0,
      tempRange: '',
      humidityRange: '',
      powerConsumption: '',
      eggTurning: '',
      aiMonitoring: false,
      appConnection: false,
    },
    eggTypes: [],
    automationLevel: 'semi-auto',
    inStock: model.status === 'ACTIVE',
    preOrder: model.status !== 'ACTIVE',
    rating: 0,
    reviews: 0,
    soldCount: 0,
  };
}

type Props = {
  user: User | null;
  onAddToCart: (product: Product, quantity: number) => void;
  onLogin: () => void;
};

export function ProductDetailPage({ user, onAddToCart, onLogin }: Props) {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(state?.product ?? null);
  const [loading, setLoading] = useState(!state?.product);

  useEffect(() => {
    if (!state?.product && id) {
      getIncubatorModelById(id)
        .then((res) => {
          if (res.statusCode === '200' && res.data) {
            setProduct(mapApiModel(res.data));
          } else {
            navigate('/products', { replace: true });
          }
        })
        .catch(() => navigate('/products', { replace: true }))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePurchase = (prod: Product, quantity: number, type: 'deposit' | 'full') => {
    const total = prod.price * quantity;
    const order: Order = {
      id: `ORD-${Date.now()}`,
      product: prod,
      quantity,
      total,
      status: 'pending',
      purchaseType: type,
    };
    if (type === 'deposit') {
      order.deposit = total * 0.3;
      order.remaining = total - order.deposit;
    }
    navigate('/purchase', { state: { order } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) return <Navigate to="/products" replace />;

  return (
    <ProductDetail
      product={product}
      onBack={() => navigate('/products')}
      onPurchase={handlePurchase}
      onAddToCart={onAddToCart}
      user={user}
      onLogin={onLogin}
    />
  );
}
