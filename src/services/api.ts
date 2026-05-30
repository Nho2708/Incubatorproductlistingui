const API_BASE_URL = 'https://api-incusmart.io.vn/api';
const TOKEN_KEY = 'incusmart_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

export function decodeJwt(token: string): Record<string, string> {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

export interface BaseResponse<T> {
  statusCode: string;
  message?: string;
  data?: T;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<BaseResponse<T>> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return response.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(username: string, password: string) {
  return request<string>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function register(
  username: string,
  password: string,
  fullName: string,
  phone: string,
  email?: string
) {
  return request<string>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, fullName, phone, email }),
  });
}

// ─── Incubator Models (Products) ─────────────────────────────────────────────

export interface ApiIncubatorModel {
  id: string;
  modelCode: string;
  name: string;
  description?: string;
  unitPrice: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export async function getPublicIncubatorModels(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  query.set('page', String(params?.page ?? 1));
  query.set('pageSize', String(params?.pageSize ?? 12));
  const response = await fetch(`${API_BASE_URL}/incubator-models/public?${query}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json() as Promise<BaseResponse<PagedResult<ApiIncubatorModel>>>;
}

export async function getIncubatorModels(params?: {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  query.set('page', String(params?.page ?? 1));
  query.set('pageSize', String(params?.pageSize ?? 100));
  return request<PagedResult<ApiIncubatorModel>>(`/incubator-models?${query}`);
}

export async function getIncubatorModelById(id: string) {
  return request<ApiIncubatorModel>(`/incubator-models/${id}`);
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface ApiOrderItem {
  incubatorModelId: string;
  quantity: number;
}

export interface CreateOrderResponse {
  orderId: string;
  orderCode?: string;
  checkoutUrl?: string;
  qrCode?: string;
}

export async function createOrderCustomer(items: ApiOrderItem[]) {
  return request<CreateOrderResponse>('/orders/customer', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

export async function createOrderGuest(data: {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  description?: string;
  verificationPass: string;
  items: ApiOrderItem[];
}) {
  return request<CreateOrderResponse>('/orders/guest', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface ApiSalesOrder {
  id: string;
  orderCode?: string;
  customerId?: string;
  orderDate?: string;
  shippingAddress: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export async function getMyOrders(params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  query.set('page', String(params?.page ?? 1));
  query.set('pageSize', String(params?.pageSize ?? 50));
  return request<PagedResult<ApiSalesOrder>>(`/orders?${query}`);
}

export async function cancelOrder(orderId: string) {
  return request<boolean>(`/orders/${orderId}/cancel`, { method: 'POST' });
}

// ─── Customer Profile ─────────────────────────────────────────────────────────

export interface ApiCustomerProfile {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  phone: string;
  address?: string;
  status: string;
}

export async function getMyProfile() {
  return request<ApiCustomerProfile>('/customers/me');
}

export async function updateMyProfile(address: string) {
  return request<boolean>('/customers/me', {
    method: 'PUT',
    body: JSON.stringify({ address }),
  });
}
