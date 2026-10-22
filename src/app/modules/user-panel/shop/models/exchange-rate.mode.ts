export interface ExchangeRates {
  from_currency_data: FromCurrencyData;
  to_currency_data: FromCurrencyData;
  rate: number;
}

interface FromCurrencyData {
  id: number;
  country: string;
  currency: string;
  symbol: string;
  code: string;
}