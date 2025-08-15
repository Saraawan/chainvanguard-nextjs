// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'supplier' | 'vendor' | 'customer' | 'expert'

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  walletAddress?: string;
}


// Product Types
export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  quantity: number
  images?: string[]
  supplierId: string
  supplierName: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive'
  sku?: string
  weight?: string
  dimensions?: string
  manufacturingDate?: string
  expiryDate?: string
}

export type ProductStatus =
  | "active"
  | "inactive"
  | "out-of-stock"
  | "discontinued";

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  images: File[];
}

// Blockchain Types
export interface BlockchainTransaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  blockNumber: number;
  timestamp: string;
  type: TransactionType;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
}

export type TransactionType =
  | "product-creation"
  | "product-transfer"
  | "payment"
  | "consensus"
  | "audit";
export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "failed"
  | "cancelled";

// Smart Contract Types
export interface ContractMethod {
  name: string;
  type: string;
  inputs: ContractInput[];
  outputs: ContractOutput[];
}

export interface ContractInput {
  name: string;
  type: string;
  indexed?: boolean;
}

export interface ContractOutput {
  name: string;
  type: string;
}

export interface SmartContract {
  address: string;
  abi: ContractMethod[];
  name: string;
  version: string;
  deployedAt: string;
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  vendorId: string
  vendorName: string
  products: {
    productId: string
    productName: string
    quantity: number
    price: number
    totalPrice: number
  }[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  createdAt: string
  updatedAt: string
  trackingId?: string
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type PaymentMethod = "crypto" | "card" | "bank-transfer";

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: string;
}

// IPFS Types
export interface IPFSFile {
  hash: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface IPFSUploadResponse {
  success: boolean;
  hash?: string;
  url?: string;
  error?: string;
}

// Hyperledger Fabric Types
export interface FabricConnectionProfile {
  name: string;
  version: string;
  client: {
    organization: string;
    connection: {
      timeout: {
        peer: {
          endorser: string;
        };
      };
    };
  };
  organizations: Record<string, unknown>;
  orderers: Record<string, unknown>;
  peers: Record<string, unknown>;
  certificateAuthorities: Record<string, unknown>;
}

export interface FabricWallet {
  put: (label: string, identity: unknown) => Promise<void>;
  get: (label: string) => Promise<unknown>;
  exists: (label: string) => Promise<boolean>;
  remove: (label: string) => Promise<void>;
}

export interface FabricNetwork {
  channelName: string;
  contractName: string;
  connectionProfile: FabricConnectionProfile;
  wallet: FabricWallet;
  userId: string;
}

export interface FabricTransaction {
  txId: string;
  chaincode: string;
  function: string;
  args: string[];
  timestamp: string;
  status: "success" | "failure";
  result?: string | Record<string, unknown>;
  error?: string;
}

// Analytics and Dashboard Types
export interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentTransactions: BlockchainTransaction[];
  salesData: SalesData[];
  performanceMetrics: PerformanceMetric[];
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  products: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
}

// Wallet Types
export interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  balance: string;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Consensus and Network Types
export interface ConsensusNode {
  id: string;
  name: string;
  type: "peer" | "orderer" | "ca";
  status: "online" | "offline" | "syncing";
  lastSeen: string;
  blockHeight: number;
  version: string;
}

export interface NetworkHealth {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  syncingNodes: number;
  averageBlockTime: number;
  transactionThroughput: number;
  networkLatency: number;
}

// Form Types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormFieldError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "primary" | "secondary";
}

// Search and Filter Types
export interface SearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  supplier?: string;
  status?: ProductStatus;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Route Protection Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

// Chart and Visualization Types
export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  category?: string;
}

export interface ChartConfig {
  type: "line" | "bar" | "pie" | "area";
  data: ChartDataPoint[];
  xAxisKey: string;
  yAxisKey: string;
  colors?: string[];
}

// File Upload Types
export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  multiple: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Theme Types
export type Theme = "light" | "dark" | "system";

export interface ThemeConfig {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Configuration Types
export interface AppConfig {
  apiUrl: string;
  chainId: number;
  contractAddresses: Record<string, string>;
  ipfsGateway: string;
  enabledFeatures: string[];
}
