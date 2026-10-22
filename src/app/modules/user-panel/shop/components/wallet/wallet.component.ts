import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { Permission } from 'src/app/modules/shared/models/permission.model';
import { ShopService } from '../../services/shop.service';
import { MatDialog } from '@angular/material/dialog';
import { WalletOrderDetailComponent } from '../wallet-order-detail/wallet-order-detail.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  userInfo: Permission;
  isWalletList: boolean = true;
  walletCurrencyList = [];
  isFinish: boolean = false;
  offset: number = 0;
  limit: number = 20;
  selectedCurrencyId: number;
  selectedCurrencyTitle: string;
  isScroll: boolean = true;

  constructor(
    private permissionResolver: PermissionResolverService,
    private _location: Location,
    private sharedService: SharedService,
    private shopService: ShopService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  onScroll() {
    if (!this.isFinish && !this.isWalletList) {
      this.isScroll = true;
      this.getCurrencyDetail();
    }
  }

  getUserInfo() {
    this.sharedService.getUserPermissions().subscribe((data) => {
      this.userInfo = data;
    });
  }

  selectCurrency(balance) {
    this.isWalletList = false;
    this.selectedCurrencyId = balance.currency.id;
    this.selectedCurrencyTitle = `${balance.currency.country}-${balance.currency.currency}(${balance.currency.symbol})`;
    this.getCurrencyDetail();
  }

  getCurrencyDetail() {
    let user_id = this.permissionResolver.permissionInitInfo.profile.id;
    let amount_types =
      '1,-7,2,-6,6,-5,14,-3,-1,3,8,-8,11,12,-12,-13,13,-9,9,-10,10';
    let parameters = {
      user_id,
      amount_types,
      currency_id: this.selectedCurrencyId,
      limit: this.limit,
      offset: this.offset,
    };

    this.shopService.getWalletCurrencyDetail(parameters).subscribe((data) => {
      this.walletCurrencyList = this.walletCurrencyList.concat(data.results);

      if (!data.next) {
        this.isFinish = true;
      }
      this.offset += 20;
      this.isScroll = false;
    });
  }

  backStep() {
    if (this.isWalletList) {
      this._location.back();
    } else {
      this.offset = 0;
      this.isScroll = true;
      this.isFinish = false;
      this.isWalletList = true;
      this.walletCurrencyList = [];
    }
  }

  mathAbs(amount) {
    if (amount) {
      return Math.abs(amount);
    }
  }

  digitalOrderDetail(orders) {
    const dialogRef = this.dialog.open(WalletOrderDetailComponent, {
      minWidth: '350px',
      maxWidth: '500px',
      panelClass: 'backdropBackground',
      data: { orders },
    });
  }
}
