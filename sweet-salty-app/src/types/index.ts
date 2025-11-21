export type Locale = "en" | "ar";

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Ingredient {
  en: string;
  ar: string;
}

export interface MenuItem {
  id: string;
  name: LocalizedString;
  image: string;
  price: number;
  ingredients: Ingredient[];
  description: LocalizedString;
  mostOrdered: boolean;
  discount: number;
}

export interface Category {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  items: MenuItem[];
}

export interface Offer {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
}

export interface UserProfile {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  address: string;
  language: Locale;
  notifications: boolean;
  avatar?: string;
  createdAt: string;
  favorites?: string[];
}

export interface OrderItem {
  itemId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  status: "draft" | "placed" | "delivered";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
}

export interface Database {
  users: UserProfile[];
  menu: {
    categories: Category[];
    offers: Offer[];
  };
  orders: Order[];
}
