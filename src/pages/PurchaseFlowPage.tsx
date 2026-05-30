import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PurchaseFlow } from '../components/PurchaseFlow';
import { Order, User } from '../App';

type Props = {
  user: User | null;
};

export function PurchaseFlowPage({ user }: Props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order: Order | undefined = state?.order;

  if (!order) return <Navigate to="/cart" replace />;

  return (
    <PurchaseFlow
      order={order}
      onBack={() => navigate('/products')}
      user={user}
    />
  );
}
