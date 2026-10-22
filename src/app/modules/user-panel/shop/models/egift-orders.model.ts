import { Pagination } from 'src/app/modules/shared/models/pagination.model'; 

export interface EGiftOrder extends Pagination {
  results: EGift[];
}

interface EGift {
  id: number;
  user: number;
  profile: Profile;
  type_text: string;
  type: number;
  phone?: any;
  email: string;
  whatsapp?: any;
  resend: number;
  status: number;
  order_price: number;
  created_time: string;
  order_items: OrderItem[];
  status_text: string;
  sub_user?: any;
}

interface OrderItem {
  id: number;
  product: Product;
  item_count: number;
  unit_price: number;
  seller_price: number;
  reseller_price?: any;
  created_time: string;
}

interface Product {
  id: number;
  title: string;
  card_type: number;
  price_min: number;
  price_max: number;
  currency_data: CurrencyData;
  categories: Category[];
  upc: number;
  image: string;
}

interface Category {
  id: number;
  name: string;
}

interface CurrencyData {
  id: number;
  country: string;
  currency: string;
  symbol: string;
  code: string;
}

interface Profile {
  id: number;
  username: string;
  name: string;
  admin: Admin;
  reseller?: any;
  role: Role;
  code: string;
  company: string;
  is_reseller: boolean;
}

interface Role {
  role_id: number;
  role_name: string;
  role_field: string;
}

interface Admin {
  id: number;
  name: string;
  company: string;
}