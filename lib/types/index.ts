export interface Product {
  id: string;
  name: string;
  description: string;
  category: "audio" | "keyboards" | "accessories" | "displays";
  price: number;
  stock: number;
  rating: number;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: "card" | "cod" | "upi";
  discountCode?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface OrderMutationResponse {
  success: boolean;
  orderId?: string;
  totalAmount?: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string[]>;
}
