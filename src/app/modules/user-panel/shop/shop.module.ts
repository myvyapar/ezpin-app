import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShopRoutingModule } from './shop-routing.module';
import { EgiftComponent } from './components/egift/egift.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { SearchComponent } from './components/search/search.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { BuyProductComponent } from './components/buy-product/buy-product.component';
import { DecimalPipe } from '@angular/common';
import { CartComponent } from './components/cart/cart.component';
import { PinCodeComponent } from './components/pin-code/pin-code.component';
import { ExchangeProcessComponent } from './components/exchange-process/exchange-process.component';
import { PhysicalComponent } from './components/physical/physical.component';
import { SingleActivateComponent } from './components/single-activate/single-activate.component';
import { BulkActivateComponent } from './components/bulk-activate/bulk-activate.component';
import { SingleActivateBottomSheetComponent } from './components/single-activate-bottom-sheet/single-activate-bottom-sheet.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';
import { CryptoComponent } from './components/crypto/crypto.component';
import { ConvertTimezone } from 'src/app/modules/shared/pipes/convert-timezone.pipe';
import { DecimalLimitDirective } from 'src/app/modules/shared/directives/decimal-limit.directive';
import { CryptoFinalizeComponent } from './components/crypto-finalize/crypto-finalize.component';
import { DatePipe } from '@angular/common';
import { OrdersComponent } from './components/orders/orders.component';
import { OrdersResendComponent } from './components/orders-resend/orders-resend.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { WalletOrderDetailComponent } from './components/wallet-order-detail/wallet-order-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProductDescriptionComponent } from './components/product-description/product-description.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  declarations: [
    EgiftComponent,
    FavoriteComponent,
    ProductCardComponent,
    SearchComponent,
    BuyProductComponent,
    CartComponent,
    PinCodeComponent,
    ExchangeProcessComponent,
    PhysicalComponent,
    SingleActivateComponent,
    BulkActivateComponent,
    SingleActivateBottomSheetComponent,
    MessageDialogComponent,
    CryptoComponent,
    ConvertTimezone,
    DecimalLimitDirective,
    CryptoFinalizeComponent,
    OrdersComponent,
    OrdersResendComponent,
    WalletComponent,
    WalletOrderDetailComponent,
    ProfileComponent,
    ProductDescriptionComponent,
    UserMenuComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    LazyLoadImageModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatTabsModule,
    NgxQRCodeModule,
    MatExpansionModule,
  ],
  providers: [DecimalPipe, DatePipe, ConvertTimezone],
})
export class ShopModule {}
