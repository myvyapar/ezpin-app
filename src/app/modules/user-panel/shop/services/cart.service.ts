import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from './../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cart = new BehaviorSubject<Cart>(null);

  constructor() { }

  get getCart(): Observable<Cart> {
    return this.cart.asObservable();
  }

  setCart(cart: Cart) {
    this.cart.next(cart);
  }

  clearCart() {
    this.cart.next(null);
  }

}