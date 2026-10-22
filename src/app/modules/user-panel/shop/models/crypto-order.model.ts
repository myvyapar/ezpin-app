import { Pagination } from 'src/app/modules/shared/models/pagination.model';

export interface CryptoOrders extends Pagination {
    results: Order[];
}

export interface Order {
    id: number;
    requested_price: number;
    price: number;
    sub_user_data?: SubUserDatum;
    crypto_currency_data: CryptoCurrencyData;
    currency_data: CurrencyData;
    status: number;
    crypto_wallet?: any;
    status_text: string;
    commission_percent: number;
    commission_price: number;
    network_fee: number;
    crypto_amount: number;
    crypto_price: number;
    can_pay: boolean;
    is_used: boolean;
    used_time?: any;
    created_time: string;
}

interface CurrencyData {
    id: number;
    country: string;
    currency: string;
    symbol: string;
    code: string;
}

interface CryptoCurrencyData {
    id: number;
    title: string;
    code: string;
    symbol: string;
}

interface SubUserDatum {
    id: number;
    name: string;
}