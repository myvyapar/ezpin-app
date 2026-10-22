import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Event, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConvertTimezone } from 'src/app/modules/shared/pipes/convert-timezone.pipe';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { ShopService } from '../../services/shop.service';
import { OrdersResendComponent } from '../orders-resend/orders-resend.component';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';
import { PermissionService } from '../../services/permission.service';
import { DynamicScript } from 'src/app/modules/shared/services/dynamic-script.service';
import { StateService } from 'src/app/modules/shared/services/storage/state.service';

declare var FreshworksWidget: any;
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  currentStep: String = 'eGift';
  eGiftOrders = [];
  physicalOrders = [];
  cryptoOrders = [];
  isHiddenTabs: boolean = false;
  detailEGift;
  hasEGiftPermission = false;
  hasPhysicalPermission = false;
  hasCryptoPermission = false;
  eGiftScrollOption = {
    isFinish: false,
    offset: 0,
    limit: 20,
    isScroll: true,
    isFirstAccess: true,
    isEmpty: false,
  };
  physicalScrollOption = {
    isFinish: false,
    offset: 0,
    limit: 20,
    isScroll: true,
    isFirstAccess: true,
    isEmpty: false,
  };
  cryptoScrollOption = {
    isFinish: false,
    offset: 0,
    limit: 20,
    isScroll: true,
    isFirstAccess: true,
    isEmpty: false,
  };

  constructor(
    private shopService: ShopService,
    private bottomSheet: MatBottomSheet,
    private convertTimeZone: ConvertTimezone,
    private datePipe: DatePipe,
    private snackBarService: SnackBarService,
    private router: Router,
    private permission: PermissionResolverService,
    private permissionService: PermissionService,
    private dynamicScript: DynamicScript,
    private stateService: StateService
  ) {}

  onScrollEGifts() {
    if (!this.eGiftScrollOption.isFinish && this.currentStep == 'eGift') {
      this.eGiftScrollOption.isScroll = true;
      this.getEGiftOrders();
    }
  }

  onScrollPhysical() {
    if (!this.physicalScrollOption.isFinish && this.currentStep == 'physical') {
      this.physicalScrollOption.isScroll = true;
      this.getPhysicalOrders();
    }
  }

  onScrollCrypto() {
    if (!this.cryptoScrollOption.isFinish && this.currentStep == 'crypto') {
      this.cryptoScrollOption.isScroll = true;
      this.getCryptoOrders();
    }
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe((e: RouterEvent) => {
        this.setRoute(e);
      });
  }

  ngOnInit(): void {
    this.initFreshWidget();
    this.checkRoute();
    this.setTabPermissions();
    this.getOrderList();
  }

  initFreshWidget() {
    this.stateService.getWidgetStatus().subscribe((isLoadedWidget) => {
      if (!isLoadedWidget) {
        this.dynamicScript.loadFreshWorkWidget().then(() => {
          this.hideLuncher();
        });
      }
    });
  }

  hideLuncher() {
    FreshworksWidget('hide', 'launcher');
    this.stateService.loadedWidget();
  }

  checkRoute() {
    if (this.router.url != 'panel/shop/orders') {
      this.router.navigate(['panel/shop/orders']);
    }
  }

  setTabPermissions() {
    this.hasEGiftPermission = this.permissionService.accessList.digital;
    this.hasPhysicalPermission = this.permissionService.accessList.physical;
    this.hasCryptoPermission = this.permissionService.accessList.crypto;
  }

  getOrderList() {
    if (this.hasEGiftPermission) {
      this.getEGiftOrders();
    } else if (this.hasPhysicalPermission) {
      this.getPhysicalOrders();
      this.currentStep = 'physical';
    } else if (this.hasCryptoPermission) {
      this.getCryptoOrders();
      this.currentStep = 'crypto';
    } else {
      this.router.navigate(['panel/shop/profile']);
    }
  }

  selectTab(step) {
    window.scrollTo(0, 0);
    this.currentStep = step;
    if (
      this.currentStep == 'physical' &&
      this.physicalScrollOption.isFirstAccess
    ) {
      this.getPhysicalOrders();
      this.physicalScrollOption.isFirstAccess = false;
    } else if (
      this.currentStep == 'crypto' &&
      this.cryptoScrollOption.isFirstAccess
    ) {
      this.getCryptoOrders();
      this.cryptoScrollOption.isFirstAccess = false;
    }
  }

  getEGiftOrders() {
    this.shopService
      .getEGiftOrders({
        limit: this.eGiftScrollOption.limit,
        offset: this.eGiftScrollOption.offset,
      })
      .subscribe((data) => {
        if (data.results.length < 1) {
          this.eGiftScrollOption.isEmpty = true;
        }
        this.eGiftOrders = this.eGiftOrders.concat(data.results);
        if (!data.next) {
          this.eGiftScrollOption.isFinish = true;
        }
        this.eGiftScrollOption.isScroll = false;
        this.eGiftScrollOption.offset += 20;
      });
  }

  getPhysicalOrders() {
    this.shopService
      .getPhysicalOrders({
        limit: this.physicalScrollOption.limit,
        offset: this.physicalScrollOption.offset,
      })
      .subscribe((data) => {
        if (data.results.length < 1) {
          this.physicalScrollOption.isEmpty = true;
        }
        this.physicalOrders = this.physicalOrders.concat(data.results);
        if (!data.next) {
          this.physicalScrollOption.isFinish = true;
        }
        this.physicalScrollOption.isScroll = false;
        this.physicalScrollOption.offset += 20;
      });
  }

  getCryptoOrders() {
    this.shopService
      .getCryptoOrderList({
        limit: this.cryptoScrollOption.limit,
        offset: this.cryptoScrollOption.offset,
        currency: 1,
      })
      .subscribe((data) => {
        if (data.results.length < 1) {
          this.cryptoScrollOption.isEmpty = true;
        }
        this.cryptoOrders = this.cryptoOrders.concat(data.results);
        if (!data.next) {
          this.cryptoScrollOption.isFinish = true;
        }
        this.cryptoScrollOption.isScroll = false;
        this.cryptoScrollOption.offset += 20;
      });
  }

  resendEGift(eGift) {
    if (eGift.status != 1) {
      return;
    }

    this.bottomSheet
      .open(OrdersResendComponent, {
        panelClass: 'custom-bottom-sheet',
        data: eGift,
      })
      .afterDismissed()
      .subscribe((sendData) => {
        if (sendData) {
          this.shopService.resendOrder(eGift.id, sendData).subscribe((data) => {
            this.snackBarService.showSnackBar(data.detail, 'primary', 2000);
          });
        }
      });
  }

  resendCrypto(crypto) {
    if (crypto.status != 1) {
      return;
    }

    this.bottomSheet
      .open(OrdersResendComponent, {
        panelClass: 'custom-bottom-sheet',
        data: crypto,
      })
      .afterDismissed()
      .subscribe((sendData) => {
        if (sendData) {
          this.shopService
            .resendCryptoOrder(crypto.id, sendData)
            .subscribe((data) => {
              this.snackBarService.showSnackBar(data.detail, 'primary', 2000);
            });
        }
      });
  }

  onDetailSelect(eGift) {
    this.isHiddenTabs = true;
    this.detailEGift = eGift;
    this.currentStep = 'detail-eGift';
    this.router.navigate(['/panel/shop/orders'], { fragment: `detail` });
  }

  calcTotalPrice(price, count) {
    if (!price || !count) {
      return null;
    }

    return price * count;
  }

  backStep() {
    this.router.navigate(['/panel/shop/orders']);
  }

  helpButton(orderId) {
    let name = this.permission.permissionInitInfo.profile.name;
    let email = this.permission.permissionInitInfo.profile.email;
    FreshworksWidget('open');
    FreshworksWidget('prefill', 'ticketForm', {
      name,
      email,
      custom_fields: {
        cf_order_number: orderId,
      },
    });
    FreshworksWidget('disable', 'ticketForm', ['email', 'name']);
  }

  setRoute(e: RouterEvent) {
    if (e.url == '/panel/shop/orders') {
      this.selectTab('eGift');
      this.isHiddenTabs = false;
      this.detailEGift = false;
    }
  }
}
