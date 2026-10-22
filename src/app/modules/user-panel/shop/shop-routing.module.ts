import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CryptoComponent } from './components/crypto/crypto.component';
import { EgiftComponent } from './components/egift/egift.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PhysicalComponent } from './components/physical/physical.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { WalletComponent } from './components/wallet/wallet.component';

const routes: Routes = [
  {
    path: '',
    component: EgiftComponent,
  },
  {
    path: 'favorite',
    component: FavoriteComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'activate',
    component: PhysicalComponent,
  },
  {
    path: 'crypto',
    component: CryptoComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'wallet',
    component: WalletComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'menu',
    component: UserMenuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
