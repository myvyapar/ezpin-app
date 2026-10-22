import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/modules/user-panel/shop/services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private router: Router, private cartService: CartService) { }

  getItem(item: string) {
    try {
      return JSON.parse(localStorage.getItem(item));
    } catch (e) {
      this.logOutUser();
    }
  }

  setItem(item: string, data) {
    localStorage.setItem(item, JSON.stringify(data));
  }

  deleteItem(item) {
    localStorage.removeItem(item);
  }

  get isLoggedIn() {
    return (
      !!localStorage.getItem('accessToken') &&
      !!localStorage.getItem('refreshToken')
    );
  }

  logOutUser() {
    localStorage.clear();
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }
}
