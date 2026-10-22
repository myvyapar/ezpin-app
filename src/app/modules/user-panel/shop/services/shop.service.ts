import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlBuilderService } from 'src/app/modules/shared/services/url-builder.service';
import { Category } from '../models/category.model';
import { CreateOrder } from '../models/order.model';
import { Products } from '../models/products.model';
import { ExchangeRates } from '../models/exchange-rate.mode';
import { CheckCard } from '../models/check-card.model';
import { CryptoCurrencies } from '../models/crypto.model';
import { CryptoOrders } from '../models/crypto-order.model';
import { EGiftOrder } from '../models/egift-orders.model';
import { PhysicalOrders } from '../models/physical-orders.model';
import { CurrencyDetails } from '../models/currency-details.model';
import { Invoice } from '../models/invoice.model';
import { Regions } from '../models/regions.model';
@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(
    private http: HttpClient,
    private urlBuilder: UrlBuilderService
  ) { }

  getCategoryList(parameters): Observable<Category[]> {
    let params = new HttpParams();

    for (let param in parameters) {
      if (parameters[param]) {
        params = params.append(param.toString(), parameters[param]);
      }
    }
    let url = this.urlBuilder.urlBuild('cards', 'categories');
    return this.http.get<Category[]>(url, { params });
  }

  getBulkCategories(): Observable<Category[]> {
    let params = new HttpParams();
    params = params.append('types', '1,3,4');

    let url = this.urlBuilder.urlBuild('cards', 'categories');
    return this.http.get<Category[]>(url, { params });
  }

  getProductList(parameters): Observable<Products> {
    let params = new HttpParams();

    for (let param in parameters) {
      params = params.append(param.toString(), parameters[param]);
    }

    let url = this.urlBuilder.urlBuild('cards', 'products');
    return this.http.get<Products>(url, { params });
  }

  getFavoriteList(parameters): Observable<Products> {
    let params = new HttpParams();

    for (let param in parameters) {
      params = params.append(param.toString(), parameters[param]);
    }

    let url = this.urlBuilder.urlBuild('cards', 'products', 'favorites');
    return this.http.get<Products>(url, { params });
  }

  checkCard(parameters): Observable<CheckCard> {
    let params = new HttpParams();

    for (let param in parameters) {
      params = params.append(param.toString(), parameters[param]);
    }

    let url = this.urlBuilder.urlBuild('cards', 'check');
    return this.http.get<CheckCard>(url, { params });
  }

  getSearchList(parameters): Observable<Products> {
    let params = new HttpParams();

    for (let param in parameters) {
      params = params.append(param.toString(), parameters[param]);
    }

    let url = this.urlBuilder.urlBuild('cards', 'products');
    return this.http.get<Products>(url, { params });
  }

  createOrder(order: CreateOrder): Observable<any> {
    let url = this.urlBuilder.urlBuild('digital_card', 'orders');
    return this.http.post(url, order);
  }

  activateSingle(card): Observable<any> {
    let url = this.urlBuilder.urlBuild('cards', 'transactions', 'activate');
    return this.http.post(url, card);
  }

  activatePhysical(card): Observable<any> {
    let url = this.urlBuilder.urlBuild('cards', 'transactions', 'activate');
    return this.http.post(url, card);
  }

  getExchangeRanges(): Observable<ExchangeRates[]> {
    let url = this.urlBuilder.urlBuild(
      'finance',
      'exchanges',
      'exchange_rates'
    );
    return this.http.get<ExchangeRates[]>(url);
  }

  financeExchange(exchange): Observable<any> {
    let url = this.urlBuilder.urlBuild('finance', 'exchanges');
    return this.http.post(url, exchange);
  }

  addToFavorite(id: number): Observable<any> {
    let url = this.urlBuilder.urlBuild('cards', 'suggestions', id, 'favorite');
    return this.http.post(url, {});
  }

  deleteFromFavorite(id: number): Observable<any> {
    let url = this.urlBuilder.urlBuild('cards', 'suggestions', id, 'favorite');
    return this.http.delete(url);
  }

  getCryptoCurrency(): Observable<CryptoCurrencies> {
    let url = this.urlBuilder.urlBuild('crypto_market', 'crypto_currencies');
    return this.http.get<CryptoCurrencies>(url);
  }

  getCryptoOrderList(parameters): Observable<CryptoOrders> {
    let params = new HttpParams();

    for (let param in parameters) {
      params = params.append(param.toString(), parameters[param]);
    }
    let url = this.urlBuilder.urlBuild('crypto_market', 'crypto_orders');
    return this.http.get<CryptoOrders>(url, { params });
  }

  getCryptoCommission(): Observable<any> {
    let url = this.urlBuilder.urlBuild(
      'crypto_market',
      'crypto_currencies',
      '1',
      'percent_to_me'
    );
    return this.http.get<any>(url);
  }

  createCryptoOrder(order): Observable<any> {
    let url = this.urlBuilder.urlBuild('crypto_market', 'crypto_orders');
    return this.http.post(url, order);
  }

  finalizeOrder(id, order): Observable<any> {
    let url = this.urlBuilder.urlBuild(
      'crypto_market',
      'crypto_orders',
      `${id}`,
      'finalize'
    );
    return this.http.post(url, order);
  }

  getEGiftOrders(parameters): Observable<EGiftOrder> {
    let params = new HttpParams();

    for (let param in parameters) {
      params = params.append(param.toString(), parameters[param]);
    }
    let url = this.urlBuilder.urlBuild('digital_card', 'orders');
    return this.http.get<EGiftOrder>(url, { params });
  }

  getRegions(): Observable<Regions> {
    let url = this.urlBuilder.urlBuild('locations/country/?only_region=true&limit=1000');
    return this.http.get<Regions>(url);
  }

  getPhysicalOrders(parameters): Observable<PhysicalOrders> {
    let params = new HttpParams();

    for (let param in parameters) {
      params = params.append(param.toString(), parameters[param]);
    }

    let url = this.urlBuilder.urlBuild('cards', 'transactions');
    return this.http.get<PhysicalOrders>(url, { params });
  }

  resendOrder(id, order): Observable<any> {
    let url = this.urlBuilder.urlBuild(
      'digital_card',
      'orders',
      `${id}`,
      'resend'
    );
    return this.http.post(url, order);
  }

  resendCryptoOrder(id, order): Observable<any> {
    let url = this.urlBuilder.urlBuild(
      'crypto_market',
      'crypto_orders',
      `${id}`,
      'resend'
    );
    return this.http.post(url, order);
  }

  getWalletCurrencyDetail(parameters): Observable<CurrencyDetails> {
    let params = new HttpParams();

    for (let param in parameters) {
      params = params.append(param.toString(), parameters[param]);
    }

    let url = this.urlBuilder.urlBuild('finance', 'wallet');
    return this.http.get<CurrencyDetails>(url, { params });
  }

  getInvoices(orderId): Observable<Invoice> {
    let url = this.urlBuilder.urlBuild('digital_card', 'orders', orderId, 'bill');
    return this.http.post<Invoice>(url, {});
  }
}
