export interface CheckCard {
  transaction_id?: any;
  serial: string;
  to_serial?: any;
  product: Product;
  status: number;
  status_text: string;
  created_time: string;
  provider: string;
  amount: number;
  can_activate: boolean;
  can_deactivate: boolean;
  activation_price?: any;
}

interface Product {
  id: number;
  title: string;
  upc: number;
  price_min: number;
  price_max: number;
  image: string;
  card_type: number;
  currency_data: CurrencyData;
  description: string;
  suggestions: Suggestion[];
  available_cards_text: string;
  price_ranges_ratio: PriceRangesRatio[];
}

interface PriceRangesRatio {
  price_min: number;
  price_max: number;
  ratio: number;
}

interface Suggestion {
  id: number;
  price: number;
  showing_price?: any;
  is_favorite: boolean;
  available_cards: number;
  available_cards_text: string;
}

interface CurrencyData {
  id: number;
  country: string;
  currency: string;
  symbol: string;
  code: string;
}