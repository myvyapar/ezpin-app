export interface Permission {
  report_permissions: any[];
  panel_permissions: any[];
  total_sell: number;
  profile: Profile;
  balance: number;
  sub_user: Subuser;
  active_gifts: number;
  deactivated_gifts: number;
}

interface Subuser {
  id: number;
  name: string;
  email: string;
  can_order_digital: boolean;
  can_order_physical: boolean;
  can_order_crypto: boolean;
}

interface Profile {
  id: number;
  timezone_data?: any;
  crypto_custom_text: string;
  company: string;
  digital_custom_text: string;
  print_access: boolean;
  show_buying_price: boolean;
  phone: string;
  address: string;
  active: boolean;
  office: string;
  whatsapp: string;
  company_logo?: any;
  balance: number;
  balances: Balance[];
  role: Role;
  google_two_step_activation: boolean;
  reseller: Reseller;
  email_two_step: boolean;
  city: City;
  post_code: string;
  admin: Reseller;
  name: string;
  digital_custom_text_pos: string;
  crypto_custom_text_pos: string;
  catalog_link: number;
  condition_acceptation: boolean;
  showing_currency: Currency;
  pin_required: boolean;
  email: string;
  username: string;
  code: string;
  is_legal: boolean;
  vat_tax_id?: any;
  product_list: Productlist;
  documents: any[];
}

interface Productlist {
  id: number;
  title: string;
}

interface City {
  id: number;
  state: State;
  name: string;
}

interface State {
  id: number;
  country: Country;
  name: string;
}

interface Country {
  id: number;
  name: string;
  code: string;
  phone_prefix: string;
}

interface Reseller {
  id: number;
  name: string;
  company: string;
}

interface Role {
  role_id: number;
  role_name: string;
  role_field: string;
}

interface Balance {
  balance: number;
  currency: Currency;
}

interface Currency {
  id: number;
  country: string;
  currency: string;
  symbol: string;
  code: string;
}