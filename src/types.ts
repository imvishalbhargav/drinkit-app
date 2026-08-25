export type CategoryId =
  | 'whisky'
  | 'beer'
  | 'wine'
  | 'vodka'
  | 'rum'
  | 'tequila'
  | 'gin'
  | 'soft'
  | 'juice'
  | 'energy'
  | 'coffee'
  | 'water'
  | 'mixer';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  isAlcohol: boolean;
  /** hex accent used for chips, glows, card tints */
  accent: string;
  blurb: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: CategoryId;
  /** selling price in ₹ */
  price: number;
  /** MRP / struck-through price in ₹ */
  mrp: number;
  image: string;
  volume: string;
  /** alcohol by volume %, only for alcohol */
  abv?: number;
  origin?: string;
  rating: number;
  tags?: string[];
  isAlcohol: boolean;
}

export interface CartLine extends Product {
  qty: number;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  contactName?: string;
  contactPhone?: string;
}

export type OrderStatus = 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered';

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  volume: string;
}

export interface Order {
  id: string;
  createdAt: number;
  items: OrderItem[];
  subtotal: number;
  savings: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentId?: string;
  address: Address;
  status: OrderStatus;
  etaMinutes: number;
}

export interface User {
  phone: string;
  name?: string;
  email?: string;
}
