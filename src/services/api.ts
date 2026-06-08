const API_BASE_URL = 'https://api-incusmart.io.vn/api';
const TOKEN_KEY = 'incusmart_token';

// In-memory cache to avoid localStorage reads on every request
let _cachedToken: string | null = null;

export const tokenStorage = {
  get: (): string | null => {
    if (_cachedToken !== null) return _cachedToken;
    _cachedToken = localStorage.getItem(TOKEN_KEY);
    return _cachedToken;
  },
  set: (token: string) => {
    _cachedToken = token;
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: () => {
    _cachedToken = null;
    localStorage.removeItem(TOKEN_KEY);
  },
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

export function isTokenExpired(token: string): boolean {
  try {
    const claims = decodeJwt(token);
    const exp = Number(claims['exp']);
    if (!exp) return false;
    return Date.now() / 1000 > exp;
  } catch {
    return true;
  }
}

let _onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  _onUnauthorized = fn;
}

export interface BaseResponse<T> {
  statusCode: string;
  message?: string;
  data?: T;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
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

  if (response.status === 401) {
    tokenStorage.remove();
    _onUnauthorized?.();
    return {
      statusCode: '401',
      message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
    } as BaseResponse<T>;
  }

  const json = await response.json();
  // Normalize statusCode to string (BE có thể trả number hoặc string)
  return { ...json, statusCode: String(json.statusCode) };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(username: string, password: string) {
  return request<string>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function register(payload: {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
}) {
  return request<string>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerResend(sessionId: string) {
  return request<string>('/auth/register/resend', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

export async function registerVerify(sessionId: string, otp: string) {
  return request<null>('/auth/register/verify', {
    method: 'POST',
    body: JSON.stringify({ sessionId, otp }),
  });
}

// ─── Incubator Models (Products) ─────────────────────────────────────────────

export interface ApiIncubatorModel {
  id: string;
  modelCode: string;
  name: string;
  description?: string;
  unitPrice: number;
  imageUrl?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ModelConfigItem {
  configId: string;
  quantity?: number;
  required?: boolean;
  absoluteMin?: number;
  absoluteMax?: number;
}

export interface CreateIncubatorModelPayload {
  modelCode: string;
  name: string;
  description?: string;
  unitPrice: number;
  imageUrl?: string;
  configs: ModelConfigItem[];
}

export interface UpdateIncubatorModelPayload {
  modelCode?: string;
  name?: string;
  description?: string;
  unitPrice?: number;
  imageUrl?: string;
  configs?: ModelConfigItem[];
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

export async function createIncubatorModel(payload: CreateIncubatorModelPayload) {
  return request<string>('/incubator-models', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateIncubatorModel(id: string, payload: UpdateIncubatorModelPayload) {
  return request<boolean>(`/incubator-models/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteIncubatorModel(id: string) {
  return request<boolean>(`/incubator-models/${id}`, {
    method: 'DELETE',
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface ApiOrderItem {
  incubatorModelId: string;
  quantity: number;
}

export interface CreateOrderResponse {
  orderId: string;
  orderCode?: string;
  totalAmount: number;
  paymentStatus: string;
  paymentOrderCode?: number;
  paymentLinkId?: string;
  qrCode?: string;
  paymentLinkExpiredAt?: string;
}

export interface ApiOrderPaymentStatus {
  orderId: string;
  orderCode?: string;
  paymentStatus: string;
  paidAt?: string;
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

// Khách đã đăng nhập nhận (claim) đơn guest về tài khoản bằng mã đơn + mã tra cứu.
// Đơn guest phải đã COMPLETED và chưa bị claim.
export async function claimGuestOrder(orderCode: string, verificationPass: string) {
  return request<boolean>('/orders/guest/claim', {
    method: 'POST',
    body: JSON.stringify({ orderCode, verificationPass }),
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
  paymentOrderCode?: number;
  paymentLinkId?: string;
  qrCode?: string;
  paymentLinkCreatedAt?: string;
  paymentLinkExpiredAt?: string;
  paidAt?: string;
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

// Khách xác nhận đã nhận hàng → hoàn thành đơn. Đơn phải đã PAID và đang SHIPPING.
export async function completeOrder(orderId: string) {
  return request<boolean>(`/orders/${orderId}/complete`, { method: 'POST' });
}

export interface ApiSalesOrderItem {
  id: string;
  orderId: string;
  incubatorModelId: string;
  incubatorId?: string;
  unitPrice: number;
  status: string;
  createdAt: string;
}

export interface ApiSalesOrderDetail {
  order: ApiSalesOrder;
  items: ApiSalesOrderItem[];
}

export async function getOrderById(id: string) {
  return request<ApiSalesOrderDetail>(`/orders/${id}`);
}

export async function getOrderPaymentStatus(id: string) {
  return request<ApiOrderPaymentStatus>(`/orders/${id}/payment-status`);
}

// Tạo lại payment link/QR cho đơn đã tồn tại khi link cũ hết hạn.
export async function recreateOrderPayment(id: string) {
  return request<CreateOrderResponse>(`/orders/${id}/payment-link/refresh`, {
    method: 'POST',
  });
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

export interface ApiCustomerSummary {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  phone: string;
  address?: string;
  userStatus: string;
  customerStatus: string;
  role: string;
}

export async function listCustomers(params?: { search?: string; page?: number; pageSize?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  query.set('page', String(params?.page ?? 1));
  query.set('pageSize', String(params?.pageSize ?? 50));
  return request<PagedResult<ApiCustomerSummary>>(`/customers?${query}`);
}

export async function updateMyProfile(address: string) {
  return request<boolean>('/customers/me', {
    method: 'PUT',
    body: JSON.stringify({ address }),
  });
}

// ─── Incubators (máy ấp trứng) ────────────────────────────────────────────────

export interface ApiIncubator {
  id: string;
  modelId: string;
  modelName?: string;
  modelImageUrl?: string;
  serialNumber?: string;
  customerId?: string;
  activatedAt?: string;
  status: string; // AVAILABLE | RESERVED | ACTIVE | REPLACEMENT_PENDING | IN_MAINTENANCE | DAMAGED | RETIRED
  createdAt: string;
  updatedAt?: string;
}

export async function getIncubators(params?: {
  status?: string;
  modelId?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.modelId) query.set('modelId', params.modelId);
  query.set('page', String(params?.page ?? 1));
  query.set('pageSize', String(params?.pageSize ?? 50));
  return request<PagedResult<ApiIncubator>>(`/incubators?${query}`);
}

export async function getIncubatorById(id: string) {
  return request<ApiIncubator>(`/incubators/${id}`);
}

export async function getIncubatorHatchingSeasons(
  id: string,
  params?: { status?: string; eggType?: string }
) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.eggType) query.set('eggType', params.eggType);
  const qs = query.toString();
  return request<ApiHatchingSeason[]>(`/incubators/${id}/hatching-seasons${qs ? `?${qs}` : ''}`);
}

// ─── Hatching Seasons (mùa ấp) ────────────────────────────────────────────────

export interface ApiHatchingSeason {
  id: string;
  status: string; // ACTIVE | COMPLETED | FAILED | CANCELLED
  incubatorId: string;
  templateId?: string;
  seasonCode: string;
  name?: string;
  eggType?: string;
  startDate: string;
  endDate?: string;
  totalEggs?: number;
  successCount: number;
  failCount: number;
  notes?: string;
  createdAt: string;
}

export async function getHatchingSeasons(params?: {
  incubatorId?: string;
  customerId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params?.incubatorId) query.set('incubatorId', params.incubatorId);
  if (params?.customerId) query.set('customerId', params.customerId);
  if (params?.status) query.set('status', params.status);
  query.set('page', String(params?.page ?? 1));
  query.set('pageSize', String(params?.pageSize ?? 100));
  return request<PagedResult<ApiHatchingSeason>>(`/hatching-seasons?${query}`);
}

export interface ApiHatchingSeasonDetail {
  season: ApiHatchingSeason;
  template?: ApiHatchingSeasonTemplate;
  batches: {
    batch: ApiTemplateBatch & { id: string };
    configs: ApiTemplateBatchConfig[];
  }[];
}

export async function getHatchingSeasonById(id: string) {
  return request<ApiHatchingSeasonDetail>(`/hatching-seasons/${id}`);
}

export async function updateHatchingSeason(
  id: string,
  data: {
    endDate?: string;
    totalEggs?: number;
    successCount?: number;
    failCount?: number;
    notes?: string;
  }
) {
  return request<boolean>(`/hatching-seasons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateHatchingSeasonStatus(id: string, status: string) {
  return request<boolean>(`/hatching-seasons/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function createHatchingSeason(data: {
  incubatorId: string;
  templateId?: string;
  name?: string;
  eggType?: string;
  startDate: string; // yyyy-MM-dd
  totalEggs?: number;
  notes?: string;
}) {
  return request<string>('/hatching-seasons', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Egg Type ─────────────────────────────────────────────────────────────────

export const EGG_TYPES = [
  { value: 'CHICKEN', label: 'Gà' },
  { value: 'DUCK',    label: 'Vịt' },
  { value: 'QUAIL',   label: 'Cút' },
  { value: 'PIGEON',  label: 'Bồ câu' },
] as const;

export type EggTypeValue = typeof EGG_TYPES[number]['value'];

export function eggTypeLabel(value?: string | null): string {
  return EGG_TYPES.find((e) => e.value === value)?.label ?? value ?? '';
}

export function normalizeEggType(value?: string | number | null): string {
  if (value == null || value === '') return '';
  // numeric enum (backend serializes as int: 0=CHICKEN, 1=DUCK, 2=QUAIL, 3=PIGEON)
  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    return EGG_TYPES[Number(value)]?.value ?? '';
  }
  // valid enum string — pass through
  if (EGG_TYPES.some((e) => e.value === value)) return String(value);
  // legacy Vietnamese label → map to enum
  const byLabel = EGG_TYPES.find((e) => e.label === value);
  if (byLabel) return byLabel.value;
  return '';
}

// ─── Configs (thông số đo) ───────────────────────────────────────────────────

export interface ApiConfig {
  id: string;
  code: string;
  name: string;
  type: string | null;
  unit: string | null;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

export async function listConfigs(params?: { search?: string; page?: number; pageSize?: number }) {
  const q = new URLSearchParams({
    page: String(params?.page ?? 1),
    pageSize: String(params?.pageSize ?? 100),
  });
  if (params?.search?.trim()) q.set('search', params.search.trim());
  return request<PagedResult<ApiConfig>>(`/configs?${q}`);
}

// ─── Hatching Season Templates (mẫu mùa ấp) ───────────────────────────────────

export interface ApiTemplateBatchConfig {
  configId: string;
  targetValue?: number;
  minValue?: number;
  maxValue?: number;
}

export interface ApiTemplateBatch {
  batchIndex: number;
  name?: string;
  numberOfDays: number;
  notes?: string;
  configs?: ApiTemplateBatchConfig[];
}

export interface ApiHatchingSeasonTemplate {
  id: string;
  status: string;
  customerId?: string;
  name: string;
  description?: string;
  totalDays: number;
  eggType?: string;
  isActive: boolean;
  createdByType: string; // CUSTOMER | TECHNICIAN
  createdAt: string;
}

export interface HatchingSeasonTemplateDetail {
  template: ApiHatchingSeasonTemplate;
  batches: { batch: ApiTemplateBatch & { id: string }; configs: ApiTemplateBatchConfig[] }[];
}

export interface CreateTemplatePayload {
  customerId?: string;
  name: string;
  description?: string;
  eggType?: string;
  totalDays?: number;
  createdByType: string;
  batches: ApiTemplateBatch[];
}

export interface UpdateTemplatePayload {
  name?: string;
  description?: string;
  eggType?: string;
  isActive?: boolean;
  batches?: ApiTemplateBatch[];
}

export async function getHatchingSeasonTemplates(params?: {
  customerId?: string;
  createdByType?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = new URLSearchParams();
  if (params?.customerId) query.set('customerId', params.customerId);
  if (params?.createdByType) query.set('createdByType', params.createdByType);
  query.set('page', String(params?.page ?? 1));
  query.set('pageSize', String(params?.pageSize ?? 50));
  return request<PagedResult<ApiHatchingSeasonTemplate>>(`/hatching-season-templates?${query}`);
}

export async function getHatchingSeasonTemplateById(id: string) {
  return request<HatchingSeasonTemplateDetail>(`/hatching-season-templates/${id}`);
}

export async function createHatchingSeasonTemplate(payload: CreateTemplatePayload) {
  return request<string>('/hatching-season-templates', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateHatchingSeasonTemplate(id: string, payload: UpdateTemplatePayload) {
  return request<boolean>(`/hatching-season-templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteHatchingSeasonTemplate(id: string) {
  return request<boolean>(`/hatching-season-templates/${id}`, { method: 'DELETE' });
}
