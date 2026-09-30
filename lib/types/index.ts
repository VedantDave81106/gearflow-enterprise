export interface Product {
  id: string;
  name: string;
  description: string;
  category: "compute" | "networking" | "storage" | "security" | "accessories";
  price: number;
  stock: number;
  rating: number;
  features: string[];
  imageUrl: string;
  badge?: string;
  sku?: string;
  formFactor?: string;
  datacenter?: string;
  leadTime?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderPriority = "standard" | "expedited" | "critical-mission";
export type PaymentMethod = "corporate-po" | "wire-transfer" | "credit-card";

export interface OrderSubmissionPayload {
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  priority: OrderPriority;
  paymentMethod: PaymentMethod;
  discountCode?: string;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  clientTimestamp: string;
}

export interface OrderMutationResponse {
  success: boolean;
  orderId?: string;
  trackingNumber?: string;
  totalAmount?: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string[]>;
}
