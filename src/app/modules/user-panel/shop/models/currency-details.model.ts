import { Pagination } from 'src/app/modules/shared/models/pagination.model';

export interface CurrencyDetails extends Pagination {
  results: CurrencyDetail[];
}

interface CurrencyDetail {
  id: number;
  amount: number;
  amount_type: number;
  amount_type_text: string;
  transaction?: Transaction;
  digital_order?: DigitalOrder;
  wallet_type: WalletType;
  description: string;
  created_time: string;
  user: number;
  currency_data: CurrencyData;
  cascade_invoice?: any;
  related_exchange_data?: RelatedExchangedatum;
}

interface RelatedExchangedatum {
  id: number;
  from_currency_data: CurrencyData;
  to_currency_data: CurrencyData;
  rate: number;
  amount: number;
}

interface WalletType {
  id: number;
  text: string;
}

interface DigitalOrder {
  id: number;
  user: number;
  profile: Activator;
  type_text: string;
  type: number;
  phone: string;
  email?: any;
  whatsapp?: any;
  resend: number;
  status: number;
  order_price: number;
  created_time: string;
  order_items: OrderItem[];
  status_text: string;
  sub_user: Category;
}

interface OrderItem {
  id: number;
  product: Product2;
  item_count: number;
  unit_price: number;
  seller_price: number;
  reseller_price?: any;
  created_time: string;
}

interface Product2 {
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

interface Transaction {
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
  image?: string;
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
