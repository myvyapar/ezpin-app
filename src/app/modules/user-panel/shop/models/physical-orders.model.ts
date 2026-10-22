import { Pagination } from 'src/app/modules/shared/models/pagination.model'; 

export interface PhysicalOrders extends Pagination {
  results: PhysicalOrder[];
}

interface PhysicalOrder {
  id: number;
  activator: Activator;
  serial: string;
  to_serial?: string;
  transaction_id: string;
  product: Product;
  status: number;
  status_text: string;
  created_time: string;
  provider: string;
  amount: number;
  original_amount: number;
  count: number;
  activation_type: number;
  activation_type_text: string;
  sub_activator: Category;
  can_activate: boolean;
  can_deactivate: boolean;
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
  image?: any;
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

interface Activator {
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