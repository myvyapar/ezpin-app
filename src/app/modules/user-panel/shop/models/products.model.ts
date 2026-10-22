import { Pagination } from 'src/app/modules/shared/models/pagination.model';
export interface Products extends Pagination {
  results: Product[];
}

export interface Product {
  id: number;
  title: string;
  upc: number;
  image: string;
  description: string;
  active: boolean;
  price_min: number;
  price_max: number;
  price_fix: number;
  is_featured: boolean;
  card_type: number;
  currency_data: CurrencyData;
  pre_order: boolean;
  super_immediate: boolean;
  hide_range: boolean;
  suggestions: Suggestion[];
  available_cards_text: string;
  price_ranges_ratio: PriceRangesRatio[];
  limit_quantity:any,
  limit_price:any
}

interface PriceRangesRatio {
  price_min: number;
  price_max: number;
  ratio: number;
}

interface Suggestion {
  id: number;
  title: string;
  upc?: null | number | number;
  price: number;
  price_fix?: null | number | number;
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
