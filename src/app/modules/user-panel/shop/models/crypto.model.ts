import { Pagination } from 'src/app/modules/shared/models/pagination.model';

export interface CryptoCurrencies extends Pagination {
    results: Crypto[];
}

export interface Crypto {
    id: number;
    title: string;
    allowed_currencies: AllowedCurrency[];
    code: string;
    symbol: string;
    active: boolean;
    created_time: string;
}

interface AllowedCurrency {
    id: number;
    currency: Currency;
    price: number;
    min_amount: number;
    max_amount: number;
    updated_time: string;
}

interface Currency {
    id: number;
    country: string;
    currency: string;
    symbol: string;
    code: string;
}